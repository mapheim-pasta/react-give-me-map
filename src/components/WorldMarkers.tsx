import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Marker } from 'react-map-gl';
import { useCtx } from '../context/dynamic/provider';
import { useStateCallback } from '../hooks/general/useStateCallback';
import { DirectionWorld } from '../items/DirectionWorld';
import { DrawWorld } from '../items/DrawWorld';
import { ImageWorld } from '../items/ImageWorld';
import { LinkWorld } from '../items/LinkWorld';
import { PinWorld } from '../items/PinWorld';
import { PolygonWorld } from '../items/PolygonWorld';
import { RouteWorld } from '../items/RouteWorld';
import { TextWorld } from '../items/TextWorld';
import { YoutubeWorld } from '../items/YoutubeWorld';
import { IViewportExtended } from '../utils/map/mapTypes';
import { isMarkerElement } from '../utils/marker/markerUtils';
import { ORIGIN_ZOOM } from '../utils/world/worldConfig';
import { IWorldMarker } from '../utils/world/worldTypes';
import { getInScale } from '../utils/world/worldUtils';

export interface IProps {
    markers: IWorldMarker[];

    viewport: IViewportExtended;
}

export const WorldMarkers = (props: IProps): JSX.Element => {
    const [markers, setMarkers] = useStateCallback<IWorldMarker[]>([]);
    const [order, setOrder] = useState<number[]>([]);
    const { state } = useCtx();

    useEffect(() => {
        setMarkers(props.markers);
        const newOrder = props.markers.map((marker) => marker.order);
        // console.log('Order', order, newOrder);
        for (let i = 0; i < order.length; i++) {
            if (order[i] !== newOrder[i]) {
                setMarkers([], () => {
                    // console.log('Reordered');
                    setMarkers(props.markers);
                    setOrder(newOrder);
                });
                return;
            }
        }
        setOrder(newOrder);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.markers]);

    return (
        <>
            {_.sortBy(markers, 'order').map((marker: IWorldMarker) => {
                const adjustedScale = marker.scalable
                    ? getInScale(marker.scale as number, ORIGIN_ZOOM, props.viewport.zoom)
                    : marker.scale ?? 1;

                if (marker.elementType === 'image') {
                    return (
                        <Marker
                            key={marker.id + marker.order}
                            longitude={marker.lng}
                            latitude={marker.lat}
                            style={{
                                pointerEvents: 'none',
                                opacity: state.selectedIds.includes(marker.id) ? 0.25 : 1
                            }}
                        >
                            <div
                                ref={marker.ref}
                                style={{
                                    transform: `rotate(${marker.rotate}deg)`,
                                    pointerEvents: 'all'
                                }}
                                onClick={() => {
                                    console.log('aaaaaaaaaaaaaaa');
                                    state.callbacks.onMarkersSelected?.([marker.id]);
                                }}
                            >
                                <ImageWorld
                                    elementData={marker.elementData}
                                    adjustedScale={adjustedScale}
                                />
                            </div>
                        </Marker>
                    );
                } else if (isMarkerElement(marker)) {
                    return (
                        <Marker
                            key={marker.id + marker.order}
                            longitude={marker.lng}
                            latitude={marker.lat}
                            style={{
                                pointerEvents: 'none',
                                opacity: state.selectedIds.includes(marker.id) ? 0.25 : 1
                            }}
                        >
                            <div
                                ref={marker.ref}
                                style={{
                                    transform: `scale(${adjustedScale}) rotate(${marker.rotate}deg)`,
                                    pointerEvents: marker.elementType === 'draw' ? 'none' : 'all'
                                }}
                                onClick={() => {
                                    console.log('aaaaaaaaaaaaaaa');
                                    state.callbacks.onMarkersSelected?.([marker.id]);
                                }}
                            >
                                {marker.elementType === 'text' && (
                                    <TextWorld elementData={marker.elementData} />
                                )}
                                {marker.elementType === 'link' && (
                                    <LinkWorld elementData={marker.elementData} />
                                )}
                                {marker.elementType === 'pin' && (
                                    <PinWorld elementData={marker.elementData} />
                                )}
                                {marker.elementType === 'draw' && (
                                    <DrawWorld elementData={marker.elementData} />
                                )}
                                {marker.elementType === 'polygon' && (
                                    <PolygonWorld
                                        elementData={marker.elementData}
                                        adjustedScale={adjustedScale}
                                    />
                                )}
                                {marker.elementType === 'youtube' && (
                                    <YoutubeWorld elementData={marker.elementData} />
                                )}
                            </div>
                        </Marker>
                    );
                } else if (marker.elementType === 'route') {
                    return <RouteWorld key={marker.id} marker={marker} />;
                } else if (marker.elementType === 'direction') {
                    return (
                        <DirectionWorld
                            key={marker.id}
                            marker={marker}
                            onSelected={() => {
                                state.callbacks.onMarkersSelected?.([marker.id]);
                            }}
                        />
                    );
                }
            })}
        </>
    );
};
