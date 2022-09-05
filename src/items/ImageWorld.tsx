import React from 'react';
import styled, { css } from 'styled-components';
import { IImageWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IImageWorld;
    adjustedScale?: number;
    onResizeNeeded?: () => void;
}

const orderedAllowedResolutions = [100, 600, 1000, 1920];
const markerImgWidth = 1000;

// The original URL may be in two forms:
// - https://dvtqxks0zalev.cloudfront.net/100/3a2d147f-e513-4417-ad2e-0b13a6f5eae5.png
// - https://dvtqxks0zalev.cloudfront.net/3a2d147f-e513-4417-ad2e-0b13a6f5eae5.png
// this method optimizes the url to provide the right image size
const generateImageUrlFor = (url: string, adjustedScale: number): string => {
    const parsed = new URL(url);

    const maxResolution = parseInt(parsed.pathname.split('/')[0]);

    if (!isNaN(maxResolution)) {
        const resolution =
            orderedAllowedResolutions.find(
                (resolution) =>
                    resolution > markerImgWidth * adjustedScale && maxResolution <= resolution
            ) ?? maxResolution;
        return `${parsed.origin}/${resolution}/${parsed.pathname.split('/').pop()}`;
    }

    const resolution = orderedAllowedResolutions.find(
        (resolution) => resolution > markerImgWidth * adjustedScale
    );
    if (resolution) {
        return `${parsed.origin}/${resolution}/${parsed.pathname.split('/').pop()}`;
    }

    return `${parsed.origin}/${parsed.pathname.split('/').pop()}`;
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
                width={markerImgWidth}
                src={
                    props.adjustedScale
                        ? generateImageUrlFor(props.elementData.src, props.adjustedScale)
                        : props.elementData.src
                }
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
