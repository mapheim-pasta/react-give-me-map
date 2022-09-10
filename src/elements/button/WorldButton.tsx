import React from 'react';
import styled, { css } from 'styled-components';
import {
    ALMOST_BLACK,
    GREY1,
    GREY2,
    INSET1,
    INSET2,
    MAIN,
    SHADOW1,
    WHITE
} from '../../libs/worldVariables';

interface Props {
    dimensions: 'dimensions1' | 'dimensions2';
    selected?: boolean;
    iconSVG?: React.ReactElement;
    onClick?: () => void;
}

export const WorldButton = (props: Props): JSX.Element => {
    const dimensions: number = props.dimensions === 'dimensions1' ? 50 : 70;
    const size: string = props.dimensions === 'dimensions1' ? '25px' : '30px';

    return (
        <S_WorldButton
            dimensions={dimensions}
            size={size}
            selected={props.selected}
            onClick={() => {
                if (props.onClick) props.onClick();
            }}
        >
            {props.iconSVG}
        </S_WorldButton>
    );
};

export const S_WorldButton = styled.div<{ dimensions: number; size: string; selected?: boolean }>`
    width: ${(props) => props.dimensions + 'px'};
    height: ${(props) => props.dimensions + 'px'};
    box-shadow: ${SHADOW1}, ${INSET1};
    border-radius: 5px;
    display: flex;
    justify-content: center;
    border: 1px solid ${GREY1};
    align-items: center;
    svg {
        width: ${(props) => props.size};
    }
    ${(props) => {
        if (props.selected) {
            return css`
                background-color: ${MAIN};
                svg {
                    fill: ${WHITE};
                }
            `;
        } else {
            return css`
                background-color: ${WHITE};
                svg {
                    fill: ${ALMOST_BLACK};
                }
                &:hover {
                    background-color: ${GREY2};
                    cursor: pointer;
                    box-shadow: ${SHADOW1}, ${INSET2};
                }
            `;
        }
    }}
`;
