import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import ReactMapGL, { MapboxEvent, MapRef, Marker, ViewStateChangeEvent } from 'react-map-gl';
import { EMapStyle, IViewportExtended } from './IWorld';

interface IProps {
    accessToken: string;
    viewport?: IViewportExtended;
    onMapClick?: (e: mapboxgl.MapLayerMouseEvent) => void;
    onMapLoad?: (e: MapboxEvent<undefined>) => void;
    mapStyle?: EMapStyle;
    onMapMove?: (e: ViewStateChangeEvent) => void;
    interactiveLayerIds?: string[];
    dragPan?: boolean;
    scrollZoom?: boolean;
    doubleClickZoom?: boolean;
}

export const GiveMeMap = (props: IProps): JSX.Element => {
    const mapRef = useRef<MapRef>();

    useEffect(() => {
        (mapboxgl as any).accessToken = props.accessToken;
    }, []);

    return (
        <>
            <ReactMapGL
                {...props.viewport}
                ref={mapRef as any}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                onClick={props.onMapClick}
                onLoad={props.onMapLoad}
                reuseMaps={true}
                mapStyle={props.mapStyle}
                onMove={props.onMapMove}
                onRender={(event) => event.target.resize()}
                dragRotate={false}
                boxZoom={false}
                interactiveLayerIds={props.interactiveLayerIds}
                dragPan={props.dragPan}
                scrollZoom={props.scrollZoom}
                doubleClickZoom={props.doubleClickZoom}
            >
                <Marker latitude={55.15} longitude={15.02}>
                    <div style={{ width: 20, height: 20, backgroundColor: 'red' }} />
                </Marker>
            </ReactMapGL>
        </>
    );
};

export { EMapStyle } from './IWorld';