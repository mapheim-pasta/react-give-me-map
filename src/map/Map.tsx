import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, {
    GeolocateControl,
    GeolocateControlRef,
    ImmutableLike,
    MapRef,
    MapboxStyle
} from 'react-map-gl';
import { WorldMapControl } from '../components/WorldMapControl';
import { WorldMarkersV1 } from '../components/WorldMarkersV1';
import { WorldMarkersV2 } from '../components/WorldMarkersV2';
import { useActions } from '../context/dynamic/actions';
import { useCtx } from '../context/dynamic/provider';
import { useMouseListener } from '../hooks/mouse/useMouseListener';
import { EMapStyle, IMapConfig, IMapProps, MarkerStyle } from '../utils/map/mapTypes';
import { IWorldMarker, IWorldV1Marker, IWorldV2Marker } from '../utils/world/worldTypes';
import { useWorldMarkersV1Data } from './useWorldMarkersV1Data';
import { useWorldMarkersV2Data } from './useWorldMarkersV2Data';

interface IProps {
    map: IMapProps;
    mapRef: React.RefObject<MapRef>;
    v1Markers: IWorldV1Marker[];
    v2Markers: IWorldV2Marker[];
    selectedIds: string[];
    children?: React.ReactNode;
    config?: IMapConfig;
    selectableMarkersStyle?: MarkerStyle;
    highlightedMarkers: string[];
    highlightedMarkersStyle?: MarkerStyle;
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
    const mapRef = props.mapRef?.current;

    const [geoTriggered, setGeoTriggered] = useState<boolean>(false);
    const [geoShow, setGeoShow] = useState(true);

    const v1MarkersData = useWorldMarkersV1Data(props.v1Markers);
    const v2MarkersData = useWorldMarkersV2Data(props.v2Markers);

    const clickableLayersRef = useRef(new Set<string>());
    const currentHoveredRef = useRef(new Set<string>());

    const layerIds = (props.map.interactiveLayerIds ?? [])
        .concat(v1MarkersData.layerIds)
        .concat(v2MarkersData.layerIds);
    const clickableSourceIds = v1MarkersData.clickableSourceIds.concat(
        v2MarkersData.clickableSourceIds
    );

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

    function registerClickEvents(sourceIds: string[]) {
        sourceIds.forEach((sourceId) => {
            if (!clickableLayersRef.current.has(sourceId)) {
                clickableLayersRef.current.add(sourceId);
                mapRef?.on('mouseleave', sourceId, (e) => {
                    currentHoveredRef.current.delete(sourceId);
                    if (currentHoveredRef.current.size === 0) {
                        mapRef.getCanvas().style.cursor = '';
                    }
                });
                mapRef?.on('mouseenter', sourceId, () => {
                    currentHoveredRef.current.add(sourceId);
                    mapRef.getCanvas().style.cursor = 'pointer';
                });
            }
        });
    }

    useEffect(() => {
        if (loaded) {
            const mapRef = props.mapRef?.current;

            mapRef?.getMap()?.touchZoomRotate?.disableRotation?.();
            mapRef?.getMap()?.touchPitch.disable();
            mapRef?.getMap()?.keyboard.disable();

            registerClickEvents(clickableSourceIds);

            props.map.onLoad(mapRef);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);

    useEffect(() => {
        if (loaded) {
            registerClickEvents(clickableSourceIds);
        }
    }, [clickableSourceIds]);

    function getInitMapStyle() {
        if (props.map.mapStyle) {
            return props.map.mapStyle;
        } else if (props.config?.availableStyles?.[0]) {
            return props.config.availableStyles[0];
        } else {
            return EMapStyle.DEFAULT;
        }
    }

    const mouseListener = useMouseListener(props.v1Markers, props.mapRef, wrapperMapRef);

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

                    const clickData = { lat: e.lngLat.lat, lng: e.lngLat.lng };

                    if (features.length > 0) {
                        const feature = features[0];
                        const source = feature.source.split('|')[0];

                        const selectableMarkersV1: IWorldMarker[] = props.v1Markers.filter(
                            (e) => e.selectable
                        );
                        const selectableMarkersV2: IWorldMarker[] = props.v2Markers.filter(
                            (e) => e.selectable
                        );

                        const marker = [...selectableMarkersV1, ...selectableMarkersV2].find(
                            (marker) => marker.id === source
                        );

                        if (marker) {
                            state.callbacks.onMarkersSelected?.([marker.id], clickData);
                            props.map.onClick?.(e);
                            return;
                        }

                        if (feature?.properties?.markerId) {
                            state.callbacks.onMarkersSelected?.(
                                [feature?.properties?.markerId],
                                clickData
                            );
                            props.map.onClick?.(e);
                            return;
                        }

                        if (feature?.layer?.id === 'clusters') {
                            const clusterId = feature?.properties?.cluster_id;

                            const clusterSource =
                                props.mapRef.current?.getSource('clusters-source');

                            clusterSource?.type === 'geojson' &&
                                clusterSource.getClusterLeaves(
                                    clusterId,
                                    99999,
                                    0,
                                    (err, leaves) => {
                                        const markerIds = leaves.map((e) => e.properties?.markerId);
                                        state.callbacks.onMarkersSelected?.(markerIds, clickData);
                                    }
                                );

                            return;
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
                        <WorldMarkersV1
                            mapRef={props.mapRef}
                            markers={props.v1Markers}
                            zoom={props.map.zoom ?? 1}
                            selectableMarkersStyle={props.selectableMarkersStyle}
                            highlightedMarkers={props.highlightedMarkers}
                            highlightedMarkersStyle={props.highlightedMarkersStyle}
                            groupMarkerProps={props.config?.groupMarkerProps ?? {}}
                        />
                        <WorldMarkersV2
                            markers={props.v2Markers}
                            highlightedMarkerIds={props.highlightedMarkers}
                            mapRef={props.mapRef}
                        />
                        <WorldMapControl
                            onGeoClick={() => {
                                if (!geoTriggered) {
                                    setGeoShow(true);
                                    setTimeout(() => {
                                        geoRef?.current?.trigger();
                                        setGeoTriggered(true);
                                    }, 250);
                                } else {
                                    setGeoTriggered(false);
                                    setGeoShow(false);
                                }
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
                        {props.config?.geolocate && geoShow && (
                            <GeolocateControl ref={geoRef} style={{ display: 'none' }} />
                        )}
                        {props.children}
                    </>
                )}
            </ReactMapGL>
        </div>
    );
};
