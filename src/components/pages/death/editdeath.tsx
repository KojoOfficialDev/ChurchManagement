import { useQuery } from "@tanstack/react-query";
import { exportCsv } from "json2csv-export";
import moment from "moment";
import {FormEvent, useEffect, useState } from "react";
import DataGrid from 'react-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IPaginatableQuery, IUserState } from "../../../core/interfaces";
import { SaveDeath, UpdateDeath } from "../../../core/services/death.services";
import { RootState } from "../../../core/stores";
import { setAppLoading } from "../../../core/stores/slices/app_slice";
import { Icons } from "../../Assets";
import { DataPagination, IDataHandler } from "../../layout/DataPagination";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import {formToJSON} from "axios";

import { CustomDatePicker } from "../_components/date_range_picker";


export const DeathEdit = () => {
    const fileTypes: string[] = ["JPEG", "PNG"];

  const [portrait, setPortrait] = useState({
    preview: "",
    file: "",
  });
  

  const [isLoading, setIsloading] = useState<boolean>(false);

  const dispatch = useDispatch();
  let toast: IToastHandler;

  const handleImageUpload = (file: File | Blob) => {
    alert("ah")
    setPortrait({
      preview: URL.createObjectURL(file),
      file: "",
    });
    // const data = new FormData();
    // data.append('file', file);
    // UploadFile(data).then((response) => {
    // 	setIsloading(false);
    // 	if (response.data.success) {
    // 		setFile({
    // 			preview: URL.createObjectURL(file),
    // 			data: response?.data?.data,
    // 		});
    // 		if (selectedBanner?.mainSliderId?.length > 0) {
    // 			setExistingImageRemoved(false);
    // 			dispatch(setSelectedBanner({...selectedBanner, imageName: response?.data?.data?.newFileName}));
    // 		}
    // 	} else {
    // 		showErrorMessage(response.data.message, 'error');
    // 		setFile(null);
    // 	}
    // });
  };

  const handleDeleteImage = () => {
    // DeleteBannerImage({fileName: selectedBanner?.imageName})
    // 	.then((res) => {
    // 		dispatch(setAppLoading(false));
    // 		if (res.data.success) {
    // 			showSuccessMessage(res.data.message, 'success');
    // 			setExistingImageRemoved(true);
    // 		} else {
    // 			showErrorMessage(res.data.message, 'error');
    // 		}
    // 	})
    // 	.catch((err) => {
    // 		console.log('error =', err);
    // 		showErrorMessage('An error occured', 'error');
    // 		dispatch(setAppLoading(false));
    // 	});
  };

  const handleRemoveImage = () => {
    if (window.confirm("Do you really want to remove image?")) {
      // if (selectedBanner?.mainSliderId?.length > 0) {
      // 	handleDeleteBannerImage();
      // }
      // setFile(null);
    }
  };

  // {view: URL.createObjectURL(e.target.files[0]), file: e.target.files[0]}

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = formToJSON(e.target as HTMLFormElement);
    // emailjs
    //   .sendForm("service_f37w0mz", "template_sh63paa", e.target as HTMLFormElement, "YtiMt9YWCgvNSzsIw")
    //   .then((res: any) => {
    //     if (res?.status === 200) {
    //       toast.Success("eSim Request sent successfully", <></>);
    //     }
    //   })
    //   .catch((err) => console.log("error from sending mail ->>", err));
    // console.log({formData});
  };

  return (
    <>
      <form onSubmit={onFormSubmit} className="mb-7">
        <p className="font-medium text-2xl pb-1">Deceased Form</p>
        <p className=" pb-6 font-light text-sm text-gray-500 md:max-w-lg">Kindly complete the form below to complete your request.</p>

        <div className="!bg-white w-full mt-4 p-5 rounded shadow">
          <p className="font-medium text-md">Data Capture</p>

          <div className="space-y-6 md:space-y-0 md:grid grid-cols-4 gap-6 mt-5">
            <div>
              <p className="text-xs text-[#a0a0a0]">
                Deceased Date <span className="text-red-500">*</span>
              </p>
              <input placeholder="Input Date of the deceased" name="customerName" type="text" className="mt-2 outline-none w-full border-none bg-[#f3f3f3] rounded-[2px] px-[17px] py-[6px] text-xs font-light" />
            </div>
           
           
            <div>
              <p className="text-xs text-[#a0a0a0]">
                Select Member <span className="text-red-500">*</span>
              </p>
              <select name="simPlan" className="mt-2 outline-none w-full border-none bg-[#f3f3f3] rounded-[2px] px-[17px] py-[6px] text-xs font-light">
                <option value={""}>-- Select</option>
                <option value={"postpaid"}>Bernice</option>
                <option value={"prepaid"}>Anthony</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-[#a0a0a0]">
                Active <span className="text-red-500">*</span>
              </p>
              <input name="deviceBrand" placeholder="Active or dead" type="text" className="mt-2 outline-none w-full border-none bg-[#f3f3f3] rounded-[2px] px-[17px] py-[6px] text-xs font-light" />
              <input type="hidden" name="msisdn" value={"0546283734_msisdn_example"} />
            </div>
            <div className="">
              {/* <ImageUploader name="portrait" preview={portrait.file} handleChange={handleImageUpload} fileTypes={fileTypes} label={"Upload a portrait picture"} required={true} /> */}
            </div> 
          </div>
          <div className="mt-16 md:flex justify-end w-full">
            <div className="md:w-1/4">
              <MtnButton className="form-wizard-submit" type={"submit"} label={"Submit Request"} />
            </div>
          </div>
        </div>
      </form>
      <Toast position="bottom-right" onInit={(e) => (toast = e)} />
    </>
  );

};