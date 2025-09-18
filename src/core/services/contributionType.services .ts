import { ContributionType } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 2

// export const GetMarriageList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Marriage/GetAll/' + (is_export ? '?export=true' : ""), payload);
export const GetContributionTypeList = async ( is_export: boolean = false) => await axiosService().get(`/ContributionTypes/GetAll?id=${configId}`);

// export const GetContributionType = async () => await axiosService().get(`/ContributionType/GetAll?id=${configId}`);

export const Search = async ( search: string) => await axiosService().get(`/ContributionTypes/Search?search='+search+'&id=${configId}`);
export const Check = async ( search: string) => await axiosService().get(`/ContributionTypes/CheckIdExist?search='+search+'&id=${configId}`);
export const SaveContributionTypeType = async (payload: ContributionType) => await axiosService().post('/ContributionTypes/Save',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateContributionType = async (payload: ContributionType) => await axiosService().post('/ContributionTypes/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteContributionType = async (id: number) => await axiosService().delete('/ContributionTypes/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));


export const fetchContributionTypes = async (): Promise<ContributionType[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/ContributionTypes/GetAll?id=${configId}`);
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



  export const fetchContributionType = async (): Promise<ContributionType[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/ContributionType/GetAll?id=${configId}`);
      console.log(response.data)
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