import React from 'react';
import ReactMapGL, { MapboxEvent, MapRef, Marker, ViewStateChangeEvent } from 'react-map-gl';
import { useGlobalCallbacks } from '../context/GlobalCallbacksContext';
import { EMapStyle, IViewportExtended } from '../interface/IWorld';

export interface IMapProps {
    accessToken: string;
    viewport?: IViewportExtended;
    onMapClick?: (e: mapboxgl.MapLayerMouseEvent) => void;
    onMapLoad?: (
        e: MapboxEvent<undefined>,
        mapRef: React.RefObject<MapRef | undefined>
    ) => void;
    mapStyle?: EMapStyle;
    onMapMove?: (e: ViewStateChangeEvent) => void;
    interactiveLayerIds?: string[];
    dragPan?: boolean;
    scrollZoom?: boolean;
    doubleClickZoom?: boolean;
}

interface IProps {
    map: IMapProps;
    mapRef: React.RefObject<MapRef>;
    children?: React.ReactNode;
}

export const Map = (props: IProps): JSX.Element => {
    const callbacks = useGlobalCallbacks();

    return (
        <>
            <ReactMapGL
                {...props.map.viewport}
                ref={props.mapRef}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                onClick={props.map.onMapClick}
                onLoad={(e) => {
                    props.map.onMapLoad?.(e, props.mapRef);
                }}
                reuseMaps={true}
                mapStyle={props.map.mapStyle ?? EMapStyle.WORLD}
                onMove={props.map.onMapMove}
                onRender={(event) => event.target.resize()}
                dragRotate={false}
                boxZoom={false}
                interactiveLayerIds={props.map.interactiveLayerIds}
                dragPan={props.map.dragPan}
                scrollZoom={props.map.scrollZoom}
                doubleClickZoom={props.map.doubleClickZoom}
                mapboxAccessToken={props.map.accessToken}
            >
                    {props.children}
                    <Marker
                        latitude={55.15}
                        longitude={15.02}
                        onClick={() => {
                            callbacks.onMarkersSelected(['aaaa 1']);
                        }}
                    >
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                backgroundColor: 'pink',
                                borderRadius: 100
                            }}
                        />
                    </Marker>
            </ReactMapGL>
        </>
    );
};
