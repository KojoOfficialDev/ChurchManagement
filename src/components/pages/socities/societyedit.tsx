import {FormEvent, Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";


export const SocietyEdit = () => {
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [Society, setSociety] = useState({
    id: 0,
    name: "",
    active: true ,
    churchId: 1});

 

  const dispatch = useDispatch();
  let toast: IToastHandler;

  const { id } = useParams();

  useEffect(() => {
    fetchSociety(id);
  }, [id, Society.id]);

 
  const fetchSociety = async (id : any) => {
    setIsloading(true);
    try {
      const response = await fetch(
        `https://catholicportal.net/api/Societies/Get?id=${id}`
      );
      if (response.ok) {
        const societyData = await response.json();
        // Update form data with fetched product details
        setSociety(societyData);
        
        setIsloading(false);
      } else {
        console.error("Failed to fetch Society details:", response.statusText);
        toast.Error("Error","Failed to fetch Society details");
        setIsloading(false);
      }
    } catch (error) {
      console.error("Error fetching Society:", error);
      toast.Error("Error","Error fetching Society");
    }
  };

 
 
 
  
 

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Society.name == "") {
      toast.Error("Error","Please Enter Society Name");
      return;
    }
 
    setIsloading(true);
    const today = new Date();
     
    const response = await fetch('https://catholicportal.net/api/Societies/Update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Society),
    });

    if (response.ok) {
      setSociety({
        id: 0,
        name: "",
        active: true,
        churchId: 1  });
 
        setIsloading(false);
    } else {
      console.error('Error submitting form data:', response.status);
      toast.Error("Error","Failed to create Society. Please try again.")
      // Handle error
    }
    toast.Info("Society Form Submission", "Society Data Submitted Successfully");
    navigate("/Society/societylist");
  };

  return (
    <>
       {isLoading ? (
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>

      ) : (
        <form onSubmit={onFormSubmit} className="mb-7">
        <p className="font-medium text-2xl pb-1">Society Setup</p>
        <p className=" pb-6 font-light text-sm text-gray-500 md:max-w-lg">Kindly complete the form below to complete your request.</p>

        <div className="!bg-white w-full mt-4 p-5 rounded shadow">
          <p className="font-medium text-md">Data Capture</p>

          <div className="space-y-6 md:space-y-0 md:grid grid-cols-4 gap-6 mt-5">
          <div>
              <p className="text-xs text-[#a0a0a0]">Name</p>
              <input  placeholder="Enter Society Name" value={Society.name}
              onChange={(e) => setSociety({ ...Society, name: e.target.value })} name="society" type="text" className="mt-2 outline-none w-full border-none bg-[#f3f3f3] rounded-[2px] px-[17px] py-[6px] text-xs font-light" />
          <input type="hidden" name="id" value={Society.id}
              onChange={(e) => setSociety({ ...Society, id: e.target.valueAsNumber })} />
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