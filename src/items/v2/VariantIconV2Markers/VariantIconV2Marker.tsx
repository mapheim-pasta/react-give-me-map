import { AnimatePresence } from 'framer-motion';
import { isEqual } from 'lodash';
import mapboxgl from 'mapbox-gl';
import React, { memo, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { MapRef } from 'react-map-gl';
import styled from 'styled-components';
import { Fonts } from '../../../context/dynamic/actions';
import { useUpdateEffect } from '../../../hooks/general/useUpdateEffect';
import { DotMarker } from './DotMarker';
import { ImageMarker } from './ImageMarker';

interface Props {
    size: number;
    isActive: boolean;
    mapRef: React.RefObject<MapRef>;
    image:
        | {
              type: 'category';
              url: string;
          }
        | { type: 'story'; url: string };
    color: string;
    orderNumber: string | null;
    lat: number;
    lng: number;
    markerId: string;
    withStar: boolean;
    text: string;
    className?: string;
    isWide: boolean;
    isEditMode: boolean;
    fonts: Fonts;
    onClick?: (markerId: string) => void;
    selectable: boolean;
    forceHighlightSelectableMarkers: boolean;
}

const VariantIconV2MarkerComponent = (props: Props) => {
    const { markerId, text, size, color, isWide } = props;

    const isActive = props.isActive || props.forceHighlightSelectableMarkers;

    return (
        <S_VariantIconV2Marker
            className={props.className}
            $isActive={isActive}
            $isWide={isWide}
            style={{
                zIndex: size
            }}
            // aria-label is required for moving the marker in real-time in the editor
            aria-label={markerId}
            onClick={(e) => {
                if (!props.selectable) {
                    e.stopPropagation();
                    return;
                }
                props.onClick?.(markerId);
                e.stopPropagation();
            }}
        >
            <S_MarkerChild>
                <AnimatePresence>
                    {size === 1 && (
                        <S_DotMarker
                            fonts={props.fonts}
                            isActive={isActive}
                            color={color}
                            markerId={markerId}
                            orderNumber={props.orderNumber}
                            selectable={props.selectable}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {(size === 2 || size === 3) && (
                        <ImageMarker
                            fonts={props.fonts}
                            isActive={isActive}
                            color={color}
                            size={size}
                            text={text}
                            withStar={props.withStar}
                            image={props.image}
                            markerId={markerId}
                            orderNumber={props.orderNumber}
                            selectable={props.selectable}
                        />
                    )}
                </AnimatePresence>
            </S_MarkerChild>
        </S_VariantIconV2Marker>
    );
};

const S_VariantIconV2Marker = styled.div<{ $isWide: boolean; $isActive: boolean }>`
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    cursor: ${(props) => (props.$isActive ? 'auto' : 'pointer')};
    pointer-events: ${(props) => (props.$isActive && props.$isWide ? 'none' : 'auto')};
`;

const S_DotMarker = styled(DotMarker)`
    position: absolute;
`;

const VariantIconV2MarkerMemoed = memo(VariantIconV2MarkerComponent, (prev, next) => {
    if (prev.isEditMode) {
        return isEqual(prev, next);
    }
    return (
        prev.isActive === next.isActive &&
        prev.size === next.size &&
        prev.forceHighlightSelectableMarkers === next.forceHighlightSelectableMarkers
    );
});

export const VariantIconV2Marker = (props: Props) => {
    const rootRef = useRef<Root | null>(null);
    const markerRef = useRef<HTMLElement | null>(null);

    const markerEl = <VariantIconV2MarkerMemoed {...props} />;

    useEffect(() => {
        if (!props.mapRef.current) {
            return;
        }

        const divElement = document.createElement('div');
        rootRef.current = createRoot(divElement);
        rootRef.current.render(markerEl);

        const marker = new mapboxgl.Marker({
            element: divElement,
            className: 'zIndex' + (props.isActive ? 'Active' : props.size)
        })
            .setLngLat([props.lng, props.lat])
            .addTo(props.mapRef.current?.getMap());

        markerRef.current = marker.getElement();

        return () => {
            marker.remove();
        };
    }, [props.mapRef.current]);

    useUpdateEffect(() => {
        if (markerRef?.current?.className) {
            markerRef.current.classList.remove('zIndex1', 'zIndex2', 'zIndex3', 'zIndexActive');
            markerRef.current.classList.add('zIndex' + props.size);
            if (props.isActive && !props.forceHighlightSelectableMarkers) {
                markerRef.current.classList.add('zIndexActive');
            }
        }
    }, [props.isActive, props.size, props.forceHighlightSelectableMarkers]);

    useUpdateEffect(() => {
        rootRef.current?.render(markerEl);
    }, [markerEl]);

    return <></>;
};

const S_MarkerChild = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
