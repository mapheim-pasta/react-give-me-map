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
import { EMapStyle, IMapConfig, IMapProps } from '../utils/map/mapTypes';
import { IWorldMarker } from '../utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    mapRef?: React.RefObject<MapRef>;
    markers: IWorldMarker[];
    selectedIds: string[];
    children?: React.ReactNode;
    config?: IMapConfig;
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
    const [loaded, setLoaded] = useState<boolean>(false);
    const actions = useActions();
    const { state } = useCtx();
    const geoRef = useRef<GeolocateControlRef>(null);
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
            console.log('Update!!!');
            actions.setSelectedIds(props.selectedIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedIds]);

    const layerIds = props.markers
        .map((marker) => {
            if (marker.elementType === 'route' || marker.elementType === 'direction') {
                return marker.id + '|line-click';
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

    useEffect(() => {
        if (!props.config?.availableStyles?.includes(selectedMapStyle as string)) {
            setSelectedMapStyle(getInitMapStyle());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.map.mapStyle, props.config?.availableStyles?.length]);

    return (
        <>
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
                        state.callbacks.onMarkersSelected?.([features[0].source]);
                    }
                    props.map.onClick?.(e);
                }}
                onLoad={(e) => {
                    setLoaded(true);
                    props.map.onLoad?.(e);
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
                        <WorldMarkers markers={props.markers} zoom={props.map.zoom ?? 1} />
                        <WorldMapControl
                            onGeoClick={() => {
                                console.log('Geo click');
                                geoRef?.current?.trigger();
                            }}
                            selectedMapStyle={selectedMapStyle}
                            mapStyles={
                                props.config?.availableStyles ?? [
                                    EMapStyle.DEFAULT,
                                    EMapStyle.SATELLITE,
                                    EMapStyle.OUTDOOR
                                ]
                            }
                            onStyleChange={(style) => {
                                console.log('Set map style2', style);
                                setSelectedMapStyle(style);
                                state.callbacks.onStyleChanged?.(style);
                            }}
                        />
                        <GeolocateControl ref={geoRef} style={{ display: 'none' }} />
                        {props.children}
                    </>
                )}
            </ReactMapGL>
        </>
    );
};
