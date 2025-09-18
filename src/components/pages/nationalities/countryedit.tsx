import {FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import useRedirectToAdminPage from "../auth/login/AuthRedirect"
import { getConfig } from "../../../core/utility";


export const CountryEdit = () => {
 
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [Country, setCountry] = useState({
    id: 0,
    name: "",
    Active: true,
    churchId:1 });

 

  const dispatch = useDispatch();
  let toast: IToastHandler;

  const { id } = useParams();

  useEffect(() => {
    fetchCountry(id);
  }, [id, Country.id]);

 
  const fetchCountry = async (id : any) => {
    setIsloading(true);
    try {
      const response = await fetch(
        `https://catholicportal.net/api/Nationalities/Get?id=${id}`
      );
      if (response.ok) {
        const CountryData = await response.json();
        // Update form data with fetched product details
        setCountry(CountryData);
        
        setIsloading(false);
      } else {
        console.error("Failed to fetch Country details:", response.statusText);
        toast.Error("Error","Failed to fetch Country details");
        setIsloading(false);
      }
    } catch (error) {
      console.error("Error fetching Country:", error);
      toast.Error("Error","Error fetching Country");
    }
  };

 
 
 
  
 

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Country.name == "") {
      toast.Error("Error","Please Enter Country Name");
      return;
    }
 
    setIsloading(true);
    const today = new Date();
     
    const response = await fetch('https://catholicportal.net/api/Nationalities/Update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Country),
    });

    if (response.ok) {
      setCountry({
        id: 0,
        name: "",
        Active: true,
        churchId: 1 });
 
        setIsloading(false);
    } else {
      console.error('Error submitting form data:', response.status);
      toast.Error("Error","Failed to create Country. Please try again.")
      // Handle error
    }
    toast.Info("Country Form Submission", "Country Data Submitted Successfully");
    navigate("/Country/Countrylist");
  };

  return (
    <>
       {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>

      ) : (
        <form onSubmit={onFormSubmit} className="mb-7">
        <p className="font-medium text-2xl pb-1">Country Setup</p>
        <p className=" pb-6 font-light text-sm text-gray-500 md:max-w-lg">Kindly complete the form below to complete your request.</p>

        <div className="!bg-white w-full mt-4 p-5 rounded shadow">
          <p className="font-medium text-md">Data Capture</p>

          <div className="space-y-6 md:space-y-0 md:grid grid-cols-4 gap-6 mt-5">
          <div>
              <p className="text-xs text-[#a0a0a0]">Name</p>
              <input  placeholder="Enter Country Name" value={Country.name}
              onChange={(e) => setCountry({ ...Country, name: e.target.value })} name="Country" type="text" className="mt-2 outline-none w-full border-none bg-[#f3f3f3] rounded-[2px] px-[17px] py-[6px] text-xs font-light" />
          <input type="hidden" name="id" value={Country.id}
              onChange={(e) => setCountry({ ...Country, id: e.target.valueAsNumber })} />
            </div>

            

          </div>
          <div className="mt-16 md:flex justify-end w-full">
            <div className="md:w-1/4">
              <MtnButton className="form-wizard-submit" type={"submit"} label={"Submit Request"} />
            </div>
          </div>
        </div>
      </form> 
       )}
      <Toast position="top-right" onInit={(e) => (toast = e)} />
    </>
  );

};