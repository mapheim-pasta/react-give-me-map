export interface IState {
    selectedIds: string[];
    callbacks: {
        onMarkersSelected?: (ids: string[]) => void;
    };
}

export const initialState: IState = {
    selectedIds: [],
    callbacks: {}
};
