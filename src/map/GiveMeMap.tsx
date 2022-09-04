import React, { useRef } from 'react';
import ReactMapGL, { MapboxEvent, MapRef, Marker, ViewStateChangeEvent } from 'react-map-gl';
import { EMapStyle, IViewportExtended } from '../interface/IWorld';

interface IProps {
    map: {
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
    };
    children?: React.ReactNode;
}

export const GiveMeMap = (props: IProps): JSX.Element => {
    const mapRef = useRef<MapRef>();

    return (
        <>
            <ReactMapGL
                {...props.map.viewport}
                ref={mapRef as any}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                onClick={props.map.onMapClick}
                onLoad={props.map.onMapLoad}
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
                <Marker latitude={55.15} longitude={15.02}>
                    <div
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: 'green',
                            borderRadius: 100
                        }}
                    />
                </Marker>
            </ReactMapGL>
        </>
    );
};
