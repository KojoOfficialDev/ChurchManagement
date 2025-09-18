

import { getAxios, getConfig } from "../utility";
const apiAxios = () => getAxios("https://catholicportal.net/api/");

export const GetFrontendConfig = async () => await getAxios().get('/frontend-config.json');

