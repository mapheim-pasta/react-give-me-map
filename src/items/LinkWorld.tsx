import React from 'react';
import styled, { css } from 'styled-components';
import { ALMOST_BLACK, EWorldColor } from '../libs/worldVariables';
import { TEXT_BORDER_RADIUS } from '../utils/world/worldConfig';
import { ILinkWorld } from '../utils/world/worldTypes';

export interface ILinkWorldProps {
    elementData: ILinkWorld;
    onClick?: () => void;
}

export const LinkWorld = (props: ILinkWorldProps): JSX.Element => {
    const url = props.elementData?.link?.replace(/^(https?|ftp):\/\//, '');
    const favicon = `https://api.faviconkit.com/${url}/32`;

    return (
        <a href={props.elementData?.link} target="_blank" rel="noreferrer">
            <S_LinkWorld
                width={300 + props.elementData.width * 100}
                color={props.elementData.color}
                borderRadiusPx={props.elementData.borderRadiusPx}
                borderSize={props.elementData.borderSize}
                borderColor={props.elementData.borderColor}
                dropShadowCombined={props.elementData.dropShadowCombined}
                onClick={props?.onClick}
            >
                <div className={'link'}>
                    <div className="left">
                        <img src={favicon} alt={url} />
                        <span>{url}</span>
                    </div>
                    <div className="right">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M280 80C266.7 80 256 69.25 256 56C256 42.75 266.7 32 280 32H424C437.3 32 448 42.75 448 56V200C448 213.3 437.3 224 424 224C410.7 224 400 213.3 400 200V113.9L200.1 312.1C191.6 322.3 176.4 322.3 167 312.1C157.7 303.6 157.7 288.4 167 279L366.1 80H280zM0 120C0 89.07 25.07 64 56 64H168C181.3 64 192 74.75 192 88C192 101.3 181.3 112 168 112H56C51.58 112 48 115.6 48 120V424C48 428.4 51.58 432 56 432H360C364.4 432 368 428.4 368 424V312C368 298.7 378.7 288 392 288C405.3 288 416 298.7 416 312V424C416 454.9 390.9 480 360 480H56C25.07 480 0 454.9 0 424V120z" />
                        </svg>
                    </div>
                </div>
                {props.elementData?.text && <pre>{props.elementData?.text + ' '}</pre>}
            </S_LinkWorld>
        </a>
    );
};

const S_LinkWorld = styled.div<{
    width: number;
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}>`
    width: ${(props) => (props.width > 0 ? props.width : 0)}px;
    min-width: 150px;
    display: flex;
    position: relative;
    flex-direction: column;

    ${(props) => {
        return css`
            border-radius: ${props.borderRadiusPx ?? TEXT_BORDER_RADIUS}px;
            border-width: ${props.borderSize}px;
            border-style: solid;
            border-color: #${props.borderColor};
            box-shadow: ${props.dropShadowCombined};
        `;
    }}
    background-color: ${(props) => '#' + props.color};
    padding: 20px;
    .link {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
            display: flex;
            align-items: center;
            overflow: hidden;
            margin: 0 20px 0 0;
            img {
                width: 25px;
                margin: 0 15px 0 0;
            }
            span {
                font-size: 14px;
                white-space: nowrap;
                text-decoration: underline;
                color: ${(props) =>
                    props.color === EWorldColor.WHITE ? ALMOST_BLACK : '#' + EWorldColor.WHITE};
                text-shadow: ${(props) =>
                    props.color === EWorldColor.WHITE ? '' : '1px 1px 2px rgba(0, 0, 0, 0.25)'};
            }
        }
        .right {
            display: flex;
            align-items: center;
            svg {
                width: 20px;
                fill: ${(props) =>
                    props.color === EWorldColor.WHITE ? ALMOST_BLACK : '#' + EWorldColor.WHITE};
            }
        }
    }
    > pre {
        margin: 15px 0 0 0;
        color: ${(props) =>
            props.color === EWorldColor.WHITE ? ALMOST_BLACK : '#' + EWorldColor.WHITE};
        text-shadow: ${(props) =>
            props.color === EWorldColor.WHITE ? '' : '1px 1px 2px rgba(0, 0, 0, 0.25)'};
        font-size: 13px;
        background-color: unset;
        width: 100%;
        padding: 0;
        line-height: 20px;
        white-space: break-spaces;
    }
`;
