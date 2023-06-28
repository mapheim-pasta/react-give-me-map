import React from 'react';
import { IDrawWorld } from '../utils/world/worldTypes';

interface Props {
    onClick?: (e: React.MouseEvent) => void;
    elementData: IDrawWorld;
}

export const DrawWorld = (props: Props): JSX.Element => {
    const elementData = props.elementData as IDrawWorld;

    const color = '#' + elementData.color.replace('#', '');

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
                    stroke: color,
                    strokeWidth: elementData.strokeWidth,
                    strokeLinejoin: 'round',
                    strokeLinecap: 'round',
                    opacity: elementData.opacity / 100,
                    pointerEvents: 'painted',
                    fill: elementData?.fill ? color : 'none',
                    fillOpacity: 1
                }}
                onClick={props.onClick}
                d={elementData.path}
            />
        </svg>
    );
};
