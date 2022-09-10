import React from 'react';
import styled from 'styled-components';
import { GREY1, INSET2, SHADOW1, WHITE } from '../../libs/worldVariables';
import { EMapStyle } from '../../utils/map/mapTypes';

interface Props {
    onClick: (style: EMapStyle) => void;
    mapStyle: EMapStyle;
}

export const WorldMapStyle = (props: Props): JSX.Element => {
    let url = '';
    if (props.mapStyle === EMapStyle.SATELLITE) {
        url = '../../../../map-satellite.png';
    } else if (props.mapStyle === EMapStyle.OUTDOOR) {
        url = '../../../../map-outdoor.png';
    } else if (props.mapStyle === EMapStyle.WORLD) {
        url = '../../../../map-world.png';
    }

    return (
        <S_WorldMapStyle
            url={url}
            onClick={() => {
                props.onClick(props.mapStyle);
            }}
        />
    );
};

const S_WorldMapStyle = styled.div<{ url: string }>`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    background-image: url(${(props) => props.url});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-color: ${WHITE};
    box-shadow: ${SHADOW1};
    border: 1px solid ${GREY1};
    cursor: pointer;
    position: relative;
    &:hover::after {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-color: rgba(255, 255, 255, 0.25);
        border-radius: 5px;
    }
    &:hover {
        box-shadow: ${SHADOW1}, ${INSET2};
    }
`;
