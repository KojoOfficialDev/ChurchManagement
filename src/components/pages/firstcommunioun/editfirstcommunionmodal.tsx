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
import { IAppState } from "../../../core/interfaces";
import { RootState } from "../../../core/stores";


interface EditFirstCommunionModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any;
    loading: boolean
    done: () => void
}


const EditFirstCommunionModal: React.FC<EditFirstCommunionModalProps> = ({ isOpen, onClose, rowData, loading, done }) => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isLoading, setIsloading] = useState<boolean>(false);

    const initialDate = '2024-05-06T10:00';
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleFirstCommunionDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    
    const appState = useSelector<RootState, IAppState>((state) => state.app);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: appState?.config?.id,
        memberId: "",
        firstCommunionNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        revMinister: "",
        firstCommunionDate: "",
        placeOfFirstCommunion: "",
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
                firstCommunionNumber: rowData.firstCommunionNumber || "",
                firstName: rowData.firstName || "",
                middleName: rowData.middleName || "",
                lastName: rowData.lastName || "",
                revMinister: rowData.revMinister || "",
                firstCommunionDate: rowData.firstCommunionDate || "",
                placeOfFirstCommunion: rowData.placeOfFirstCommunion || "",
                ministerId: rowData.ministerId || appState?.config?.ministerId,
                createdDate: rowData.createdDate || "",
                createdBy: rowData.createdBy || appState?.config?.createdBy,
                modifiedDate: rowData.modifiedDate || "",
                modifiedBy: rowData.modifiedBy || appState?.config?.modifiedBy,
                isActive: rowData.isActive || true,
                churchId: appState?.config?.churchId
            })
        }
    }, [isOpen, rowData])



    const dispatch = useDispatch();
    let toast: IToastHandler;

    const { id } = useParams();



    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.firstCommunionDate == "") {
            toast.Error("Error", "Please Select FirstCommunion Date");
            return;
        }

        if(formData.firstName == ""){
            toast.Error("Error", "firstname cannot be empty");
            return;
        }
        if(formData.lastName == ""){
            toast.Error("Error", "lastname cannot be empty");
            return;
        }
        if(formData.firstCommunionNumber == ""){
            toast.Error("Error", "NLC cannot be empty");
            return;
        }

        if (formData.revMinister == "") {
            toast.Error("Error", "Please enter a Minister");
            return;
        }

        const today = new Date();
        formData.firstCommunionDate = new Date(selectedDate).toISOString();
        formData.createdDate = today.toISOString();
        formData.modifiedDate = today.toISOString();

        setIsloading(true)
        const response = await fetch('https://catholicportal.net/api/FirstCommunion/Update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setIsloading(false)
            toast.Info("FirstCommunion Form Submission", "FirstCommunion Data Updated Successfully");
            window.location.reload();
        } else {
            setIsloading(false)
            console.error('Error submitting form data:', response.status);
            toast.Error("Error", "Failed to Update FirstCommunion. Please try again.")
            // Handle error
        }

    };


    return (
        <>
            {isLoading ? (
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
            ) : (
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
                                            Edit First Communion Info
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
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstCommunionNumber">
                                                        N.L.C Number
                                                    </label>
                                                    <input
                                                        {...register("firstCommunionNumber", { required: true })}
                                                        value={formData.firstCommunionNumber}
                                                        onChange={(e) => setFormData({ ...formData, firstCommunionNumber: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter N.L.C number"
                                                        id="firstCommunionNumber"
                                                        type="text"
                                                        name="firstCommunionNumber"
                                                    />
                                                    {errors.baptismNumber && <span className="text-red-500 text-xs italic">Baptism number is required.</span>}
                                                </div>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstCommunionDate">
                                                        First Communion Date
                                                    </label>
                                                    <DatePicker
                                                        {...register("firstCommunionDate", { required: true })}
                                                        value={formData.firstCommunionDate}
                                                        onChange={handleFirstCommunionDateChange}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="firstCommunionDate"
                                                    />
                                                    <input type="hidden"
                                                        name="id"
                                                        value={formData.id}
                                                        onChange={(e) => setFormData({ ...formData, id: e.target.valueAsNumber })}
                                                    />
                                                    {errors.firstCommunionDate && <span className="text-red-500 text-xs italic">First Communion date is required.</span>}
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
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfFirstCommunion">
                                                        Place of first communion
                                                    </label>
                                                    <input
                                                        {...register("placeOfFirstCommunion", { required: true })}
                                                        value={formData.placeOfFirstCommunion}
                                                        onChange={(e) => setFormData({ ...formData, placeOfFirstCommunion: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter place of first communion"
                                                        id="placeOfFirstCommunion"
                                                        type="text"
                                                        name="placeOfFirstCommunion"
                                                    />
                                                    {errors.baptismDate && <span className="text-red-500 text-xs italic">Place of first communion is required.</span>}
                                                </div>
                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>
                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="middleName">
                                                        Middle name
                                                    </label>
                                                    <input
                                                        {...register("middleName", { required: false })}
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

                                            <div className='flex flex-row gap-6 w-full mb-4 items-center'>
                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                                        Last name
                                                    </label>
                                                    <input
                                                        {...register("lastName", { required: true })}
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

                                                <div className="w-1/2"></div>
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

export default EditFirstCommunionModal