import { Expenses, Member } from "../interfaces";
import { getAxios, getConfig } from "../utility";
const axiosService = () => getAxios("https://catholicportal.net/api/");
import axios from 'axios';

const configId = 1

// export const GetMemberList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Member/GetAll/' + (is_export ? '?export=true' : ""), payload);
// export const GetMinistersList = async (payload: IPaginatableRequestPayload, is_export: boolean = false) => await axios().post('/Member/GetAllMinisters/' + (is_export ? '?export=true' : ""), payload);

//export const SearchSocietyList = async ( search: string) => await axios().get('/Societies/Search?search='+search);
export const GetMemberList = async ( is_export: boolean = false, ) => await axiosService().get(`/Member/GetAll?id=${configId}`);
export const GetMemberBirthdayList = async ( is_export: boolean = false, ) => await axiosService().get(`/Member/GetMonthlyBirthdays?id=${configId}`);
export const GetNationalityList = async ( is_export: boolean = false) => await axiosService().get(`/Nationalities/GetAll?id=${configId}`);
export const GetSocietiesList = async ( is_export: boolean = false) => await axiosService().get(`/Societies/GetAll?id=${configId}`);
export const GetExpensesCategoryList = async ( is_export: boolean = false) => await axiosService().get(`/ExpensesCategory/GetAll?id=${configId}`);
export const GetExpensesList = async ( is_export: boolean = false) => await axiosService().get(`/Expenses/GetAll?id=${configId}`);
export const SearchMemberList = async ( search: string) => await axiosService().get(`/Member/Search?search=${search}&id=${configId}`);
export const GetMinistersList = async ( is_export: boolean = false) => await axiosService().get('/Member/GetAllMinisters');
export const SaveMember = async (payload: Member) => await axiosService().post('/Member/Save',payload).then(res=> { console.log(res.data);})
.catch(err=> console.log(err));

export const UpdateMember = async (payload: Member) => await axiosService().post('/Member/Update',payload).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteMember = async (id: number) => await axiosService().delete('/Member/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteCountry = async (id: number) => await axiosService().delete('/Nationalities/' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

//export const SearchCountryList = async ( search: string) => await axiosService().get('/Nationalities/Search?search='+search);

export const DeleteSociety = async (id: number) => await axiosService().delete('/Societies/' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));

export const DeleteExpenses = async (id: number) => await axiosService().delete('/Expenses/Delete?id=' + (id)).then(res=> {console.log(res.data);})
.catch(err=> console.log(err));
//export const SearchSocietyList = async ( search: string) => await axiosService().get('/Societies/Search?search='+search);



export const fetchMembers = async (): Promise<Member[]> => {
    const apiBaseURL = "https://catholicportal.net/api";
    try {
      const response = await axios.get(`${apiBaseURL}/Member/GetAll?id=${configId}`)
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

export const fetchExpenses = async (): Promise<Expenses[]> => {
  const apiBaseURL = "https://catholicportal.net/api";
  try {
    const response = await axios.get(`${apiBaseURL}/Expenses/GetAll?id=${configId}`)
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
