/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext } from 'react';
import { initialState, IState } from './state';

export const MainContext = createContext(initialState);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContextProvider = ({ reducer, children }: any) => (
    <MainContext.Provider value={reducer}>{children}</MainContext.Provider>
);

export const useCtx = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = useContext(MainContext) as any;
    return {
        state: ctx.state as IState,
        // eslint-disable-next-line @typescript-eslint/ban-types
        dispatch: ctx.dispatch as Function
    };
};
