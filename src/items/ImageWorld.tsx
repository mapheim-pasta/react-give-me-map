import React from 'react';
import styled, { css } from 'styled-components';
import { IImageWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IImageWorld;
    adjustedScale: number;
    onResizeNeeded?: () => void;
}

type AllowedResolutions = keyof NonNullable<IImageWorld['additionalSrc']>;
const orderedAllowedResolutions = [100, 600, 1000, 1920];
const markerImgWidth = 250;

const generateImageUrlFor = (elementData: IImageWorld, adjustedScale: number): string => {
    const { additionalSrc, src } = elementData;

    if (!additionalSrc) {
        return elementData.src;
    }

    const resolution = orderedAllowedResolutions.find(
        (resolution) => resolution > markerImgWidth * 2 * adjustedScale
    );

    if (resolution) {
        return additionalSrc[resolution as AllowedResolutions] ?? src;
    }

    return src;
};

export const ImageWorld = (props: Props): JSX.Element => {
    return (
        <S_ImageWorld
            borderRadiusPx={props.elementData.borderRadiusPx}
            borderSize={props.elementData.borderSize}
            borderColor={props.elementData.borderColor}
            dropShadowCombined={props.elementData.dropShadowCombined}
        >
            <img
                width={markerImgWidth * props.adjustedScale}
                src={generateImageUrlFor(props.elementData, props.adjustedScale)}
            />
        </S_ImageWorld>
    );
};

const S_ImageWorld = (styled.div as any).attrs(() => ({
    style: {}
}))`
    ${(props: any) => {
        return css`
            img {
                border-radius: ${props.borderRadiusPx}px;
                border-width: ${props.borderSize}px;
                border-style: solid;
                border-color: #${props.borderColor};
                box-shadow: ${props.dropShadowCombined};
            }
        `;
    }}
`;
