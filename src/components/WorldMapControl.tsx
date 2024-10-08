import React from 'react';

import { StyleSpecification } from 'mapbox-gl';
import { ImmutableLike } from 'react-map-gl/dist/esm/types';
import styled from 'styled-components';
import { WorldButton } from '../elements/button/WorldButton';
import { WorldMapStyle } from '../elements/map/WorldMapStyle';

interface Props {
    selectedMapStyle: string | StyleSpecification | ImmutableLike<StyleSpecification>;
    mapStyles: string[];
    geolocate?: boolean;
    onStyleChange: (style: string) => void;
    onGeoClick: () => void;
}

export const WorldMapControl = (props: Props): JSX.Element => {
    return (
        <S_WorldMapControl>
            {props.mapStyles.map((mapStyle) => {
                if (mapStyle === props.selectedMapStyle) {
                    return <React.Fragment key={mapStyle} />;
                }
                return (
                    <WorldMapStyle
                        key={mapStyle}
                        mapStyle={mapStyle}
                        onClick={() => {
                            props.onStyleChange(mapStyle);
                        }}
                    />
                );
            })}
            {props.geolocate && (
                <WorldButton
                    className="mapbox-geolocate"
                    iconSVG={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M352 256C352 309 309 352 256 352C202.1 352 160 309 160 256C160 202.1 202.1 160 256 160C309 160 352 202.1 352 256zM256 208C229.5 208 208 229.5 208 256C208 282.5 229.5 304 256 304C282.5 304 304 282.5 304 256C304 229.5 282.5 208 256 208zM256 0C269.3 0 280 10.75 280 24V65.49C366.8 76.32 435.7 145.2 446.5 232H488C501.3 232 512 242.7 512 256C512 269.3 501.3 280 488 280H446.5C435.7 366.8 366.8 435.7 280 446.5V488C280 501.3 269.3 512 256 512C242.7 512 232 501.3 232 488V446.5C145.2 435.7 76.32 366.8 65.49 280H24C10.75 280 0 269.3 0 256C0 242.7 10.75 232 24 232H65.49C76.32 145.2 145.2 76.32 232 65.49V24C232 10.75 242.7 0 256 0V0zM112 256C112 335.5 176.5 400 256 400C335.5 400 400 335.5 400 256C400 176.5 335.5 112 256 112C176.5 112 112 176.5 112 256z" />
                        </svg>
                    }
                    onClick={props.onGeoClick}
                />
            )}
        </S_WorldMapControl>
    );
};

const S_WorldMapControl = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0 20px 20px 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    > * {
        margin: 10px 0px 0 0px;
    }
`;
