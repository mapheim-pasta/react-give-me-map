import Color from 'color';
import { motion } from 'framer-motion';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Fonts } from '../../../context/dynamic/actions';
import { MarkerGlobalSettings } from '../../../utils/map/mapTypes';
import { DotMarker, S_DotMarker } from './DotMarker';

const MONTHS_STRINGS: Record<string, string[]> = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nb: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
    cs: ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'],
    sk: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
};

interface Props {
    isActive: boolean;
    size: number;
    markerId: string;
    withStar: boolean;
    eventDate: string | null;
    language: string;
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
    markerGlobalSettings: MarkerGlobalSettings['v2/variant_icon'];
}

export const ImageMarker = (props: Props): JSX.Element => {
    function getImageStyle() {
        if (props.eventDate != null) {
            return {
                width: props.markerGlobalSettings.mediumImageWidth + 'px',
                height: props.markerGlobalSettings.mediumImageHeight + 'px',
                backgroundImage: `url(https://dvtqxks0zalev.cloudfront.net/f7836dea-6699-48c6-bc52-240fd4e7a265.png)`,
                backgroundSize: 'contain'
            };
        }
        if (props.image.type === 'story' && props.image.url) {
            return {
                border: '3px solid #fff',
                borderRadius: '10px',
                width:
                    (props.size === 2
                        ? props.markerGlobalSettings.mediumImageWidth
                        : props.markerGlobalSettings.largeStoryImageWidth) + 'px',
                height:
                    (props.size === 2
                        ? props.markerGlobalSettings.mediumImageHeight
                        : props.markerGlobalSettings.largeStoryImageHeight) + 'px',
                backgroundColor: '#fff',
                backgroundImage: `url(${props.image.url})`,
                backgroundSize: 'cover',
                marginBottom: '-5px'
            };
        }

        if (props.image.url) {
            return {
                width: props.markerGlobalSettings.mediumImageWidth + 'px',
                height: props.markerGlobalSettings.mediumImageHeight + 'px',
                backgroundImage: `url(${props.image.url})`,
                backgroundSize: 'contain'
            };
        }

        return null;
    }

    function getDate() {
        const [year, month, day] = props.eventDate?.split('-') ?? [];

        if (!year || !month || !day) {
            return null;
        }

        const monthNumber = Number(month);
        const dayNumber = Number(day);

        if (isNaN(monthNumber) || isNaN(dayNumber)) {
            return null;
        }

        const monthsStrings = MONTHS_STRINGS[props.language] ?? MONTHS_STRINGS.en;

        return {
            day,
            month: monthsStrings[monthNumber - 1]
        };
    }

    const imageStyle = getImageStyle();
    const date = getDate();
    const textColor = Color(props.color).isLight() ? '#000' : '#fff';

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
                {date && <S_Month $font={props.fonts.bold}>{date.month}</S_Month>}
                {date && <S_Day $font={props.fonts.bold}>{date.day}</S_Day>}
                {imageStyle ? (
                    <S_ImageLarge
                        $selectable={props.selectable}
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
                        orderNumber={props.orderNumber}
                        enableOrderNumber={
                            props.size === 2
                                ? props.markerGlobalSettings.enableOrderNumberInMedium
                                : true
                        }
                        fonts={props.fonts}
                        selectable={props.selectable}
                    />
                )}
                {props.withStar && <S_Star $selectable={props.selectable} />}
                {(props.size === 3 ||
                    (props.size === 2 && props.markerGlobalSettings.enableOrderNumberInMedium)) &&
                    props.orderNumber &&
                    imageStyle && (
                        <S_OrderNumber
                            $selectable={props.selectable}
                            $textColor={textColor}
                            $color={props.color}
                            $font={props.fonts.semiBold}
                        >
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

const S_ImageLarge = styled.div<{ $selectable: boolean }>`
    pointer-events: all;
    cursor: pointer;
    position: relative;
    z-index: 1;
`;

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
    position: relative;
    z-index: 2;
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
    z-index: 2;
    filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.2));
    ${(props) =>
        props.$selectable &&
        css`
            pointer-events: all;
            cursor: pointer;
        `}
`;

const S_OrderNumber = styled.div<{
    $font: string;
    $selectable: boolean;
    $color: string;
    $textColor: string;
}>`
    position: absolute;
    z-index: 2;
    top: -10px;
    left: -10px;
    min-width: 30px;
    padding-left: 5px;
    padding-right: 5px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    border-radius: 15px;
    background: #fff;
    color: ${(props) => props.$textColor};
    background-color: ${(props) => props.$color};
    font-family: ${(props) => props.$font};
    filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.2));
    ${(props) =>
        props.$selectable &&
        css`
            pointer-events: all;
            cursor: pointer;
        `}
`;

const S_Month = styled.div<{ $font: string }>`
    position: absolute;
    color: white;
    text-transform: uppercase;
    left: 0;
    right: 0;
    top: -1px;
    font-size: 10px;
    text-align: center;
    z-index: 2;
    font-family: ${(props) => props.$font};
`;

const S_Day = styled.div<{ $font: string }>`
    position: absolute;
    color: #2a2a2a;
    left: 0;
    right: 0;
    top: 22px;
    font-size: 22px;
    text-align: center;
    z-index: 2;
    font-family: ${(props) => props.$font};
`;
