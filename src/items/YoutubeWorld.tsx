import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import styled, { css } from 'styled-components';
import { TEXT_BORDER_RADIUS } from '../utils/world/worldConfig';
import { IYoutubeWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IYoutubeWorld;
}

export const YoutubeWorld = (props: Props): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoElement = useRef<any>();
    const [playing, setPlaying] = useState(false);

    let videoId;
    const video = props.elementData.video;
    if (video?.indexOf('watch?v=') >= 0) {
        videoId = video?.split('watch?v=')[1];
    } else if (video?.indexOf('youtu.be/') >= 0) {
        videoId = video?.split('youtu.be/')[1];
    } else {
        videoId = video;
    }
    if (videoId?.indexOf('?t=') >= 0) {
        videoId = videoId.split('?t=')[0];
    }
    if (videoId?.indexOf('&t=') >= 0) {
        videoId = videoId.split('&t=')[0];
    }

    console.log('Playing', playing);

    useEffect(() => {
        if (videoElement.current) {
            setPlaying(false);
        }
    }, [props.elementData.video]);

    return (
        <S_YoutubeWorld
            borderRadiusPx={props.elementData.borderRadiusPx}
            borderSize={props.elementData.borderSize}
            borderColor={props.elementData.borderColor}
            dropShadowCombined={props.elementData.dropShadowCombined}
        >
            <div className="placeholder">
                <div className="view">
                    {videoId && (
                        <YouTube
                            onReady={(e) => {
                                videoElement.current = e;
                            }}
                            videoId={videoId}
                            className={'video'}
                            opts={{
                                playerVars: {
                                    controls: 0
                                }
                            }}
                            onEnd={() => {
                                videoElement.current?.target?.seekTo(0);
                            }}
                        />
                    )}
                    {!playing && (
                        <div className="paused">
                            <div
                                className="linkRect"
                                onClick={(e) => {
                                    window.open(props.elementData?.video, '_blank')?.focus();
                                    setPlaying(false);
                                    e.stopPropagation();
                                }}
                            />
                            <div
                                className="playRect"
                                onClick={(e) => {
                                    videoElement.current?.target?.playVideo();
                                    e.stopPropagation();
                                    setPlaying(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
                                </svg>
                                <div className="white" />
                            </div>
                        </div>
                    )}
                    {playing && (
                        <div className="playing">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                onClick={(e) => {
                                    videoElement.current?.target?.pauseVideo();
                                    e.stopPropagation();
                                    setPlaying(false);
                                }}
                            >
                                <path d="M52.5 71.4c-9.5-7.9-22.8-9.7-34.1-4.4S0 83.6 0 96V416c0 12.4 7.2 23.7 18.4 29s24.5 3.6 34.1-4.4l192-160c7.3-6.1 11.5-15.1 11.5-24.6s-4.2-18.5-11.5-24.6l-192-160zM384 96c0-17.7-14.3-32-32-32s-32 14.3-32 32V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96zm128 0c0-17.7-14.3-32-32-32s-32 14.3-32 32V416c0 17.7 14.3 32 32 32s32-14.3 32-32V96z" />{' '}
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                                onClick={(e) => {
                                    window.open(props.elementData.video, '_blank')?.focus();
                                    videoElement.current?.target?.pauseVideo();
                                    setPlaying(false);
                                    e.stopPropagation();
                                }}
                            >
                                <path d="M288 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h50.7L169.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 141.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H288zM80 64C35.8 64 0 99.8 0 144V400c0 44.2 35.8 80 80 80H336c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h80c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />{' '}
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </S_YoutubeWorld>
    );
};

const S_YoutubeWorld = (styled.div as any).attrs(() => ({
    style: {}
}))`
    width: 400px;
    height: 230px;
    position: relative;
    pointer-events: none;
    .placeholder {
        width: 100%;
        height: 100%;
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        ${(props: any) => {
            return css`
                border-radius: ${props.borderRadiusPx ?? TEXT_BORDER_RADIUS}px;
                border-width: ${props.borderSize}px;
                border-style: solid;
                border-color: #${props.borderColor};
                box-shadow: ${props.dropShadowCombined};
            `;
        }}
        .edit {
            font-size: 63px;
            color: #212121;
        }
        .view {
            width: 100%;
            height: 100%;
            > div:nth-child(1) {
                width: 100%;
                height: 100%;
                .video {
                    width: 100%;
                    height: 100%;
                }
            }
            .paused {
                .linkRect {
                    position: absolute;
                    top: 22px;
                    left: 20px;
                    width: 360px;
                    height: 40px;
                    cursor: pointer;
                    pointer-events: all;
                }
                .playRect {
                    position: absolute;
                    top: 83px;
                    left: 163px;
                    background-color: white;
                    cursor: pointer;
                    pointer-events: all;
                    svg {
                        width: 72px;
                        fill: #dc1201;
                        position: absolute;
                        z-index: 2;
                    }
                    .white {
                        background-color: white;
                        width: 35px;
                        height: 30px;
                        position: absolute;
                        z-index: 1;
                        top: 20px;
                        left: 15px;
                    }
                }
            }
            .playing {
                position: absolute;
                bottom: 15px;
                left: 5px;
                color: white;
                display: flex;
                svg {
                    width: 30px;
                    fill: white;
                    pointer-events: all;
                    margin: 0 0 0 15px;
                    filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.8))
                        drop-shadow(1px 1px 5px rgba(0, 0, 0, 0.8));
                }
            }
        }
    }
`;
