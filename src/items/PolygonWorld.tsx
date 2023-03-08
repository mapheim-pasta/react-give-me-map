import React from 'react';
import styled from 'styled-components';
import { MarkerStyle } from '../utils/map/mapTypes';
import { IPolygonWorld } from '../utils/world/worldTypes';
import { PolygonWorld3d } from './geojson/PolygonWorld3d';

interface Props {
    markerId: string;
    onClick?: () => void;
    elementData: IPolygonWorld;
    adjustedScale: number;

    selectable: boolean;

    isHighlighted?: boolean;

    highlightedStyle?: MarkerStyle;

    selectableStyle?: MarkerStyle;
}

export const PolygonWorld = (props: Props): JSX.Element => {
    const elementData = props.elementData as IPolygonWorld;

    const style = {
        stroke: '#' + elementData.color,
        strokeWidth: 3 / props.adjustedScale,
        strokeOpacity: 0.9,
        strokeDasharray: elementData.strokeDashArray ?? 0,
        pointerEvents: props.selectable ? ('painted' as const) : ('none' as const),
        cursor: props.selectable ? ('pointer' as const) : ('inherit' as const)
    };

    if (props.elementData.renderAs3d) {
        return (
            <PolygonWorld3d
                markerId={props.markerId}
                data3d={props.elementData.data3d ?? {}}
                coordinates={props.elementData.coordinates}
            />
        );
    }

    //Split for display bug in big zoom
    return (
        <div
            style={{
                width: elementData.width + 'px',
                height: elementData.height + 'px'
            }}
        >
            <S_SVG>
                <path style={style} d={elementData.path} onClick={props.onClick} />
            </S_SVG>
            {props.selectableStyle && (
                <S_SVG>
                    <defs>
                        <filter id={props.markerId + 'select'} x="0" y="0">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                        </filter>
                    </defs>
                    <path
                        onClick={props.onClick}
                        d={elementData.path}
                        filter={`url(#${props.markerId + 'select'})`}
                        style={{
                            ...style,
                            strokeWidth: props.selectableStyle.pixelSize / 5,
                            stroke: props.selectableStyle?.shadowColor
                        }}
                    />
                </S_SVG>
            )}

            {props.highlightedStyle && props.isHighlighted && (
                <S_SVG>
                    <defs>
                        <filter id={props.markerId + 'highlight'} x="0" y="0">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
                        </filter>
                    </defs>
                    <path
                        onClick={props.onClick}
                        d={elementData.path}
                        filter={`url(#${props.markerId + 'highlight'})`}
                        style={{
                            ...style,
                            strokeWidth: props.highlightedStyle.pixelSize / 5,
                            stroke: props.highlightedStyle?.shadowColor
                        }}
                    />
                </S_SVG>
            )}
            {elementData.fill && (
                <S_SVG style={{}}>
                    <path
                        onClick={props.onClick}
                        style={{
                            fillOpacity: 0.15,
                            fill: '#' + elementData.color,
                            pointerEvents: props.selectable ? 'painted' : 'none',
                            cursor: props.selectable ? 'pointer' : 'inherit'
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
