import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { GeolocateControl, GeolocateControlRef, MapRef } from 'react-map-gl';
import { WorldMapControl } from '../components/WorldMapControl';
import { WorldMarkers } from '../components/WorldMarkers';
import { useActions } from '../context/dynamic/actions';
import { useCtx } from '../context/dynamic/provider';
import { EMapStyle, IMapProps } from '../utils/map/mapTypes';
import { IWorldMarker } from '../utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    markers: IWorldMarker[];
    selectedIds: string[];
    children?: React.ReactNode;
}

const defaults: Partial<IMapProps> = {
    reuseMaps: true,
    dragRotate: false,
    boxZoom: false,
    dragPan: true,
    scrollZoom: true,
    doubleClickZoom: true,
    mapStyle: EMapStyle.WORLD
};

export const Map = (props: IProps): JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const mapRef = useRef<MapRef>(null);
    const actions = useActions();
    const { state } = useCtx();
    const geoRef = useRef<GeolocateControlRef>(null);

    useEffect(() => {
        if (!_.isEqual(props.selectedIds.sort(), state.selectedIds.sort())) {
            console.log('Update');
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

    return (
        <>
            <ReactMapGL
                {...defaults}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(props.map as any)}
                ref={mapRef}
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
                    props.map.onLoad?.(e, mapRef);
                }}
                onRender={(event) => {
                    event.target.resize();
                    props.map.onRender?.(event);
                }}
                interactiveLayerIds={layerIds ?? []}
            >
                {loaded && (
                    <>
                        <WorldMarkers markers={props.markers} zoom={props.map.zoom ?? 1} />
                        <WorldMapControl
                            onGeoClick={() => {
                                console.log('Geo click');
                                geoRef?.current?.trigger();
                            }}
                            selectedMapStyle={
                                [EMapStyle.SATELLITE, EMapStyle.OUTDOOR, EMapStyle.WORLD].find(
                                    (e) => e === props.map.mapStyle
                                ) ?? null
                            }
                            mapStyles={[EMapStyle.WORLD, EMapStyle.SATELLITE, EMapStyle.OUTDOOR]}
                            onStyleChange={(style) => {
                                console.log('Set map style', style);
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
