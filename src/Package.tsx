import React, { useReducer } from 'react';
import { ContextProvider } from './context/provider';
import { reducer } from './context/reducer';
import { initialState } from './context/state';
import { IMapProps, Map } from './map/Map';
import { ICallbacks, RegisterCallbacks } from './map/RegisterCallbacks';

interface IProps {
    map: IMapProps;
    children?: React.ReactNode;
    callbacks?: ICallbacks;
}

export const Package = (props: IProps): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            <ContextProvider reducer={{ state, dispatch }}>
                <RegisterCallbacks {...props.callbacks} />
                <Map map={props.map}>{props.children}</Map>
            </ContextProvider>
        </>
    );
};
