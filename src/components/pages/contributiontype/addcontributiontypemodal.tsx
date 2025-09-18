import { FormEvent, Fragment, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import { Dialog, Transition } from "@headlessui/react";
import { Icons } from "../../Assets";
import { IAppState } from "../../../core/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/stores";
import Checkbox from "@mui/material/Checkbox";


interface AddContributionTypeModalProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
    done: () => void
}

let toast: IToastHandler;

const addContributionTypeModal: React.FC<AddContributionTypeModalProps> = ({ isOpen, onClose, loading, done }) => {

    const appState = useSelector<RootState, IAppState>((state) => state.app);
    const { register, formState: { errors } } = useForm()
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [ContributionType, setContributionType] = useState({
        id: 0,
        name: "",
        active: true,
        paymentType:"",
        initialAmount:0.0,
        iscampaign: false,
        startDate:"",
        endDate:"",
        fundRaisingGoal:"",
        churchId:  appState?.config?.churchId,
        church: null
    });

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (ContributionType.name == "") {
            toast.Error("Error", "Please enter ContributionType name");
            return;
        }

        setIsloading(true);

        try {
            const response = await fetch('https://catholicportal.net/api/ContributionTypes/Save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ContributionType),
            });

            if (response.ok) {
                setContributionType({
                    id: 0,
                    name: "",
                    active: true,
                    paymentType:"",
                    initialAmount:0.0,
                    iscampaign: false,
                    startDate:"",
                    endDate:"",
                    fundRaisingGoal:"",
                    churchId:  appState?.config?.churchId,
                    church:null
                });

                // toast.Info("ContributionType Form Submission", "ContributionType Data Submitted Successfully");
                swal("Great! ContributionType Type has been added!", {
                    icon: "success",
                })
                // Set a timeout for 3 seconds before refreshing the page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // 3000 milliseconds = 3 seconds
            } else {
                console.error('Error submitting form data:', response.status);
                // toast.Error("Error", "Failed to create ContributionType. Please try again.");
                swal("Oops! Failed to add ContributionTypes Type. Please try again", {
                    icon: "error",
                })
            }
        } catch (error) {
            console.error('Error during form submission:', error);
            toast.Error("Error", "An unexpected error occurred. Please try again.");
        } finally {
            setIsloading(false);
        }
    };

    return (
        <>
            {isLoading ?
                (
                    <Transition show={loading} as={Fragment}>
                        <Dialog onClose={done} className="fixed z-10 inset-0 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-black opacity-30" />
                                </Transition.Child>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[80%] sm:p-10 items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                )
                :
                (
                    <Transition show={isOpen} as={Fragment} >
                        <Dialog onClose={onClose} className={`fixed z-10 inset-0 overflow-y-auto`} >
                            <div className="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-black opacity-30" />
                                </Transition.Child>

                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  w-[30%] sm:p-10">
                                        <div className="flex justify-between items-start mb-4 border-b-2 border-red-50">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-bold text-gray-900 uppercase">
                                                Add ContributionType
                                            </Dialog.Title>
                                            <Icons.Close
                                                type="button"
                                                className="w-4 h-5 hover:cursor-pointer rounded-full font-bold text-2xl"
                                                onClick={onClose}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <form onSubmit={onFormSubmit}>
                                                <div className="mb-4 w-full"></div>


                                                <div  className='flex flex-row gap-6 w-full items-center'>
                                                    <div className="mb-4 w-full">
                                                        
                                                        <input placeholder="Enter ContributionType Name" value={ContributionType.name}
                                                            onChange={(e) => setContributionType({ ...ContributionType, name: e.target.value })} name="ContributionType" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                                    </div>
                                                    <div className="mb-4 w-1/7">
                                                    <Checkbox label='Active'  onChange={(e) => setContributionType({ ...ContributionType, active: e.target.checked })} name="ContributionType"  />
                                                    </div>
                                                </div>
                                               
                                                <div className="mt-10 md:flex justify-end w-full">
                                                    <div className="md:w-1/4">
                                                        <MtnButton className="form-wizard-submit bg-[#318fe8] hover:bg-[#0054a0] text-white" type={"submit"} label={"Submit"} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition>
                )}
        </>
    )
}

export default addContributionTypeModal