import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ALMOST_BLACK, EWorldColor } from '../libs/worldVariables';
import { TEXT_BORDER_RADIUS } from '../utils/world/worldConfig';
import { ITextWorld } from '../utils/world/worldTypes';

export interface ITextWorldProps {
    elementData: ITextWorld;
}

export const TextWorld = (props: ITextWorldProps): JSX.Element => {
    const [value, setValue] = useState<string>(props.elementData?.text);

    useEffect(() => {
        if (props.elementData?.text !== value) {
            setValue(props.elementData?.text);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.elementData?.text]);

    return (
        <S_TextWorld
            fill={props.elementData.fill.toString()}
            width={300 + props.elementData.width * 100}
            color={props.elementData.color}
            borderRadiusPx={props.elementData.borderRadiusPx}
            borderSize={props.elementData.borderSize}
            borderColor={props.elementData.borderColor}
            dropShadowCombined={props.elementData.dropShadowCombined}
        >
            <pre>{value + ' '}</pre>
        </S_TextWorld>
    );
};

const S_TextWorld = styled.div<any>`
    width: ${(props: any) => (props.width > 0 ? props.width : 0)}px;
    min-width: 150px;
    display: flex;
    position: relative;

    ${(props: any) => {
        return css`
            border-radius: ${props.borderRadiusPx ?? TEXT_BORDER_RADIUS}px;
            border-width: ${props.borderSize}px;
            border-style: solid;
            border-color: #${props.borderColor};
            box-shadow: ${props.dropShadowCombined};
        `;
    }}
    ${(props: any) => {
        if (props.fill === 'true') {
            return css`
                background-color: ${(props: any) => '#' + props.color};
                padding: 20px;
                > pre {
                    color: ${(props: any) =>
                        props.color === EWorldColor.WHITE ? ALMOST_BLACK : '#' + EWorldColor.WHITE};
                    text-shadow: ${(props: any) =>
                        props.color === EWorldColor.WHITE ? '' : '1px 1px 2px rgba(0, 0, 0, 0.25)'};
                }
            `;
        } else {
            return css`
                padding: 5px;
                text-shadow: ${(props: any) =>
                    props.color === EWorldColor.WHITE
                        ? '1px 1px 2px rgba(0, 0, 0, 0.5)'
                        : '1px 1px 2px rgba(0, 0, 0, 0.25)'};
                color: ${(props: any) =>
                    props.color === EWorldColor.WHITE
                        ? '#' + EWorldColor.WHITE
                        : '#' + props.color};
            `;
        }
    }}
    > pre {
        font-size: 14px;
        background-color: unset;
        resize: none;
        width: 100%;
        padding: 0;
        margin: 0;
        line-height: 22px;
        white-space: break-spaces;
    }
`;
