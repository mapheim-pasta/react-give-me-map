import { motion } from 'framer-motion';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Fonts } from '../../../context/dynamic/actions';
import { DotMarker, S_DotMarker } from './DotMarker';

interface Props {
    isActive: boolean;
    size: number;
    markerId: string;
    withStar: boolean;
    orderNumber: string | null;
    image:
        | {
              type: 'category';
              url: string;
          }
        | { type: 'story'; url: string };
    text: string;
    fonts: Fonts;
    color: string;
    className?: string;
    selectable: boolean;
}

export const ImageMarker = (props: Props): JSX.Element => {
    function getImageStyle() {
        if (props.image.type === 'story' && props.image.url) {
            return {
                border: '3px solid #fff',
                borderRadius: '10px',
                width: '94px',
                height: '70px',
                backgroundColor: '#fff',
                backgroundImage: `url(${props.image.url})`,
                backgroundSize: 'cover',
                marginBottom: '-5px'
            };
        }

        if (props.image.url) {
            return {
                width: '50px',
                height: '50px',
                backgroundImage: `url(${props.image.url})`,
                backgroundSize: 'contain'
            };
        }

        return null;
    }

    const imageStyle = getImageStyle();

    return (
        <S_ImageMarker
            $isActive={props.isActive}
            className={props.className}
            $selectable={props.selectable}
            initial={{ transform: 'scale(0)', display: 'none' }}
            animate={{ transform: 'scale(1)', display: 'flex' }}
            exit={{ transform: 'scale(0)', display: 'none' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            <S_ImageLargeContainer
                layout
                transition={{
                    duration: 0.2,
                    ease: 'easeInOut'
                }}
            >
                {imageStyle ? (
                    <S_ImageLarge
                        style={{
                            ...getImageStyle(),
                            backgroundPosition: 'center bottom',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                ) : (
                    <DotMarker
                        color={props.color}
                        isActive={props.isActive}
                        markerId={props.markerId}
                        orderNumber={props.orderNumber}
                        fonts={props.fonts}
                        selectable={props.selectable}
                    />
                )}
                {props.withStar && <S_Star $selectable={props.selectable} />}
                {props.orderNumber && imageStyle && (
                    <S_OrderNumber $selectable={props.selectable} $font={props.fonts.semiBold}>
                        {props.orderNumber}
                    </S_OrderNumber>
                )}
            </S_ImageLargeContainer>
            {props.size === 3 && (
                <S_Text
                    $selectable={props.selectable}
                    $font={props.fonts.semiBold}
                    layout
                    initial={{
                        transform: 'scale(0)',
                        display: 'none'
                    }}
                    animate={{
                        transform: 'scale(1)',
                        display: 'flex'
                    }}
                    exit={{
                        transform: 'scale(0)',
                        display: 'none'
                    }}
                    transition={{
                        duration: 0.2,
                        delay: 0.2,
                        ease: 'easeInOut'
                    }}
                >
                    {props.text}
                </S_Text>
            )}
        </S_ImageMarker>
    );
};

const S_ImageMarker = styled(motion.div)<{ $isActive: boolean; $selectable: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: scale(0);
    pointer-events: all;
    display: none;
    padding: 2px;
    ${(props) =>
        props.$isActive &&
        css`
            animation: ${shakeAnimation} 300ms 1 linear;
            position: relative;
            z-index: 9999;
            ${S_ImageLarge}, ${S_Text}, ${S_DotMarker} {
                filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.4));
            }
        `}
    ${(props) =>
        !props.$isActive &&
        props.$selectable &&
        css`
            &:hover {
                ${S_ImageLarge}, ${S_Text}, ${S_DotMarker} {
                    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2));
                }
            }
        `}
`;

const S_ImageLargeContainer = styled(motion.div)`
    position: relative;
    display: flex;
`;

const shakeAnimation = keyframes`
    0% { transform: translate(1px, 1px) rotate(0deg); }
    50% { transform: translate(-2px, -2px) rotate(-2deg); }
    100% { transform: translate(1px, 1px) rotate(0deg); }
`;

const S_ImageLarge = styled.div``;

const S_Text = styled(motion.div)<{ $font: string; $selectable: boolean }>`
    max-width: 130px;
    line-height: 18px;
    background: #fff;
    padding: 6px 10px;
    border-radius: 10px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
    box-sizing: border-box;
    font-family: ${(props) => props.$font};
    font-size: 13px;
    word-break: break-word;
    ${(props) =>
        props.$selectable &&
        css`
            pointer-events: all;
            cursor: pointer;
        `}
`;

const S_Star = styled.div<{ $selectable: boolean }>`
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    background-image: url('https://dvtqxks0zalev.cloudfront.net/8480b398-03a0-4372-b46e-bab3a8cd6946.png');
    background-size: contain;
    filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.2));
    ${(props) =>
        props.$selectable &&
        css`
            pointer-events: all;
            cursor: pointer;
        `}
`;

const S_OrderNumber = styled.div<{ $font: string; $selectable: boolean }>`
    position: absolute;
    top: -10px;
    left: -10px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;
    background: #fff;
    font-family: ${(props) => props.$font};
    filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.2));
    ${(props) =>
        props.$selectable &&
        css`
            pointer-events: all;
            cursor: pointer;
        `}
`;