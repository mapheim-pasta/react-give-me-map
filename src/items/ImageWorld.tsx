import React from 'react';
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
    const getPixelInScale = (val: number | undefined) => (val ? val * props.adjustedScale : val);
    const getShadowInScale = (str: string | undefined) =>
        (str || '')
            .split('px')
            .map((e) => (!isNaN(parseFloat(e)) ? `${parseFloat(e) * 1.34344}px` : e))
            .join(' ');

    return (
        <div>
            <img
                width={markerImgWidth * props.adjustedScale}
                src={generateImageUrlFor(props.elementData, props.adjustedScale)}
                style={{
                    borderRadius: `${props.elementData.borderRadiusPx}px`,
                    borderWidth: `${getPixelInScale(props.elementData.borderSize)}px`,
                    borderStyle: 'solid',
                    borderColor: props.elementData.borderColor,
                    boxShadow: getShadowInScale(props.elementData.dropShadowCombined)
                }}
            />
        </div>
    );
};
