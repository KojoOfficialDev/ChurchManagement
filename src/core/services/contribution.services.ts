import { Contribution, ContributionType } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 2

// export const GetMarriageList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Marriage/GetAll/' + (is_export ? '?export=true' : ""), payload);
export const GetContributionList = async ( is_export: boolean = false) => await axiosService().get(`/Contributions/GetAll?id=${configId}`);

// export const GetContributionTypes = async () => await axiosService().get(`/ContributionTypes/GetAll?id=${configId}`);

export const Search = async ( search: string) => await axiosService().get(`/Contributions/Search?search='+search+'&id=${configId}`);
export const Check = async ( search: string) => await axiosService().get(`/Contributions/CheckIdExist?search='+search+'&id=${configId}`);
export const SaveContribution = async (payload: Contribution) => await axiosService().post('/Contributions/Save',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateContribution = async (payload: Contribution) => await axiosService().post('/Contributions/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteContribution = async (id: number) => await axiosService().delete('/Contributions/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));


export const fetchContribution = async (): Promise<Contribution[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/Contributions/GetAll?id=${configId}`);
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



  export const fetchContributionTypes = async (): Promise<ContributionType[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/ContributionTypes/GetAll?id=${configId}`);
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