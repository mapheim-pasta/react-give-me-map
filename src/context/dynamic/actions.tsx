import { useCtx } from './provider';

export enum Actions {
    SET_SELECTED_IDS,
    SET_BUILDERS,
    SET_FONTS,
    SET_IS_WIDE
}

export type CustomMarkerBuilders = Record<string, (props: Record<string, unknown>) => JSX.Element>;

export type PinIconBuilder = (props: { iconText: string }) => JSX.Element;

export type CustomBuilders = {
    reactMarkers?: CustomMarkerBuilders;
    pinIcon?: PinIconBuilder;
};

export type Fonts = {
    regular: string;
    semiBold: string;
    bold: string;
};

export const useActions = (): IReturnUseActions => {
    const { dispatch } = useCtx();

    function setSelectedIds(value: string[]) {
        dispatch({ type: Actions.SET_SELECTED_IDS, value });
    }

    function setCustomBuilders(value: CustomBuilders) {
        dispatch({ type: Actions.SET_BUILDERS, value });
    }

    function setFonts(value: Fonts) {
        dispatch({ type: Actions.SET_FONTS, value });
    }

    function setIsWide(value: boolean) {
        dispatch({ type: Actions.SET_IS_WIDE, value });
    }

    return {
        setSelectedIds,
        setCustomBuilders,
        setFonts,
        setIsWide
    };
};

export interface IReturnUseActions {
    setSelectedIds: (value: string[]) => void;

    setCustomBuilders: (value: CustomBuilders) => void;

    setFonts: (value: Fonts) => void;

    setIsWide: (value: boolean) => void;
}
