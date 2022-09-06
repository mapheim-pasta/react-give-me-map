import _ from 'lodash';
import React, { Ref, useEffect, useRef, useState } from 'react';
import ReactMapGL, { GeolocateControl, MapRef } from 'react-map-gl';
import { WorldMapControl } from '../components/WorldMapControl';
import { WorldMarkers } from '../components/WorldMarkers';
import { useActions } from '../context/dynamic/actions';
import { useCtx } from '../context/dynamic/provider';
import { EMapStyle, IMapProps } from '../utils/map/mapTypes';
import { IWorldMarker } from '../utils/world/worldTypes';

interface IProps {
    map: IMapProps;
    markers: IWorldMarker[];
    selectedMapStyle: EMapStyle;
    selectedIds: string[];
    children?: React.ReactNode;
}

export const Map = (props: IProps): JSX.Element => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const mapRef = useRef<MapRef>();
    const actions = useActions();
    const { state } = useCtx();
    const geoRef = useRef<any>();

    useEffect(() => {
        if (!_.isEqual(props.selectedIds.sort(), state.selectedIds.sort())) {
            console.log('Update');
            actions.setSelectedIds(props.selectedIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.selectedIds]);

    return (
        <>
            <ReactMapGL
                {...props.map.viewport}
                ref={mapRef as Ref<MapRef>}
                style={{
                    width: '100%',
                    height: '100%'
                }}
                onClick={props.map.onMapClick}
                onLoad={(e) => {
                    setLoaded(true);
                    props.map.onMapLoad?.(e, mapRef);
                }}
                reuseMaps={true}
                mapStyle={props.selectedMapStyle}
                onMove={props.map.onMapMove}
                onRender={(event) => event.target.resize()}
                dragRotate={false}
                boxZoom={false}
                interactiveLayerIds={props.map.interactiveLayerIds}
                dragPan={props.map.dragPan ?? true}
                scrollZoom={props.map.scrollZoom ?? true}
                doubleClickZoom={props.map.doubleClickZoom ?? true}
                mapboxAccessToken={props.map.accessToken}
            >
                {loaded && (
                    <>
                        <WorldMarkers markers={props.markers} viewport={props.map.viewport} />
                        <WorldMapControl
                            onGeoClick={() => {
                                console.log('Geo click');
                                geoRef?.current?.trigger();
                            }}
                            selectedMapStyle={props.selectedMapStyle}
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
