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
import { ReactWorld } from '../items/ReactWorld';
import { RouteWorld } from '../items/RouteWorld';
import { TextWorld } from '../items/TextWorld';
import { YoutubeWorld } from '../items/YoutubeWorld';
import { isMarkerElement } from '../utils/marker/markerUtils';
import { ORIGIN_ZOOM } from '../utils/world/worldConfig';
import { IWorldMarker } from '../utils/world/worldTypes';
import { getInScale } from '../utils/world/worldUtils';

export interface IProps {
    markers: IWorldMarker[];

    zoom: number;

    selectableMarkersStyle: React.CSSProperties;
    highlightedMarkers: string[];
    highlightedMarkersStyle: React.CSSProperties;
}

export const WorldMarkers = (props: IProps): JSX.Element => {
    const [markers, setMarkers] = useStateCallback<IWorldMarker[]>([]);
    const [order, setOrder] = useState<number[]>([]);
    const { state } = useCtx();

    useEffect(() => {
        setMarkers(props.markers);
        const newOrder = props.markers.map((marker) => marker.order ?? 0);
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

    function isMarkerHighlighted(markerId: string): boolean {
        const found = props.highlightedMarkers.find((id) => id === markerId);
        return !!found;
    }

    return (
        <>
            {_.sortBy(markers, 'order').map((marker: IWorldMarker) => {
                const adjustedScale = marker.scalable
                    ? getInScale(marker.scale as number, ORIGIN_ZOOM, props.zoom)
                    : marker.scale ?? 1;

                if (!marker.visible) {
                    return null;
                }

                const onClick = () => {
                    if (marker.selectable) {
                        state.callbacks.onMarkersSelected?.([marker.id]);
                    }
                };

                if (marker.elementType === 'image') {
                    return (
                        <Marker
                            key={marker.id + marker.order}
                            longitude={marker.lng}
                            latitude={marker.lat}
                            style={{
                                opacity: state.selectedIds.includes(marker.id) ? 0.25 : 1
                            }}
                        >
                            <div
                                ref={marker.ref}
                                style={{
                                    transform: `rotate(${marker.rotate}deg)`,
                                    pointerEvents: marker.selectable ? 'all' : 'none',
                                    cursor: marker.selectable ? 'pointer' : 'inherit',
                                    ...(marker.selectable ? props.selectableMarkersStyle : {}),
                                    ...(isMarkerHighlighted(marker.id)
                                        ? props.highlightedMarkersStyle
                                        : {})
                                }}
                            >
                                <ImageWorld
                                    markerId={marker.id}
                                    elementData={marker.elementData}
                                    adjustedScale={adjustedScale}
                                    onClick={onClick}
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
                                opacity: state.selectedIds.includes(marker.id) ? 0.25 : 1
                            }}
                        >
                            <div
                                ref={marker.ref}
                                style={{
                                    transform: `scale(${adjustedScale}) rotate(${marker.rotate}deg)`,
                                    pointerEvents:
                                        marker.selectable &&
                                        marker.elementType !== 'draw' &&
                                        marker.elementType !== 'polygon'
                                            ? 'all'
                                            : 'none',
                                    cursor:
                                        marker.selectable &&
                                        marker.elementType !== 'draw' &&
                                        marker.elementType !== 'polygon'
                                            ? 'pointer'
                                            : 'inherit',
                                    ...(marker.selectable ? props.selectableMarkersStyle : {}),
                                    ...(isMarkerHighlighted(marker.id)
                                        ? props.highlightedMarkersStyle
                                        : {})
                                }}
                            >
                                {marker.elementType === 'text' && (
                                    <TextWorld elementData={marker.elementData} onClick={onClick} />
                                )}
                                {marker.elementType === 'link' && (
                                    <LinkWorld elementData={marker.elementData} onClick={onClick} />
                                )}
                                {marker.elementType === 'pin' && (
                                    <PinWorld
                                        elementData={marker.elementData}
                                        onClick={onClick}
                                        pinIconBuilder={state.customBuilders.pinIcon}
                                    />
                                )}
                                {marker.elementType === 'draw' && (
                                    <DrawWorld elementData={marker.elementData} onClick={onClick} />
                                )}
                                {marker.elementType === 'polygon' && (
                                    <PolygonWorld
                                        markerId={marker.id}
                                        selectable={marker.selectable ?? false}
                                        elementData={marker.elementData}
                                        adjustedScale={adjustedScale}
                                        onClick={onClick}
                                    />
                                )}
                                {marker.elementType === 'youtube' && (
                                    <YoutubeWorld
                                        elementData={marker.elementData}
                                        onClick={onClick}
                                    />
                                )}
                                {marker.elementType === 'react' && (
                                    <ReactWorld
                                        elementData={marker.elementData}
                                        onClick={onClick}
                                        customMarkerBuilders={state.customBuilders.reactMarkers}
                                    />
                                )}
                            </div>
                        </Marker>
                    );
                } else if (marker.elementType === 'route') {
                    return <RouteWorld key={marker.id} marker={marker} />;
                } else if (marker.elementType === 'direction') {
                    return <DirectionWorld key={marker.id} marker={marker} onClick={onClick} />;
                }
            })}
        </>
    );
};
