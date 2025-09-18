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


interface AddSocietyModalProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
    done: () => void
}

let toast: IToastHandler;

const AddSocietyModal: React.FC<AddSocietyModalProps> = ({ isOpen, onClose, loading, done }) => {

    const appState = useSelector<RootState, IAppState>((state) => state.app);
    const { register, formState: { errors } } = useForm()
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [society, setSociety] = useState({
        id: 0,
        name: "",
        Active: true,
        churchId:  appState?.config?.churchId
    });

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (society.name == "") {
            toast.Error("Error", "Please enter country name");
            return;
        }

        setIsloading(true);

        try {
            const response = await fetch('https://catholicportal.net/api/Societies/Save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(society),
            });

            if (response.ok) {
                setSociety({
                    id: 0,
                    name: "",
                    Active: true,
                    churchId:  appState?.config?.churchId
                });

                // toast.Info("Country Form Submission", "Country Data Submitted Successfully");
                swal("Great! Society has been added!", {
                    icon: "success",
                })
                // Set a timeout for 3 seconds before refreshing the page
                setTimeout(() => {
                    window.location.reload();
                }, 3000); // 3000 milliseconds = 3 seconds
            } else {
                console.error('Error submitting form data:', response.status);
                // toast.Error("Error", "Failed to create country. Please try again.");
                swal("Oops! Failed to add country. Please try again", {
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
                                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  w-[80%] sm:p-10">
                                        <div className="flex justify-between items-start mb-4 border-b-2 border-red-50">
                                            <Dialog.Title as="h3" className="text-lg leading-6 font-bold text-gray-900 uppercase">
                                                Add Society
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


                                                <div className="!bg-white w-full mt-4 p-5 rounded shadow">
                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="countryName">
                                                            Society
                                                        </label>
                                                        <input placeholder="Enter Country Name" value={society.name}
                                                            onChange={(e) => setSociety({ ...society, name: e.target.value })} name="country" type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                                                    </div>
                                                </div>

                                                <div className="mt-10 md:flex justify-end w-full">
                                                    <div className="md:w-1/4">
                                                        <MtnButton className="form-wizard-submit" type={"submit"} label={"Submit"} />
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

export default AddSocietyModal