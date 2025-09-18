import { FormEvent, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import useRedirectToAdminPage from "../auth/login/AuthRedirect";
import DatePicker from "react-flatpickr";
import { Dialog, Transition } from "@headlessui/react";
import { getConfig } from "../../../core/utility";
import { Check } from "../../../core/services/confirmation.services";
import { Icons } from "../../Assets";
import { RootState } from "../../../core/stores";
import { Contribution, ContributionType, IAppState } from "../../../core/interfaces";
import { fetchContributionTypes } from "../../../core/services/contribution.services";


interface AddContributionModalProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
    done: () => void
}

const AddContributionModal: React.FC<AddContributionModalProps> = ({ isOpen, onClose, loading, done }) => {
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [selectedMinister, setSelectedMinister] = useState<string>("");
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [contributionTypes, setContributionTypes] = useState<ContributionType[]>([]);

    const appState = useSelector<RootState, IAppState>((state) => state.app);

    useEffect(() => {
        const fetchContributionTypesForDropdown = async () => {
            try {
                const types = await fetchContributionTypes();
                setContributionTypes(types);
            } catch (error) {
                console.error("Error fetching contribution types:", error);
            }
        };

        if (isOpen) {
            fetchContributionTypesForDropdown();
        }
    }, [isOpen]);

    const [contribution, setContribution] = useState<Contribution>({
        id: appState?.config?.id,
        name: "",
        description: "",
        active: false,
        contributionTypeId: 1,
        contributionType: [],
        amount: 0.00,
        channel: "",
        mobileNumber: "",
        paymentDate: "",
        memberId: null,
        member: null,
        churchId: 1,
        church: null
    });



    const handlePaymentDateChange = (date: Date) => {
        setSelectedDate(date);
    };


    // const dispatch = useDispatch();
    let toast: IToastHandler;

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Ensure amount is converted to a float
        const updatedAmount = parseFloat(contribution.amount.toString());

        // Ensure selectedDate is a valid Date object and convert it to ISO string
        const updatedPaymentDate = selectedDate instanceof Date ? selectedDate.toISOString() : new Date().toISOString();

        // Update contribution object with converted values
        const updatedContribution = {
            ...contribution,
            amount: updatedAmount,
            paymentDate: updatedPaymentDate,
        };

        console.log("Updated contribution data:", updatedContribution);


        setIsloading(true);

        const response = await fetch('https://catholicportal.net/api/Contributions/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedContribution),
        });

        if (response.ok) {
            setContribution({
                id: appState?.config?.id,
                name: "",
                description: "",
                active: false,
                contributionTypeId: 1,
                contributionType: null,
                godParent: "",
                amount: 0.00,
                channel: "",
                mobileNumber: "",
                paymentDate: "",
                memberId: 0,
                member: "",
                churchId: 1,
                church: null
            });
            setIsloading(false);
            swal("Great! Contribution data submitted successfully!", {
                icon: "success",
            })
            toast.Info("Contribution Form Submission", "Contribution Data Submitted Successfully");
            // Set a timeout for 3 seconds before refreshing the page
            setTimeout(() => {
                window.location.reload();
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            setIsloading(false)
            console.error('Error submitting form data:', response.status);
            toast.Error("Error", "Failed to create Contribution. Please try again.")
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
                                            Add Contribution
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
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                                        Name
                                                    </label>
                                                    <input
                                                        {...register("name", { required: true })}
                                                        value={contribution.name}
                                                        onChange={(e) => setContribution({ ...contribution, name: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter name"
                                                        id="name"
                                                        type="text"
                                                        name="name"
                                                    />
                                                    {errors.name && <span className="text-red-500 text-xs italic">Name is required.</span>}
                                                </div>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                                        Description
                                                    </label>
                                                    <input
                                                        {...register("description", { required: true })}
                                                        value={contribution.description}
                                                        onChange={(e) => setContribution({ ...contribution, description: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter description"
                                                        id="description"
                                                        type="text"
                                                        name="description"
                                                    />
                                                    {errors.description && <span className="text-red-500 text-xs italic">Description is required.</span>}
                                                </div>
                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contributionType">
                                                        Contribution Type
                                                    </label>
                                                    <select
                                                        {...register("contributionType", { required: true })}
                                                        value={contribution.contributionType?.name || ""}
                                                        onChange={(e) => {
                                                            const selectedType = contributionTypes.find(type => type.name === e.target.value);
                                                            if (selectedType) {
                                                                setContribution({ ...contribution, contributionType: selectedType });
                                                            }
                                                        }}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="contributionType"
                                                        name="contributionType"
                                                    >
                                                        <option value="" disabled>Select contribution type</option>
                                                        {contributionTypes.map(type => (
                                                            <option key={type.id} value={type.name}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.contributionType && <span className="text-red-500 text-xs italic">Contribution type is required.</span>}
                                                </div>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                                        Amount
                                                    </label>
                                                    <input
                                                        {...register("amount", { required: false })}
                                                        value={contribution.amount}
                                                        onChange={(e) => setContribution({ ...contribution, amount: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter amount"
                                                        id="amount"
                                                        type="text"
                                                        name="amount"
                                                    />
                                                    {errors.amount && <span className="text-red-500 text-xs italic">Amount is required.</span>}
                                                </div>

                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="channel">
                                                        Channel
                                                    </label>
                                                    <input
                                                        {...register("channel", { required: false })}
                                                        value={contribution.channel}
                                                        onChange={(e) => setContribution({ ...contribution, channel: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter channel"
                                                        id="channel"
                                                        type="text"
                                                        name="channel"
                                                    />
                                                    {errors.channel && <span className="text-red-500 text-xs italic">Channel is required.</span>}
                                                </div>


                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNumber">
                                                        Mobile number
                                                    </label>
                                                    <input
                                                        {...register("mobileNumber", { required: false })}
                                                        value={contribution.mobileNumber}
                                                        onChange={(e) => setContribution({ ...contribution, mobileNumber: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter mobile number"
                                                        id="mobileNumber"
                                                        type="text"
                                                        name="mobileNumber"
                                                    />
                                                    {errors.mobileNumber && <span className="text-red-500 text-xs italic">Mobile number is required.</span>}
                                                </div>
                                            </div>

                                            <div className='flex flex-row gap-6 w-full mb-4 items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentDate">
                                                        Payment Date
                                                    </label>
                                                    <DatePicker
                                                        {...register("paymentDate", { required: true })}
                                                        value={contribution.paymentDate}
                                                        onChange={handlePaymentDateChange}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="paymentDate"
                                                    />
                                                    <input type="hidden" name="id" value={contribution.id}
                                                        onChange={(e) => setContribution({ ...contribution, id: e.target.valueAsNumber })} />
                                                    {errors.paymentDate && <span className="text-red-500 text-xs italic">Payment date is required.</span>}
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

export default AddContributionModal