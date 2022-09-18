import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';
import styled, { css } from 'styled-components';
import { parseYoutubeSource } from '../utils/marker/youtubeUtils';
import { TEXT_BORDER_RADIUS } from '../utils/world/worldConfig';
import { IYoutubeWorld } from '../utils/world/worldTypes';

interface Props {
    elementData: IYoutubeWorld;
}

export const YoutubeWorld = (props: Props): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoElement = useRef<any>();
    const [videoReady, setVideoReady] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);

    const videoId = parseYoutubeSource(props.elementData.video);

    console.log('Youtube', videoId);

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
                                setVideoReady(true);
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
                    {videoReady && (
                        <div
                            className="ready"
                            onClick={() => {
                                if (videoPlaying) {
                                    videoElement.current?.target?.pauseVideo();
                                } else {
                                    videoElement.current?.target?.playVideo();
                                }
                                setVideoPlaying(!videoPlaying);
                            }}
                        />
                    )}
                </div>
            </div>
        </S_YoutubeWorld>
    );
};

const S_YoutubeWorld = styled.div<{
    borderRadiusPx?: number;
    borderSize?: number;
    borderColor?: string;
    dropShadowCombined?: string;
}>`
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
        ${(props) => {
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
            position: relative;
            display: flex;
            .video {
                width: 100%;
                height: 100%;
                display: flex;
                * {
                    width: 100%;
                    height: 100%;
                    display: flex;
                }
            }
            .ready {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                cursor: pointer;
                pointer-events: all;
            }
        }
    }
`;
