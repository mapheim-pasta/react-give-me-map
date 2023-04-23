import { orderBy } from 'lodash';
import React, { CSSProperties, RefObject, useEffect, useState } from 'react';
import { MapRef, Marker } from 'react-map-gl';
import { useCtx } from '../context/dynamic/provider';
import { useStateCallback } from '../hooks/general/useStateCallback';
import { DirectionWorld } from '../items/DirectionWorld';
import { DrawWorld } from '../items/DrawWorld';
import { GroupMarkers } from '../items/GroupMarkers';
import { ImageWorld } from '../items/ImageWorld';
import { LinkWorld } from '../items/LinkWorld';
import { PinWorld } from '../items/PinWorld';
import { PolygonWorld } from '../items/PolygonWorld';
import { ReactWorld } from '../items/ReactWorld';
import { RouteWorld } from '../items/RouteWorld';
import { TextWorld } from '../items/TextWorld';
import { YoutubeWorld } from '../items/YoutubeWorld';
import { GroupMarkerProps, MarkerStyle } from '../utils/map/mapTypes';
import { isMarkerElement } from '../utils/marker/markerUtils';
import { ORIGIN_ZOOM } from '../utils/world/worldConfig';
import { IWorldMarker, IWorldV1Marker } from '../utils/world/worldTypes';
import { getInScale } from '../utils/world/worldUtils';

export interface IProps {
    markers: IWorldV1Marker[];
    zoom: number;
    selectableMarkersStyle?: MarkerStyle;
    highlightedMarkers: string[];
    highlightedMarkersStyle?: MarkerStyle;

    groupMarkerProps: GroupMarkerProps;
    mapRef: RefObject<MapRef>;
}

export const WorldMarkersV1 = (props: IProps): JSX.Element => {
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

    const getMarkerStyle = (style?: MarkerStyle): CSSProperties =>
        style ? { boxShadow: `0px 0px ${style.pixelSize}px ${style.shadowColor}` } : {};

    const orderedMarkers = orderBy(markers, 'order');

    const nativeMarkerIdsOrder = orderedMarkers.reduce<string[]>((acc, curr) => {
        if (!curr.visible) {
            return acc;
        }
        if (curr.elementType === 'image' && curr.elementData.renderAsLayer) {
            return [curr.id, ...acc];
        }
        if (curr.elementType === 'polygon' && curr.elementData.renderAs3d) {
            return [curr.id, ...acc];
        }
        return acc;
    }, []);

    const groupMarkers = orderedMarkers.filter((e) => e.isGroupable);
    const nonGroupNativeMarkers = orderedMarkers
        .filter((e) => !e.isGroupable && nativeMarkerIdsOrder.includes(e.id))
        .reverse();
    const nonGroupNonNativeMarkers = orderedMarkers.filter(
        (e) => !e.isGroupable && !nativeMarkerIdsOrder.includes(e.id)
    );

    return (
        <>
            <GroupMarkers
                mapRef={props.mapRef}
                selectedMarkers={state.selectedIds}
                groupableMarkers={groupMarkers}
                groupMarkerProps={props.groupMarkerProps}
            />
            {[...nonGroupNativeMarkers, ...nonGroupNonNativeMarkers].map((marker: IWorldMarker) => {
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
                                    ...(marker.selectable
                                        ? getMarkerStyle(props.selectableMarkersStyle)
                                        : {}),
                                    ...(isMarkerHighlighted(marker.id)
                                        ? getMarkerStyle(props.highlightedMarkersStyle)
                                        : {})
                                }}
                            >
                                <ImageWorld
                                    markerId={marker.id}
                                    nativeMarkerIdsOrder={nativeMarkerIdsOrder}
                                    elementData={marker.elementData}
                                    adjustedScale={adjustedScale}
                                    onClick={onClick}
                                />
                            </div>
                        </Marker>
                    );
                } else if (isMarkerElement(marker)) {
                    const isDrawOrPolygon = ['draw', 'polygon'].includes(marker.elementType);

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
                                        marker.selectable && !isDrawOrPolygon ? 'all' : 'none',
                                    cursor:
                                        marker.selectable && !isDrawOrPolygon
                                            ? 'pointer'
                                            : 'inherit',
                                    ...(!isDrawOrPolygon && marker.selectable
                                        ? getMarkerStyle(props.selectableMarkersStyle)
                                        : {}),
                                    ...(!isDrawOrPolygon && isMarkerHighlighted(marker.id)
                                        ? getMarkerStyle(props.highlightedMarkersStyle)
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
                                        nativeMarkerIdsOrder={nativeMarkerIdsOrder}
                                        isHighlighted={isMarkerHighlighted(marker.id)}
                                        selectable={marker.selectable ?? false}
                                        elementData={marker.elementData}
                                        adjustedScale={adjustedScale}
                                        onClick={onClick}
                                        highlightedStyle={props.highlightedMarkersStyle}
                                        selectableStyle={props.selectableMarkersStyle}
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
