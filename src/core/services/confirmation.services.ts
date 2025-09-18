import { Confirmation, IPaginatableRequestPayload } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 3

// export const GetConfirmationList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Confirmation/GetAll/' + (is_export ? '?export=true' : ""), payload);
export const GetConfirmationList = async ( is_export: boolean = false) => await axiosService().get(`/Confirmation/GetAll?id=${configId}`);
export const Search = async ( search: string) => await axiosService().get(`/Confirmation/Search?search='+search+'&id=${configId}`);
export const Check = async ( search: string) => await axiosService().get(`/Confirmation/CheckIdExist?search='+search+'&id=${configId}`);
export const SaveConfirmation = async (payload: Confirmation) => await axiosService().post('/Confirmation/Save',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateConfirmation = async (payload: Confirmation) => await axiosService().post('/Confirmation/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteConfirmation = async (id: number) => await axiosService().delete('/Confirmation/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));




export const fetchConfirmation = async (): Promise<Confirmation[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/Confirmation/GetAll?id=${configId}`);
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