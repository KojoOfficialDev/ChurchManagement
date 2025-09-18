import { createSlice } from '@reduxjs/toolkit';
import { IAppState } from '../../interfaces';


const initialState: IAppState = {
    loading: false,
    error: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFrontendConfig: (state, action) => {
            state.config = action.payload;
        }
    },
});

export const { setAppLoading, setFrontendConfig } = appSlice.actions;
export default appSlice.reducer;