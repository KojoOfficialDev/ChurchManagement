import { Baptism, IPaginatableRequestPayload } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 3

// export const GetBaptismList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Baptism/GetAll/' + (is_export ? '?export=true' : ""), payload);

export const GetBaptismList = async ( is_export: boolean = false) => await axiosService().get(`/Baptism/GetAll?id=${configId}`);
export const Search = async ( search: string ) => await axiosService().get(`/Baptism/Search?search='+search+'&id=${configId}`);
export const Check = async ( search: string ) => await axiosService().get(`/Baptism/CheckIdExist?search='+search+'&id=${configId}`);
export const SaveBaptism = async ( payload: Baptism ) => await axiosService().post('/Baptism/Save',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateBaptism = async ( payload: Baptism ) => await axiosService().post('/Baptism/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteBaptism = async ( id: number ) => await axiosService().delete('/Baptism/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));



export const fetchBaptism = async (): Promise<Baptism[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/Baptism/GetAll?id=${configId}`);
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
