import React from 'react';
import styled, { css } from 'styled-components';
import {
    ALMOST_BLACK,
    GREY1,
    GREY2,
    INSET2,
    MAIN,
    SHADOW1,
    WHITE
} from '../../libs/worldVariables';

interface Props {
    selected?: boolean;
    iconSVG?: React.ReactElement;
    onClick?: () => void;
}

export const WorldButton = (props: Props): JSX.Element => {
    return (
        <S_WorldButton
            selected={props.selected}
            onClick={() => {
                if (props.onClick) props.onClick();
            }}
        >
            {props.iconSVG}
        </S_WorldButton>
    );
};

export const S_WorldButton = styled.div<{ selected?: boolean }>`
    width: 37px;
    height: 37px;
    border: 1px solid #ebebeb;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    display: flex;
    justify-content: center;
    border: 1px solid ${GREY1};
    align-items: center;
    svg {
        width: 18px;
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
