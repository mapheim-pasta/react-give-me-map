import React from 'react';
import styled, { css } from 'styled-components';
import { EWorldColor, WHITE } from '../libs/worldVariables';
import { IPinWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IPinWorld;
}

export const PinWorld = (props: Props): JSX.Element => {
    let element;
    if (props.elementData.img) {
        element = <S_ImagePin src={props.elementData.img} />;
    } else if (props.elementData.emoji) {
        element = (
            <S_EmojiPin>
                <span>{props.elementData.emoji}</span>
            </S_EmojiPin>
        );
    } else {
        element = <S_DotPin dotColor={props.elementData.dotColor} inverse={inverse()} />;
    }

    function inverse() {
        return false;
        //todo: based on style
        // return state.worldMap.getStyle().name === 'Satellite Streets';
    }

    return (
        <S_PinWorld>
            {element}
            <S_PinWorldLabel inverse={inverse()}>{props.elementData.label}</S_PinWorldLabel>
        </S_PinWorld>
    );
};

const S_PinWorld = (styled.div as any).attrs(() => ({}))`
    width: 45px;
    height: 45px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const S_PinWorldLabel = (styled.span as any).attrs(() => ({}))`
    position: absolute;
    top: 12px;
    left: 55px;
    white-space: nowrap;
    font-size: 16px;
    ${(props: any) => {
        if (props.inverse) {
            return css`
                color: ${WHITE};
                text-shadow: 1px 1px 0px #00000099;
            `;
        } else {
            return css`
                color: '#000000';
                /* text-shadow: 1px 1px 0px #ffffff99; */
                text-shadow: -1px -1px 1px #fff, 1px -1px 1px #fff, -1px 1px 1px #fff,
                    1px 1px 1px #fff;
            `;
        }
    }}
`;

const S_ImagePin = (styled.div as any).attrs(() => ({
    style: {}
}))`
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url(${(props: any) => props.src});
`;

const S_EmojiPin = (styled.div as any).attrs(() => ({
    style: {}
}))`
    display: flex;
    align-items: center;
    justify-content: center;
    span {
        font-size: 33px;
    }
`;

export const S_DotPin = (styled.div as any).attrs(() => ({
    style: {}
}))`
    border-radius: 50%;
    width: 15px;
    height: 15px;
    border: 4px solid white;
    box-sizing: content-box;

    ${(props: any) => {
        if (props.inverse) {
            return css`
                background-color: #${props.dotColor ?? EWorldColor.BLUE};
                box-shadow: 2px 2px 5px #2a2a2a;
                outline: 1px solid #4a4a4a;
            `;
        } else {
            return css`
                background-color: #${props.dotColor ?? EWorldColor.BLUE};
                box-shadow: 2px 2px 5px #bfbfbf;
                outline: 1px solid #d9d9d9;
            `;
        }
    }}
`;
