import _, { orderBy } from 'lodash';
import { MapEvent, MapMouseEvent, StyleSpecification } from 'mapbox-gl';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { GeolocateControl, MapRef } from 'react-map-gl';
import { ImmutableLike } from 'react-map-gl/dist/esm/types';
import { WorldMapControl } from '../components/WorldMapControl';
import { WorldMarkersV1 } from '../components/WorldMarkersV1';
import { WorldMarkersV2 } from '../components/WorldMarkersV2';
import { useActions } from '../context/dynamic/actions';
import { useCtx } from '../context/dynamic/provider';
import { useMouseListener } from '../hooks/mouse/useMouseListener';
import {
    EMapStyle,
    IMapConfig,
    IMapProps,
    MarkerGlobalSettings,
    MarkerStyle
} from '../utils/map/mapTypes';
import { IWorldMarker, IWorldV1Marker, IWorldV2Marker } from '../utils/world/worldTypes';
import { divideMarkersV2 } from './divideMarkersV2';
import { ICallbacks } from './RegisterPropsToGlobalState';
import { useWorldMarkersV1Data } from './useWorldMarkersV1Data';
import { useWorldMarkersV2Data } from './useWorldMarkersV2Data';

interface IProps {
    map: IMapProps;
    isEditMode: boolean;
    mapRef: React.RefObject<MapRef>;
    v1Markers: IWorldV1Marker[];
    v2Markers: IWorldV2Marker[];
    selectedIds: string[];
    children?: React.ReactNode;
    config?: IMapConfig;
    selectableMarkersStyle?: MarkerStyle;
    highlightedMarkers: string[];
    forceHighlightSelectableMarkers: boolean;
    orderedMarkerIds?: string[];
    highlightedMarkersStyle?: MarkerStyle;
    categories: string[];
    selectedCategories: string[];
    markerGlobalSettings: MarkerGlobalSettings;
    callbacks: ICallbacks;
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
    const geoRef = useRef<mapboxgl.GeolocateControl>(null);
    const wrapperMapRef = useRef<HTMLDivElement>(null);
    const [selectedMapStyle, setSelectedMapStyle] = useState<
        string | ImmutableLike<StyleSpecification> | StyleSpecification
    >(getInitMapStyle());
    const mapRef = props.mapRef?.current;

    const [geoTriggered, setGeoTriggered] = useState<boolean>(false);
    const [geoShow, setGeoShow] = useState(true);

    const v1MarkersData = useWorldMarkersV1Data(props.v1Markers);

    const dividedMarkersV2 = divideMarkersV2(props.v2Markers, {
        isEditMode: props.isEditMode,
        selectedIds: state.selectedIds
    });
    const v2MarkersData = useWorldMarkersV2Data(dividedMarkersV2);

    const clickableLayersRef = useRef(new Set<string>());
    const currentHoveredRef = useRef(new Set<string>());

    const interactiveLayerIds = (props.map.interactiveLayerIds ?? [])
        .concat(v1MarkersData.layerIds)
        .concat(v2MarkersData.layerIds);

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

            registerClickEvents(interactiveLayerIds);

