/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useContext, useReducer } from 'react';

// Start of of Reducer

interface CounterContextState {
    counter: number;
}

const defaultStateValue: CounterContextState = {
    counter: 0
};

export type CounterContextAction =
    | { type: 'increment'; value: number }
    | { type: 'decrement'; value: number };

export function CounterContextReducer(
    state: CounterContextState,
    action: CounterContextAction
): CounterContextState {
    let modifiedState = state;

    switch (action.type) {
        case 'increment':
            modifiedState = {
                ...state,
                counter: state.counter + action.value
            };
            break;
        case 'decrement':
            modifiedState = {
                ...state,
                counter: state.counter - action.value
            };
            break;
        default:
            throw new Error('Unknown action');
    }

    return {
        ...modifiedState
    };
}

// End of Reducer

interface ContextValueType {
    counter: {
        value: number;
        increment: (value: number) => void;
        decrement: (value: number) => void;
    };
}

const Context = React.createContext<ContextValueType>({
    counter: {
        value: 0,
        increment: () => {},
        decrement: () => {}
    }
});

export const CounterContextProvider = (props: { children: JSX.Element }) => {
    const [reducer, dispatch] = useReducer(CounterContextReducer, defaultStateValue);

    const contextValue = {
        counter: {
            value: reducer.counter,
            increment: (value: number) => {
                dispatch({ type: 'increment', value });
            },
            decrement: (value: number) => {
                dispatch({ type: 'decrement', value });
            }
        }
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export const useCounterContext = () => {
    const ctx = useContext(Context);

    return ctx;
};
