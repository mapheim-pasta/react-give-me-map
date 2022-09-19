import React from 'react';
import { IDrawWorld } from '../utils/world/worldTypes';

interface Props {
    onSelected?: () => void;
    elementData: IDrawWorld;
}

export const DrawWorld = (props: Props): JSX.Element => {
    const elementData = props.elementData as IDrawWorld;

    return (
        <svg
            style={{
                width: elementData.width + 'px',
                height: elementData.height + 'px',
                fill: 'none',
                overflow: 'visible'
            }}
        >
            <path
                style={{
                    stroke: '#' + elementData.color,
                    strokeWidth: elementData.strokeWidth,
                    strokeLinejoin: 'round',
                    strokeLinecap: 'round',
                    opacity: elementData.opacity / 100,
                    pointerEvents: 'painted',
                    fill: elementData?.fill ? '#' + elementData.color : 'none',
                    fillOpacity: 1
                }}
                onClick={() => {
                    props.onSelected?.();
                }}
                d={elementData.path}
            />
        </svg>
    );
};
