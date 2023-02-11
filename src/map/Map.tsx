import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, {
    GeolocateControl,
    GeolocateControlRef,
    ImmutableLike,
    MapboxStyle,
    MapRef
} from 'react-map-gl';
import { WorldMapControl } from '../components/WorldMapControl';
import { WorldMarkers } from '../components/WorldMarkers';
import { useActions } from '../context/dynamic/actions';
import { useCtx } from '../context/dynamic/provider';
import { useMouseListener } from '../hooks/mouse/useMouseListener';
import { EMapStyle, IMapConfig, IMapProps } from '../utils/map/mapTypes';
import { IWorldMarker } from '../utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    mapRef: React.RefObject<MapRef>;
    markers: IWorldMarker[];
    selectedIds: string[];
    children?: React.ReactNode;
    config?: IMapConfig;
    selectableMarkersStyle: React.CSSProperties;
    highlightedMarkers: string[];
    highlightedMarkersStyle: React.CSSProperties;
    categories: string[];
    selectedCategories: string[];
}

const defaults: Partial<IMapProps> = {
    reuseMaps: true,
    dragRotate: false,
    boxZoom: false,
    dragPan: true,
    scrollZoom: true,
    doubleClickZoom: true
};

export const Map = (props: IProps): JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(props.mapRef?.current?.loaded() ?? false);
    const actions = useActions();
    const { state } = useCtx();
    const geoRef = useRef<GeolocateControlRef>(null);
    const wrapperMapRef = useRef<HTMLDivElement>(null);
    const [selectedMapStyle, setSelectedMapStyle] = useState<
        MapboxStyle | string | ImmutableLike | EMapStyle
    >(getInitMapStyle());

    useEffect(() => {
        if (props.map.mapStyle) {
            setSelectedMapStyle(props.map.mapStyle);
        }
    }, [props.map.mapStyle]);

    useEffect(() => {
        if (!_.isEqual(props.selectedIds.sort(), state.selectedIds.sort())) {
            actions.setSelectedIds(props.selectedIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedIds]);

    useEffect(() => {
        if (props.mapRef?.current?.loaded()) {
            setLoaded(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mapRef?.current?.loaded()]);

    useEffect(() => {
        if (loaded) {
            props.mapRef?.current?.getMap()?.touchZoomRotate?.disableRotation?.();
            props.mapRef?.current?.getMap()?.touchPitch.disable();
            props.mapRef?.current?.getMap()?.keyboard.disable();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);

    const layerIds = props.markers
        .map((marker) => {
            if (marker.elementType === 'route' || marker.elementType === 'direction') {
                return marker.id + '|line-click';
            }
            if (marker.elementType === 'polygon' && marker.elementData.renderAs3d) {
                return marker.id + '|layer';
            }
        })
        .filter((val): val is string => {
            return val !== undefined;
        })
        .concat(props.map.interactiveLayerIds ?? []);

    function getInitMapStyle() {
        if (props.map.mapStyle) {
            return props.map.mapStyle;
        } else if (props.config?.availableStyles?.[0]) {
            return props.config.availableStyles[0];
        } else {
            return EMapStyle.DEFAULT;
        }
    }

    // Fill in default values
    const markers = props.markers.map((m, i) => ({
        ...m,
        order: m.order ?? i,
        scalable: m.scalable ?? true,
        scale: m.scale ?? 1
    }));

    const mouseListener = useMouseListener(markers, props.mapRef, wrapperMapRef);

    useEffect(() => {
        if (props.mapRef?.current && wrapperMapRef.current) {
            document.addEventListener('mouseup', mouseListener.onMouseUp);
            document.addEventListener('mousedown', mouseListener.onMouseDown);
        }
        return () => {
            document.removeEventListener('mouseup', mouseListener.onMouseUp);
            document.removeEventListener('mousedown', mouseListener.onMouseDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.mapRef, mouseListener]);

    useEffect(() => {
        if (!props.config?.availableStyles?.includes(selectedMapStyle as string)) {
            setSelectedMapStyle(getInitMapStyle());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.map.mapStyle, props.config?.availableStyles?.length]);

    return (
        <div ref={wrapperMapRef} style={{ width: '100%', height: '100%' }}>
            <ReactMapGL
                {...defaults}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(props.map as any)}
                ref={props.mapRef}
                style={{
                    width: '100%',
                    height: '100%',
                    ...props.map.style
                }}
                onClick={(e) => {
                    const features = e.features ?? [];
                    if (features.length > 0) {
                        const marker = markers
                            .filter((e) => e.selectable)
                            .find((e) => e.id === features[0].source);
                        if (marker) {
                            state.callbacks.onMarkersSelected?.([marker.id]);
                        }
                    }
                    props.map.onClick?.(e);
                }}
                onLoad={() => {
                    setLoaded(true);
                }}
                onRender={(event) => {
                    event.target.resize();
                    props.map.onRender?.(event);
                }}
                interactiveLayerIds={layerIds ?? []}
                mapStyle={selectedMapStyle}
            >
                {loaded && (
                    <>
                        <WorldMarkers
                            markers={markers}
                            zoom={props.map.zoom ?? 1}
                            selectableMarkersStyle={props.selectableMarkersStyle}
                            highlightedMarkers={props.highlightedMarkers}
                            highlightedMarkersStyle={props.highlightedMarkersStyle}
                        />
                        <WorldMapControl
                            onGeoClick={() => {
                                geoRef?.current?.trigger();
                            }}
                            geolocate={props.config?.geolocate}
                            selectedMapStyle={selectedMapStyle}
                            mapStyles={
                                props.config?.availableStyles ?? [
                                    EMapStyle.DEFAULT,
                                    EMapStyle.SATELLITE,
                                    EMapStyle.OUTDOOR
                                ]
                            }
                            onStyleChange={(style) => {
                                setSelectedMapStyle(style);
                                state.callbacks.onStyleChanged?.(style);
                            }}
                        />
                        {props.config?.geolocate && (
                            <GeolocateControl ref={geoRef} style={{ display: 'none' }} />
                        )}
                        {props.children}
                    </>
                )}
            </ReactMapGL>
        </div>
    );
};
