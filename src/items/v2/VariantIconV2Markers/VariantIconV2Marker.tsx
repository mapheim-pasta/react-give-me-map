import { AnimatePresence } from 'framer-motion';
import { isEqual } from 'lodash';
import React, { memo } from 'react';
import { Marker } from 'react-map-gl';
import styled from 'styled-components';
import { Fonts } from '../../../context/dynamic/actions';
import { DotMarker } from './DotMarker';
import { ImageMarker } from './ImageMarker';

interface Props {
    size: number;
    isActive: boolean;
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
    isDraggable: boolean;
    text: string;
    className?: string;
    isWide: boolean;
    isEditMode: boolean;
    fonts: Fonts;
    onClick?: (markerId: string) => void;
    selectable: boolean;
}

const VariantIconV2MarkerComponent = (props: Props) => {
    const { markerId, text, lat, lng, isActive, size, color, isWide } = props;

    return (
        <S_VariantIconV2Marker
            className={props.className}
            $isActive={isActive}
            $isWide={isWide}
            onClick={(e) => {
                if (!props.selectable) {
                    e.stopPropagation();
                    return;
                }
                props.onClick?.(markerId);
                e.stopPropagation();
            }}
        >
            <Marker
                latitude={lat}
                longitude={lng}
                draggable={props.isDraggable}
                style={{
                    zIndex: size
                }}
            >
                <S_MarkerChild
                    // aria-label is required for moving the marker in real-time in the editor
                    aria-label={markerId}
                >
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
            </Marker>
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

// Check only props that can change!
export const VariantIconV2Marker = memo(VariantIconV2MarkerComponent, (prev, next) => {
    if (!prev.isEditMode) {
        return (
            prev.isActive === next.isActive &&
            prev.size === next.size &&
            prev.selectable &&
            next.selectable
        );
    } else {
        return isEqual(prev, next);
    }
});

const S_MarkerChild = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
