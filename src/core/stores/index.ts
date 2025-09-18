import { combineReducers, configureStore } from "@reduxjs/toolkit";
import user from "./slices/user_slice";
import app from "./slices/app_slice";

const reducer = combineReducers({
    app, user, // Add more slice from here
})

const store = configureStore({
    reducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;