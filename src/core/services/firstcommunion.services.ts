import { FirstCommunion, IAppState, IPaginatableRequestPayload } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 1

// export const GetFirstCommunionList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/FirstCommunion/GetAll/' + (is_export ? '?export=true' : ""), payload);
export const GetFirstCommunionList = async ( is_export: boolean = false) => await axiosService().get(`/FirstCommunion/GetAll?id=${configId}`);
export const Search = async ( search: string) => await axiosService().get(`/FirstCommunion/Search?search=${search}&id=${configId}`);
export const Check = async ( search: string) => await axiosService().get(`/FirstCommunion/CheckIdExist?search=${search}&id=${configId}`);
export const SaveFirstCommunion = async (payload: FirstCommunion) => await axiosService().post('/FirstCommunion/Save',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateFirstCommunion = async (payload: FirstCommunion) => await axiosService().post('/FirstCommunion/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteFirstCommunion = async (id: number) => await axiosService().delete('/FirstCommunion/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));



export const fetchFirstCommunion = async (): Promise<FirstCommunion[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/FirstCommunion/GetAll?id=${configId}`);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request was made but no response received:', error.request)
        }
      } else {
        console.error('Error:', error.message);
      }
      return [];
    }
  };