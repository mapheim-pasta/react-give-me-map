import mapboxgl from 'mapbox-gl';
import React, { memo, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MapRef } from 'react-map-gl';
import styled from 'styled-components';
import { Fonts } from '../../../context/dynamic/actions';
import { useUpdateEffect } from '../../../hooks/general/useUpdateEffect';
import { DotMarker } from './DotMarker';

interface Props {
    isActive: boolean;
    clusterId: string;
    mapRef: React.RefObject<MapRef>;
    isWide: boolean;
    lng: number;
    lat: number;
    pointCount: string;
    fonts: Fonts;
    className?: string;
    forceHighlightSelectableMarkers: boolean;
    selectable: boolean;
    onClick?: () => void;
}

const ClusterMarkerComponent = (props: Props) => {
    return (
        <S_ClusterMarker
            $isWide={props.isWide}
            $isActive={props.isActive}
            onClick={(e) => {
                if (!props.selectable) {
                    e.stopPropagation();
                    return;
                }
                props.onClick?.();
                e.stopPropagation();
            }}
        >
            <DotMarker
                key={props.clusterId}
                className={props.className}
                color="#ccc"
                enableOrderNumber
                orderNumber={props.pointCount}
                isActive={props.isActive}
                fonts={props.fonts}
                selectable
            />
        </S_ClusterMarker>
    );
};

const S_ClusterMarker = styled.div<{ $isWide: boolean; $isActive: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    cursor: ${(props) => (props.$isActive ? 'auto' : 'pointer')};
    pointer-events: ${(props) => (props.$isActive && props.$isWide ? 'none' : 'auto')};
`;

const ClusterMarkerMemoed = memo(ClusterMarkerComponent, (prev, next) => {
    return (
        prev.isActive === next.isActive &&
        prev.forceHighlightSelectableMarkers === next.forceHighlightSelectableMarkers
    );
});

export const ClusterMarker = (props: Props) => {
    const rootRef = useRef<Root | null>(null);
    const markerRef = useRef<HTMLElement | null>(null);

    const markerEl = <ClusterMarkerMemoed {...props} />;

    useEffect(() => {
        if (!props.mapRef.current) {
            return;
        }

        const divElement = document.createElement('div');
        rootRef.current = createRoot(divElement);
        rootRef.current.render(markerEl);

        const marker = new mapboxgl.Marker({
            element: divElement,
            className: 'zIndex3'
        })
            .setLngLat([props.lng, props.lat])
            .addTo(props.mapRef.current?.getMap());

        markerRef.current = marker.getElement();

        return () => {
            marker.remove();
        };
    }, [props.mapRef.current, props.isActive]);

    useUpdateEffect(() => {
        if (markerRef?.current?.className) {
            if (props.isActive && !props.forceHighlightSelectableMarkers) {
                markerRef.current.classList.add('zIndexActive');
            } else {
                markerRef.current.classList.remove('zIndexActive');
            }
        }
    }, [props.isActive]);

    useUpdateEffect(() => {
        rootRef.current?.render(markerEl);
    }, [markerEl]);

    return <></>;
};
