import { orderBy } from 'lodash';
import React, { CSSProperties, RefObject, useEffect, useState } from 'react';
import { MapRef, Marker } from 'react-map-gl';
import { useCtx } from '../context/dynamic/provider';
import { useStateCallback } from '../hooks/general/useStateCallback';
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
import { ICallbacks } from '../map/RegisterPropsToGlobalState';
import { GroupMarkerProps, MarkerStyle } from '../utils/map/mapTypes';
import { isMarkerElement } from '../utils/marker/markerUtils';
import { ORIGIN_ZOOM } from '../utils/world/worldConfig';
import { IWorldMarker, IWorldV1Marker } from '../utils/world/worldTypes';
import { getInScale } from '../utils/world/worldUtils';

export interface IProps {
    markers: IWorldV1Marker[];
    selectableMarkersStyle?: MarkerStyle;
    highlightedMarkers: string[];
    highlightedMarkersStyle?: MarkerStyle;
    forceHighlightSelectableMarkers: boolean;

    groupMarkerProps: GroupMarkerProps;
    mapRef: RefObject<MapRef>;
    callbacks: ICallbacks;
}

export const WorldMarkersV1 = (props: IProps): JSX.Element => {
    const [markers, setMarkers] = useStateCallback<IWorldMarker[] | null>(null);
    const [order, setOrder] = useState<number[]>([]);
    const { state } = useCtx();

    useEffect(() => {
        function onZoom() {
            const newZoom = props.mapRef?.current?.getZoom() ?? 1;
            props.markers?.forEach((marker) => {
                const adjustedScale = marker.scalable
                    ? getInScale(marker.scale as number, ORIGIN_ZOOM, newZoom)
                    : marker.scale ?? 1;
                if ('ref' in marker) {
                    if (marker.ref?.current) {
                        marker.ref.current.style.transform = `scale(${adjustedScale}) rotate(${marker.rotate}deg)`;
                    }
                }
            });
        }

        props.mapRef?.current?.on('zoom', onZoom);

        return () => {
            props.mapRef?.current?.off('zoom', onZoom);
        };
    }, [props.mapRef, props.markers, props.mapRef.current]);

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

    if (!markers) {
        return <></>;
    }

    function isMarkerHighlighted(marker: IWorldV1Marker): boolean {
        if (props.forceHighlightSelectableMarkers) {
            return marker.selectable ?? false;
        }
        return props.highlightedMarkers.includes(marker.id);
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

            {[...nonGroupNativeMarkers, ...nonGroupNonNativeMarkers].map((marker) => {
                if (!marker.visible) {
                    return null;
                }

                const adjustedScale = marker.scalable
                    ? getInScale(
                          marker.scale as number,
                          ORIGIN_ZOOM,
                          props.mapRef.current?.getZoom() ?? 1
                      )
                    : marker.scale ?? 1;

                const onClick = (e: React.MouseEvent | MouseEvent) => {
                    if (marker.selectable) {
                        props.callbacks.onMarkersSelected?.([marker.id]);
                        e.preventDefault();
                        e.stopPropagation();
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
                                    transform: `scale(${adjustedScale}) rotate(${marker.rotate}deg)`,
                                    pointerEvents: marker.selectable ? 'all' : 'none',
                                    cursor: marker.selectable ? 'pointer' : 'inherit',
                                    ...(marker.selectable
                                        ? getMarkerStyle(props.selectableMarkersStyle)
                                        : {}),
                                    ...(isMarkerHighlighted(marker)
                                        ? getMarkerStyle(props.highlightedMarkersStyle)
                                        : {})
                                }}
                            >
                                <ImageWorld
                                    markerId={marker.id}
                                    nativeMarkerIdsOrder={nativeMarkerIdsOrder}
                                    elementData={marker.elementData}
                                    adjustedScale={1}
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
                                    ...(!isDrawOrPolygon && isMarkerHighlighted(marker)
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
                                        isHighlighted={isMarkerHighlighted(marker)}
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
                }
            })}
        </>
    );
};
