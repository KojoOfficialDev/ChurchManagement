import { FormEvent, Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import useRedirectToAdminPage from "../auth/login/AuthRedirect";
import DatePicker from "react-flatpickr";
import { Dialog, Transition } from "@headlessui/react";
import { getConfig } from "../../../core/utility";
import { Check } from "../../../core/services/baptism.services";
import { Icons } from "../../Assets";
import { RootState } from "../../../core/stores";
import { IAppState } from "../../../core/interfaces";

interface AddBaptismModalProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
    done: () => void
}

const AddBaptismModal: React.FC<AddBaptismModalProps> = ({ isOpen, onClose, loading, done }) => {
    //useRedirectToAdminPage("baptism/baptismlist");
    const appState = useSelector<RootState, IAppState>((state) => state.app);

    const [isLoading, setIsloading] = useState<boolean>(false);
    const [selectedMinister, setSelectedMinister] = useState<string>("");
    const { register, formState: { errors } } = useForm()
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedBirthDate, setSelectedBirthDate] = useState(new Date());

    const navigate = useNavigate();
    const [baptism, setBaptism] = useState({
        id: appState?.config?.id,
        memberId: "",
        baptismNumber: "",
        baptismDate: "",
        firstName: "",
        middleName: "",
        lastName: "",
        placeOfBirth: "",
        dateOfBirth: "",
        nlb: "",
        parentsName: "",
        homeDistrict: "",
        godParent: "",
        fathersName: "",
        mothersName: "",
        revMinister: "",
        placeOfBaptism: "",
        ministerId: appState?.config?.ministerId,
        createdDate: "",
        createdBy: appState?.config?.createdBy,
        modifiedDate: "",
        modifiedBy: appState?.config?.modifiedBy,
        isActive: true,
        churchId: appState?.config?.churchId
    });



    let toast: IToastHandler

    const handleBirthDateChange = (date: Date) => {
        setSelectedBirthDate(date);
    };


    const handleBaptismDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        baptism.baptismDate = new Date(selectedDate).toISOString();
        baptism.dateOfBirth = new Date(selectedBirthDate).toISOString();


        if (baptism.firstName == "") {
            toast.Error("Error", "firstname cannot be empty");
            return;
        }
        if (baptism.lastName == "") {
            toast.Error("Error", "lastname cannot be empty");
            return;
        }
        if (baptism.baptismNumber == "") {
            toast.Error("Error", "NLB cannot be empty");
            return;
        }

        if (baptism.revMinister == "") {
            toast.Error("Error", "Please Enter a Minister");
            return;
        }

        const responseData = await Check(baptism.baptismNumber)
        if (responseData) {
            toast.Error("Error", "Sorry N.L.B  already Exist");
            return;
        };

        setIsloading(true);
        const today = new Date();
        baptism.ministerId = Number(selectedMinister);
        baptism.baptismDate = selectedDate.toISOString();
        baptism.dateOfBirth = new Date(selectedBirthDate).toISOString();
        baptism.createdDate = today.toISOString();
        baptism.modifiedDate = today.toISOString();

        const response = await fetch('https://catholicportal.net/api/Baptism/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(baptism),
        });

        if (response.ok) {
            setBaptism({
                id: appState?.config?.id,
                memberId: "",
                baptismNumber: "",
                firstName: "",
                middleName: "",
                lastName: "",
                placeOfBirth: "",
                dateOfBirth: "",
                nlb: "",
                parentsName: "",
                fathersName: "",
                mothersName: "",
                homeDistrict: "",
                godParent: "",
                churchId: appState?.config?.churchId,
                revMinister: "",
                baptismDate: "",
                placeOfBaptism: "",
                ministerId: appState?.config?.ministerId,
                createdDate: "",
                createdBy: appState?.config?.createdBy,
                modifiedDate: "",
                modifiedBy: appState?.config?.modifiedBy,
                isActive: true
            });
            setSelectedMinister("");
            setIsloading(false);
            toast.Info("Baptism Form Submission", "baptism Data Submitted Successfully");
            window.location.reload()
        } else {
            setIsloading(false)
            console.error('Error submitting form data:', response.status);
            toast.Error("Error", "Failed to create baptism. Please try again.")
            window.location.reload();
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
                                            Add Baptism
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
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baptismNumber">
                                                        N.L.B Number
                                                    </label>
                                                    <input
                                                        {...register("baptismNumber", { required: true })}
                                                        value={baptism.baptismNumber}
                                                        onChange={(e) => setBaptism({ ...baptism, baptismNumber: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter N.L.B number"
                                                        id="baptismNumber"
                                                        type="text"
                                                        name="baptismNumber"
                                                    />
                                                    {errors.baptismNumber && <span className="text-red-500 text-xs italic">Baptism number is required.</span>}
                                                </div>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baptismDate">
                                                        Baptism date
                                                    </label>
                                                    <DatePicker
                                                        {...register("baptismDate", { required: true })}
                                                        value={baptism.baptismDate}
                                                        onChange={handleBaptismDateChange}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="baptismDate"
                                                    />
                                                    <input type="hidden"
                                                        name="id"
                                                        value={baptism.id}
                                                        onChange={(e) => setBaptism({ ...baptism, id: e.target.valueAsNumber })}
                                                    />
                                                    {errors.baptismDate && <span className="text-red-500 text-xs italic">Baptism date is required.</span>}
                                                </div>
                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>
                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                                        First Name
                                                    </label>
                                                    <input
                                                        {...register("firstName", { required: true })}
                                                        value={baptism.firstName}
                                                        onChange={(e) => setBaptism({ ...baptism, firstName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter first name"
                                                        id="firstName"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.firstName && <span className="text-red-500 text-xs italic">First name is required.</span>}
                                                </div>


                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfBaptism">
                                                        Place of baptism
                                                    </label>
                                                    <input
                                                        {...register("placeOfBaptism", { required: true })}
                                                        value={baptism.placeOfBaptism}
                                                        onChange={(e) => setBaptism({ ...baptism, placeOfBaptism: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter father's name"
                                                        id="placeOfBaptism"
                                                        type="text"
                                                        name="placeOfBaptism"
                                                    />
                                                    {errors.placeOfBaptism && <span className="text-red-500 text-xs italic">Place of baptism is required.</span>}
                                                </div>
                                            </div>

                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="middleName">
                                                        Middle name
                                                    </label>
                                                    <input
                                                        {...register("middleName", { required: false })}
                                                        value={baptism.middleName}
                                                        onChange={(e) => setBaptism({ ...baptism, middleName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter middle name"
                                                        id="middleName"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.middleName && <span className="text-red-500 text-xs italic">Middle name is required.</span>}
                                                </div>


                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="godParent">
                                                        Godparent
                                                    </label>
                                                    <input
                                                        {...register("godparent", { required: true })}
                                                        value={baptism.godParent}
                                                        onChange={(e) => setBaptism({ ...baptism, godParent: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter name of godparent"
                                                        id="godParent"
                                                        type="text"
                                                        name="godParent"
                                                    />
                                                    {errors.godParent && <span className="text-red-500 text-xs italic">Baptism date is required.</span>}
                                                </div>
                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        {...register("lastName", { required: true })}
                                                        value={baptism.lastName}
                                                        onChange={(e) => setBaptism({ ...baptism, lastName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter last name"
                                                        id="lastName"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.lastName && <span className="text-red-500 text-xs italic">Last name is required.</span>}
                                                </div>
                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fathersName">
                                                        Father's Name
                                                    </label>
                                                    <input
                                                        {...register("fathersName", { required: true })}
                                                        value={baptism.fathersName}
                                                        onChange={(e) => setBaptism({ ...baptism, fathersName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter father's name"
                                                        id="fathersName"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.fathersName && <span className="text-red-500 text-xs italic">Father's name is required.</span>}
                                                </div>

                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                                                        Date Of Birth
                                                    </label>
                                                    <DatePicker
                                                        {...register("dateOfBirth", { required: true })}
                                                        value={baptism.dateOfBirth}
                                                        onChange={handleBirthDateChange}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="dateOfBirth"
                                                    />
                                                    {errors.dateOfBirth && <span className="text-red-500 text-xs italic">Birth date is required.</span>}
                                                </div>


                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mothersName">
                                                        Mother's name
                                                    </label>
                                                    <input
                                                        {...register("mothersName", { required: false })}
                                                        value={baptism.mothersName}
                                                        onChange={(e) => setBaptism({ ...baptism, mothersName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter mother's name"
                                                        id="mothersName"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.mothersName && <span className="text-red-500 text-xs italic">Mother's name is required.</span>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfBirth">
                                                        Place of birth
                                                    </label>
                                                    <input
                                                        {...register("placeOfBirth", { required: true })}
                                                        value={baptism.placeOfBirth}
                                                        onChange={(e) => setBaptism({ ...baptism, placeOfBirth: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter last name"
                                                        id="placeOfBirth"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.placeOfBirth && <span className="text-red-500 text-xs italic">Place of birth is required.</span>}
                                                </div>


                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revMinister">
                                                        Rev Minister
                                                    </label>
                                                    <input
                                                        {...register("revMinister", { required: true })}
                                                        value={baptism.revMinister}
                                                        onChange={(e) => setBaptism({ ...baptism, revMinister: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter name of Rev Minister"
                                                        id="revMinister"
                                                        type="text"
                                                        name="revMinister"
                                                    />
                                                    {errors.revMinister && <span className="text-red-500 text-xs italic">Reverend Minister is required.</span>}
                                                </div>
                                            </div>
                                            <div className='flex flex-row gap-6 w-full items-center'>
                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="homeDistrict">
                                                        Home Town
                                                    </label>
                                                    <input
                                                        {...register("homeDistrict", { required: false })}
                                                        value={baptism.homeDistrict}
                                                        onChange={(e) => setBaptism({ ...baptism, homeDistrict: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter home town"
                                                        id="homeDistrict"
                                                        type="text"
                                                        name="memberId"
                                                    />
                                                    {errors.homeDistrict && <span className="text-red-500 text-xs italic">Home district is required.</span>}
                                                </div>

                                                <div className="w-1/2"></div>
                                            </div>
                                            <div className="mt-5 md:flex justify-end w-full">
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

export default AddBaptismModal