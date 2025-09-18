import { FormEvent, Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import useRedirectToAdminPage from "../auth/login/AuthRedirect";
import DatePicker from "react-flatpickr";
import { Dialog, Transition } from "@headlessui/react";
import { getConfig } from "../../../core/utility";
import { Icons } from "../../Assets";
import { RootState } from "../../../core/stores";
import { IAppState } from "../../../core/interfaces";


interface EditConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any
    loading: boolean
    done: () => void
}


const EditConfirmationModal: React.FC<EditConfirmationModalProps> = ({ isOpen, onClose, rowData, loading, done }) => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [selectedMinister, setSelectedMinister] = useState<string>("");

    const initialDate = '2024-05-06T10:00';
    const [selectedDate, setSelectedDate] = useState(new Date());

    const appState = useSelector<RootState, IAppState>((state) => state.app);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: appState?.config?.id,
        memberId: "",
        confirmationNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        godParent: "",
        revMinister: "",
        confirmationDate: "",
        placeOfConfirmation: "",
        ministerId: appState?.config?.ministerId,
        createdDate: "",
        createdBy: appState?.config?.createdBy,
        modifiedDate: "",
        modifiedBy: appState?.config?.modifiedBy,
        isActive: true,
        churchId: appState?.config?.churchId
    })

    useEffect(() => {
        if (isOpen && rowData) {
            setFormData({
                id: rowData.id || appState?.config?.id,
                memberId: rowData.memberId || "",
                confirmationNumber: rowData.confirmationNumber || "",
                firstName: rowData.firstName || "",
                middleName: rowData.middleName || "",
                lastName: rowData.lastName || "",
                godParent: rowData.godParent || "",
                revMinister: rowData.revMinister || "",
                confirmationDate: rowData.confirmationDate || "",
                placeOfConfirmation: rowData.placeOfConfirmation || "",
                ministerId: rowData.ministerId || appState?.config?.ministerId,
                createdDate: rowData.createdDate || "",
                createdBy: rowData.createdBy || appState?.config?.createdBy,
                modifiedDate: rowData.mdodifiedDate || "",
                modifiedBy: rowData.modifiedBy || appState?.config?.modifiedBy,
                isActive: rowData.isActive || true,
                churchId: appState?.config?.churchId
            })
        }
    }, [isOpen, rowData])

    let toast: IToastHandler;

    const { id } = useParams();

    const handleConfirmationDateChange = (date: Date) => {
        setSelectedDate(date)
    };


    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Basic validations
        if (formData.confirmationDate === "") {
            toast.Error("Error", "Please Select Confirmation Date");
            return;
        }

        if (formData.firstName === "") {
            toast.Error("Error", "Firstname cannot be empty");
            return;
        }
        if (formData.lastName === "") {
            toast.Error("Error", "Lastname cannot be empty");
            return;
        }
        if (formData.confirmationNumber === "") {
            toast.Error("Error", "NL Conf cannot be empty");
            return;
        }

        if (formData.revMinister === "") {
            toast.Error("Error", "Please Enter a Minister Name");
            return;
        }

        try {
            // Preparing data for submission
            const today = new Date();
            formData.ministerId = Number(selectedMinister);
            formData.confirmationDate = new Date(selectedDate).toISOString();
            formData.createdDate = today.toISOString();
            formData.modifiedDate = today.toISOString();

            setIsloading(true);

            const response = await fetch('https://catholicportal.net/api/Confirmation/Update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormData({
                    id: appState?.config?.id,
                    memberId: "",
                    confirmationNumber: "",
                    firstName: "",
                    middleName: "",
                    lastName: "",
                    godParent: "",
                    revMinister: "",
                    confirmationDate: "",
                    placeOfConfirmation: "",
                    ministerId: appState?.config?.ministerId,
                    createdDate: "",
                    createdBy: appState?.config?.createdBy,
                    modifiedDate: "",
                    modifiedBy: appState?.config?.modifiedBy,
                    isActive: true,
                    churchId: appState?.config?.churchId,
                });

                setSelectedMinister("");
                setIsloading(false);

                swal("Great! Confirmation data submitted successfully!", {
                    icon: "success",
                });

                toast.Info("Confirmation Form Submission", "Confirmation Data Submitted Successfully");

                setTimeout(() => {
                    window.location.reload();
                }, 3000); // 3 seconds delay
            } else {
                setIsloading(false);
                console.error('Error submitting form data:', response.status);
                toast.Error("Error", "Failed to create Confirmation. Please try again.");
            }
        } catch (error) {
            setIsloading(false);
            console.error('An unexpected error occurred:', error);
            toast.Error("Error", "An unexpected error occurred. Please try again.");
        }
    };
    if (!isOpen) return null;


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
                                                Edit Confirmation
                                            </Dialog.Title>
                                            <Icons.Close
                                                type="button"
                                                className="w-4 h-5 hover:cursor-pointer rounded-full font-bold text-2xl"
                                                onClick={onClose}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <form onSubmit={onFormSubmit}>
                                                <div className='flex flex-row gap-6 w-full items-center'>
                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmationNumber">
                                                            N.L.Conf
                                                        </label>
                                                        <input
                                                            {...register("confirmationNumber", { required: true })}
                                                            value={formData.confirmationNumber}
                                                            onChange={(e) => setFormData({ ...formData, confirmationNumber: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter N.L.Conf number"
                                                            id="confirmationNumber"
                                                            type="text"
                                                            name="confirmationNumber"
                                                        />
                                                        {errors.confirmationNumber && <span className="text-red-500 text-xs italic">Confirmation number is required.</span>}
                                                    </div>

                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmationDate">
                                                            Confirmation Date
                                                        </label>
                                                        <DatePicker
                                                            {...register("confirmationDate", { required: true })}
                                                            value={formData.confirmationDate}
                                                            onChange={handleConfirmationDateChange}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            id="confirmationDate"
                                                        />
                                                        <input type="hidden" name="id" value={formData.id}
                                                            onChange={(e) => setFormData({ ...formData, id: e.target.valueAsNumber })} />
                                                        {errors.confirmationDate && <span className="text-red-500 text-xs italic">Confirmation date is required.</span>}
                                                    </div>
                                                </div>


                                                <div className='flex flex-row gap-6 w-full items-center'>
                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                                            First Name
                                                        </label>
                                                        <input
                                                            {...register("firstName", { required: true })}
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter first name"
                                                            id="firstName"
                                                            type="text"
                                                            name="firstName"
                                                        />
                                                        {errors.firstName && <span className="text-red-500 text-xs italic">First name is required.</span>}
                                                    </div>

                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfConfirmation">
                                                            Place of confirmation
                                                        </label>
                                                        <input
                                                            {...register("placeOfConfirmation", { required: true })}
                                                            value={formData.placeOfConfirmation}
                                                            onChange={(e) => setFormData({ ...formData, placeOfConfirmation: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter place of confirmation"
                                                            id="placeOfConfirmation"
                                                            type="text"
                                                            name="placeOfConfirmation"
                                                        />
                                                        {errors.placeOfConfirmation && <span className="text-red-500 text-xs italic">Place of confirmation is required.</span>}
                                                    </div>
                                                </div>


                                                <div className='flex flex-row gap-6 w-full items-center'>
                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="middleName">
                                                            Middle name
                                                        </label>
                                                        <input
                                                            {...register("middleName", { required: true })}
                                                            value={formData.middleName}
                                                            onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter first name"
                                                            id="middleName"
                                                            type="text"
                                                            name="middleName"
                                                        />
                                                        {errors.middleName && <span className="text-red-500 text-xs italic">Middle name is required.</span>}
                                                    </div>

                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="godParent">
                                                            Name of Godparent
                                                        </label>
                                                        <input
                                                            {...register("godParent", { required: true })}
                                                            value={formData.godParent}
                                                            onChange={(e) => setFormData({ ...formData, godParent: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter name of Godparent"
                                                            id="godParent"
                                                            type="text"
                                                            name="godParent"
                                                        />
                                                        {errors.godParent && <span className="text-red-500 text-xs italic">Name of Godparent is required.</span>}
                                                    </div>
                                                </div>

                                                <div className='flex flex-row gap-6 w-full mb-4 items-center'>
                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                                            Last name
                                                        </label>
                                                        <input
                                                            {...register("lastName", { required: false })}
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter last name"
                                                            id="lastName"
                                                            type="text"
                                                            name="lastName"
                                                        />
                                                        {errors.lastName && <span className="text-red-500 text-xs italic">Last name is required.</span>}
                                                    </div>

                                                    <div className="mb-4 w-1/2">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revMinister">
                                                            Name of Rev Minister
                                                        </label>
                                                        <input
                                                            {...register("revMinister", { required: true })}
                                                            value={formData.revMinister}
                                                            onChange={(e) => setFormData({ ...formData, revMinister: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            placeholder="Enter name of Rev Minister"
                                                            id="revMinister"
                                                            type="text"
                                                            name="revMinister"
                                                        />
                                                        {errors.revMinister && <span className="text-red-500 text-xs italic">Name of Rev Minister is required.</span>}
                                                    </div>
                                                </div>

                                                <div className="mt-16 md:flex justify-end w-full">
                                                    <div className="md:w-1/4">
                                                        <MtnButton className="form-wizard-submit" type={"submit"} label={"Submit Request"} />
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
            <Toast position="top-right" onInit={(e) => (toast = e)} />
        </>
    )
}

export default EditConfirmationModal