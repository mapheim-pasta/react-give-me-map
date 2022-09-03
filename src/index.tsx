import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
// import ReactMapGL from 'react-map-gl';
import ReactMapGL, { MapboxEvent, MapRef, ViewStateChangeEvent } from 'react-map-gl';
import { EMapStyle, IViewportExtended } from './IWorld';
import { useTest } from './useTest';
(mapboxgl as any).accessToken =
    'pk.eyJ1Ijoia291ZGVsa2EiLCJhIjoiY2tzdGN6MHF2MTRvZjMyb2RvZDZ5bDdiayJ9.dEv0FPgOoGA_oOZwXNtWww';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(mapboxgl as any).workerClass =
    require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface IProps {
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
    const test = useTest();

    useEffect(() => {
        console.log('Test1', test.test);
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
            ></ReactMapGL>
        </>
    );
};
