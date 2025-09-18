import { Marriage } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 1

// export const GetMarriageList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Marriage/GetAll/' + (is_export ? '?export=true' : ""), payload);
export const GetMarriageList = async ( is_export: boolean = false) => await axiosService().get(`/Marriage/GetAll?id=${configId}`);
export const Search = async ( search: string) => await axiosService().get(`/Marriage/Search?search=${search}&id=${configId}`);
export const Check = async ( search: string) => await axiosService().get(`/Marriage/CheckIdExist?search=${search}&id=${configId}`);
export const SaveMarriage = async (payload: Marriage) => await axiosService().post('/Marriage/Save',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateMarriage = async (payload: Marriage) => await axiosService().post('/Marriage/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteMarriage = async (id: number) => await axiosService().delete('/Marriage/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));


export const fetchMarriages = async (): Promise<Marriage[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/Marriage/GetAll?id=${configId}`);
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