            props.map.onLoad?.(mapRef);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded]);

    useEffect(() => {
        if (loaded) {
            registerClickEvents(interactiveLayerIds);
        }
    }, [interactiveLayerIds]);

    function getInitMapStyle() {
        if (props.map.mapStyle) {
            return props.map.mapStyle;
        } else if (props.config?.availableStyles?.[0]) {
            return props.config.availableStyles[0];
        } else {
            return EMapStyle.DEFAULT;
        }
    }

    const mouseListener = useMouseListener(props.v1Markers, (marker) => {
        props.callbacks.onMarkersSelected?.([marker.id]);
    });

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
                onClick={(e: MapMouseEvent) => {
                    const hasFeatures = e.features && e.features.length;

                    const clickData = { lat: e.lngLat.lat, lng: e.lngLat.lng };

                    if (hasFeatures) {
                        const features = orderBy(
                            e.features,
                            (e) => e.properties?.orderIndex,
                            'desc'
                        );
                        const feature = features[0];
                        const source = feature.source.split('|')[0];

                        const selectableMarkersV1: IWorldMarker[] = props.v1Markers.filter(
                            (e) => e.selectable
                        );
                        const selectableMarkersV2: IWorldMarker[] = props.v2Markers.filter(
                            (e) => e.selectable
                        );

                        // This needs to be handled first for the group wall markers
                        if (feature?.properties?.markerId) {
                            const marker = [...selectableMarkersV1, ...selectableMarkersV2].find(
                                (marker) => marker.id === feature?.properties?.markerId
                            );
                            if (marker) {
                                props.callbacks.onMarkersSelected?.([marker.id], clickData);
                                props.map.onClick?.(e);
                                return;
                            }
                        }

                        const marker = [...selectableMarkersV1, ...selectableMarkersV2].find(
                            (marker) => marker.id === source
                        );

                        if (marker) {
                            props.callbacks.onMarkersSelected?.([marker.id], clickData);
                            props.map.onClick?.(e);
                            return;
                        }

                        if (feature?.properties?.markerId) {
                            props.callbacks.onMarkersSelected?.(
                                [feature?.properties?.markerId],
                                clickData
                            );
                            props.map.onClick?.(e);
                            return;
                        }

                        const possibleClusters = [
                            { id: 'v1', layerId: 'clusters', sourceId: 'clusters-source' },
                            { id: 'v2', layerId: 'icons|cluster', sourceId: 'icons' }
                        ];

                        const clusterHit = possibleClusters.some(({ layerId, sourceId }) => {
                            if (feature?.layer?.id === layerId) {
                                const clusterId = feature?.properties?.cluster_id;

                                const clusterSource = props.mapRef.current?.getSource(sourceId);

                                clusterSource?.type === 'geojson' &&
                                    clusterSource.getClusterLeaves(
                                        clusterId,
                                        99999,
                                        0,
                                        (err: unknown, leaves) => {
                                            const markerIds = leaves?.map(
                                                (e) => e.properties?.markerId
                                            );
                                            if (markerIds?.length) {
                                                props.callbacks.onMarkersSelected?.(
                                                    markerIds,
                                                    clickData
                                                );
                                            }
                                        }
                                    );

                                return true;
                            }
                            return false;
                        });

                        if (clusterHit) {
                            return;
                        }
                    }
                    props.callbacks.onMarkersSelected?.([]);
                    props.map.onClick?.(e);
                }}
                onLoad={() => {
                    setLoaded(true);
                }}
                onRender={(event: MapEvent) => {
                    if (props.config?.resizeOnRender) {
                        event.target.resize();
                    }
                    props.map.onRender?.(event);
                }}
                interactiveLayerIds={interactiveLayerIds}
                mapStyle={selectedMapStyle}
            >
                {loaded && (
                    <>
                        <WorldMarkersV1
                            mapRef={props.mapRef}
                            markers={props.v1Markers}
                            selectableMarkersStyle={props.selectableMarkersStyle}
                            highlightedMarkers={props.highlightedMarkers}
                            forceHighlightSelectableMarkers={props.forceHighlightSelectableMarkers}
                            highlightedMarkersStyle={props.highlightedMarkersStyle}
                            groupMarkerProps={props.config?.groupMarkerProps ?? {}}
                            callbacks={props.callbacks}
                        />
                        <WorldMarkersV2
                            dividedMarkersV2={dividedMarkersV2}
                            isEditMode={props.isEditMode}
                            countriesFillConfig={props.config?.countriesFill}
                            highlightedMarkerIds={props.highlightedMarkers}
                            mapRef={props.mapRef}
                            groupMarkerProps={props.config?.groupMarkerProps ?? {}}
                            orderedMarkerIds={props.orderedMarkerIds ?? []}
                            forceHighlightSelectableMarkers={props.forceHighlightSelectableMarkers}
                            markersCustomConfig={props.config?.markersCustomConfig ?? {}}
                            markerGlobalSettings={props.markerGlobalSettings}
                            callbacks={props.callbacks}
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
                                props.callbacks.onStyleChanged?.(style);
                            }}
                        />
                        {props.config?.geolocate && geoShow && (
                            <GeolocateControl
                                ref={geoRef}
                                style={{ display: 'none' }}
                                trackUserLocation={true}
                                showUserLocation={true}
                                showUserHeading={true}
                            />
                        )}
                        {props.children}
                    </>
                )}
            </ReactMapGL>
        </div>
    );
};
