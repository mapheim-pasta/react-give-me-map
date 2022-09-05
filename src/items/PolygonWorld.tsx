import React from 'react';
import styled from 'styled-components';
import { IPolygonWorld } from '../utils/world/worldTypes';

interface Props {
    onSelected?: () => void;
    elementData: IPolygonWorld;
    adjustedScale: number;
}

export const PolygonWorld = (props: Props): JSX.Element => {
    const elementData = props.elementData as IPolygonWorld;

    const style = {
        stroke: '#' + elementData.color,
        strokeWidth: 3 / props.adjustedScale,
        strokeOpacity: 0.9,
        pointerEvents: 'painted'
    };

    //Split for display bug in big zoom
    return (
        <div
            style={{
                width: elementData.width + 'px',
                height: elementData.height + 'px'
            }}
        >
            <S_SVG>
                <path
                    style={style as any}
                    onClick={() => {
                        props.onSelected?.();
                    }}
                    d={elementData.path}
                />
            </S_SVG>
            {elementData.fill && (
                <S_SVG>
                    <path
                        style={{
                            fillOpacity: 0.15,
                            fill: '#' + elementData.color,
                            pointerEvents: 'painted'
                        }}
                        onClick={() => {
                            props.onSelected?.();
                        }}
                        d={elementData.path}
                    />
                </S_SVG>
            )}
        </div>
    );
};

const S_SVG = styled.svg`
    width: 100%;
    height: 100%;
    fill: none;
    overflow: visible;
    position: absolute;
    top: 0;
    left: 0;
`;
