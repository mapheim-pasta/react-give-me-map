/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useStateCallback<S>(initialState: S): [S, (state: S, cb?: () => void) => void] {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null); // mutable ref to store current callback

    const setStateCallback = useCallback((state: S, cb: any) => {
        cbRef.current = cb; // store passed callback to ref
        setState(state);
    }, []);

    useEffect(() => {
        // cb.current is `null` on initial render, so we only execute cb on state *updates*
        if (cbRef.current) {
            (cbRef.current as any)(state);
            cbRef.current = null; // reset callback after execution
        }
    }, [state]);

    return [state, setStateCallback];
}
