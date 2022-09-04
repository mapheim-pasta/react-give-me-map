import React, { useContext } from 'react';

export interface ICallbacks {
    onMarkersSelected?: (ids: string[]) => void;
}

const defaultCallbacks: Required<ICallbacks> = {
    onMarkersSelected: (ids: string[]) => {}
}

export const GlobalCallbackContext = React.createContext<Required<ICallbacks>>(defaultCallbacks);

export const GlobalCallbackContextProvider = (props: { children: JSX.Element, callbacks: ICallbacks}) => {
    const callbacks: Required<ICallbacks> = {
        onMarkersSelected: props.callbacks.onMarkersSelected ?? defaultCallbacks.onMarkersSelected,
    };

    return <GlobalCallbackContext.Provider value={callbacks}>{props.children}</GlobalCallbackContext.Provider>
}

export const useGlobalCallbacks = () => {
    const ctx = useContext(GlobalCallbackContext);

    return ctx;
}