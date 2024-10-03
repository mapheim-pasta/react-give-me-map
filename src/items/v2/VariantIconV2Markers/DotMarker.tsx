import { motion } from 'framer-motion';
import React from 'react';
import styled, { css } from 'styled-components';
import { Fonts } from '../../../context/dynamic/actions';
import { MarkerGlobalSettings } from '../../../utils/map/mapTypes';

interface Props {
    isActive: boolean;
    markerId: string;
    color: string;
    className?: string;
    orderNumber: string | null;
    fonts: Fonts;
    selectable: boolean;
    markerGlobalSettings: MarkerGlobalSettings['v2/variant_icon'];
}

export const DotMarker = (props: Props): JSX.Element => {
    return (
        <S_DotMarker
            $isActive={props.isActive}
            $selectable={props.selectable}
            className={props.className}
            initial={{ transform: 'scale(0)', display: 'none' }}
            animate={{ transform: 'scale(1)', display: 'flex' }}
            exit={{ transform: 'scale(0)', display: 'none', transition: { duration: 0 } }}
        >
            {props.orderNumber && props.markerGlobalSettings.enableOrderNumberInDot ? (
                <S_OrderNumber $font={props.fonts.semiBold}>{props.orderNumber}</S_OrderNumber>
            ) : (
                <S_Dot>
                    <S_DotInner $color={props.color} />
                </S_Dot>
            )}
        </S_DotMarker>
    );
};

const S_Dot = styled.div`
    width: 20px;
    height: 20px;
    border: 1px solid #52556e;
    background: #fff;
    border-radius: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const S_DotInner = styled.div<{ $color: string }>`
    width: 10px;
    height: 10px;
    background: ${(props) => props.$color ?? '#000'};
    border-radius: 100%;
`;

const S_OrderNumber = styled.div<{ $font: string }>`
    width: 30px;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    font-family: ${(props) => props.$font};
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
`;

export const S_DotMarker = styled(motion.div)<{ $isActive: boolean; $selectable: boolean }>`
    ${S_Dot}, ${S_OrderNumber} {
        ${(props) => {
            if (props.$isActive) {
                return css`
                    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.4));
                `;
            }
        }}
    }

    ${(props) =>
        props.$selectable &&
        css`
            pointer-events: all;
            cursor: pointer;
            &:hover {
                ${S_Dot}, ${S_OrderNumber} {
                    ${() => {
                        if (!props.$isActive) {
                            return css`
                                filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));
                            `;
                        }
                    }}
                }
            }
        `}
`;
