

import { useSelector } from "react-redux";
import { getAxios, getConfig } from "../utility";
import { RootState } from "../stores";
import { IAppState } from "../interfaces";
const apiAxios = () => getAxios("https://catholicportal.net/api/");


// const appState = useSelector<RootState, IAppState>((state) => state.app)

export const VerifyCustomer = async (username: string, password: string) => await apiAxios().post('/Authentication/VerifyCustomer', { username, password });
export const VerifyCustomerOtp = async (otp: string, requestId: string) => await apiAxios().post('/Authentication/VerifyOtp', { otp, requestId });
export const ExpireToken = async () => await apiAxios().post('/Authentication/ExpireToken', {});
export const GetUserCurrentSession = async () => await apiAxios().post('/Authentication/GetCustomerCurrentSession', {});


