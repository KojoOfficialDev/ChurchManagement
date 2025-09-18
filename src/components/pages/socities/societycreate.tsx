import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import useRedirectToAdminPage from "../auth/login/AuthRedirect"
import { getConfig } from "../../../core/utility";


export const SocietyCreate = () => {
  useRedirectToAdminPage("society/societycreate");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [Society, setSociety] = useState({
    id: 0,
    name: "",
    active: true,
    churchId: 1
  });




  let toast: IToastHandler;

  useEffect(() => {


  });



  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    if (Society.name == "") {
      toast.Error("Error", "Please Enter a Name");
      return;
    }



    setIsloading(true);
    const today = new Date();

    const response = await fetch('https://catholicportal.net/api/Societies/Save', {
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
        churchId:1
      });

      setIsloading(false);
    } else {
      console.error('Error submitting form data:', response.status);
      toast.Error("Error", "Failed to create Society. Please try again.")
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
                <input placeholder="Enter Society Name" value={Society.name}
                  onChange={(e) => setSociety({ ...Society, name: e.target.value })} name="society" type="text" className="mt-2 outline-none w-full border-none bg-[#f3f3f3] rounded-[2px] px-[17px] py-[6px] text-xs font-light" />
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