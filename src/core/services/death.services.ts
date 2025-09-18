

import { IPaginatableRequestPayload, Member } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axios = () => getAxios("https://catholicportal.net/api/");

// export const GetDeathList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Member/GetAll/' + (is_export ? '?export=true' : ""), payload);
export const GetDeathList = async ( is_export: boolean = false) => await axios().get('/Member/GetAll/');

export const SaveDeath = async (payload: Member) => await axios().post('/Death/Save', payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateDeath = async (payload: Member) => await axios().post('/Death/Update', payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteDeath = async (id: number) => await axios().delete('/Death/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));