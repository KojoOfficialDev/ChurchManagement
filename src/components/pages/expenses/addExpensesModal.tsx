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
import { Expenses, ExpensesCategory, IAppState } from "../../../core/interfaces";
import { GetExpensesCategoryList } from "../../../core/services/member.services";


interface AddExpensesModalProps {
    isOpen: boolean
    onClose: () => void
    loading: boolean
    done: () => void
}

const AddExpensesModal: React.FC<AddExpensesModalProps> = ({ isOpen, onClose, loading, done }) => {
    const appState = useSelector<RootState, IAppState>((state) => state.app);
    const [isLoading, setIsloading] = useState<boolean>(false);
    const [selectedMinister, setSelectedMinister] = useState<string>("");
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [ExpensesTypes, setExpensesTypes] = useState<ExpensesCategory[]>([]);

   

    useEffect(() => {
        const fetchExpensesTypesForDropdown = async () => {
            try {
                const types = await GetExpensesCategoryList();
                setExpensesTypes(types.data);
              
            } catch (error) {
                console.error("Error fetching Expenses types:", error);
            }
        };

        if (isOpen) {
            fetchExpensesTypesForDropdown();
        }
    }, [isOpen]);

    const [Expenses, setExpenses] =useState<Expenses>({
        id: appState?.config?.id,
        name: "",
        description: "",
        createdDate: "",
        createdBy: appState?.config?.createdBy,
        modifiedDate: "",
        modifiedBy: appState?.config?.modifiedBy,
        isActive: true,
        expensesCategoryId: 1,
        expensesCategory: [],
        amountSpent: 0.00,
        paymentMethod: "",
        suppliersName: "",
        expenseDate: "",  
        churchId:  appState?.config?.churchId,
        church: null,
        
    });



    const handlePaymentDateChange = (date: Date) => {
        setSelectedDate(date);
    };


    // const dispatch = useDispatch();
    let toast: IToastHandler;

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const today = new Date()
        Expenses.createdDate = today.toISOString()
        Expenses.modifiedDate = today.toISOString()
        // Ensure amount is converted to a float
        const updatedAmount = parseFloat(Expenses.amountSpent.toString());

        // Ensure selectedDate is a valid Date object and convert it to ISO string
        Expenses.expenseDate = new Date(selectedDate).toISOString();

        // Update Expenses object with converted values
        const updatedExpenses = {
            ...Expenses,
            amountSpent: updatedAmount,
            expensesCategoryId: Expenses.expensesCategory.id,
            expensesCategory : null
        };

        console.log("Updated Expenses data:", updatedExpenses);


        setIsloading(true);

        const response = await fetch('https://catholicportal.net/api/Expenses/Save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedExpenses),
        });

        if (response.ok) {
            setExpenses({
                id: appState?.config?.id,
                name: updatedExpenses.name,
                description: updatedExpenses.description,
                createdDate: "",
                createdBy: appState?.config?.createdBy,
                modifiedDate: "",
                modifiedBy: appState?.config?.modifiedBy,
                isActive: true,
                expensesCategoryId: updatedExpenses.expensesCategoryId,
                expensesCategory: [],
                amountSpent: 0.00,
                paymentMethod:updatedExpenses.paymentMethod,
                suppliersName: updatedExpenses.suppliersName,
                expenseDate: updatedExpenses.expenseDate,  
                churchId:  appState?.config?.churchId,
                church: null
            });
            setIsloading(false);
            swal("Great! Expenses data submitted successfully!", {
                icon: "success",
            })
            toast.Info("Expenses Form Submission", "Expenses Data Submitted Successfully");
            // Set a timeout for 3 seconds before refreshing the page
            setTimeout(() => {
                window.location.reload();
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            setIsloading(false)
            console.error('Error submitting form data:', response.status);
            toast.Error("Error", "Failed to create Expenses. Please try again.")
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
                                            Add Expenses
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
                                                        value={Expenses.name}
                                                        onChange={(e) => setExpenses({ ...Expenses, name: e.target.value })}
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
                                                        value={Expenses.description}
                                                        onChange={(e) => setExpenses({ ...Expenses, description: e.target.value })}
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
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ExpensesType">
                                                        Expenses Type
                                                    </label>
                                                    <select
                                                        {...register("expensesCategory", { required: true })}
                                                        value={Expenses.expensesCategory?.name || ""}
                                                        onChange={(e) => {
                                                            const selectedType = ExpensesTypes.find(type => type.name === e.target.value);
                                                            if (selectedType) {
                                                                setExpenses({ ...Expenses, expensesCategory: selectedType });
                                                            }
                                                        }}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="ExpensesType"
                                                        name="ExpensesType"
                                                    >
                                                        <option value="" disabled>Select Expenses type</option>
                                                        {ExpensesTypes.map(type => (
                                                            <option key={type.id} value={type.name}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.ExpensesType && <span className="text-red-500 text-xs italic">Expenses type is required.</span>}
                                                </div>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                                        Amount
                                                    </label>
                                                    <input
                                                        {...register("amount", { required: false })}
                                                        value={Expenses.amountSpent}
                                                        onChange={(e) => setExpenses({ ...Expenses, amountSpent: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter amount"
                                                        id="amount"
                                                        type="text"
                                                        name="amount"
                                                    />
                                                    {errors.amoountSpent && <span className="text-red-500 text-xs italic">Amount is required.</span>}
                                                </div>

                                            </div>


                                            <div className='flex flex-row gap-6 w-full items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="channel">
                                                        Payment Method
                                                    </label>
                                                    <input
                                                        {...register("channel", { required: false })}
                                                        value={Expenses.paymentMethod}
                                                        onChange={(e) => setExpenses({ ...Expenses, paymentMethod: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter Payment Method"
                                                        id="channel"
                                                        type="text"
                                                        name="channel"
                                                    />
                                                    {errors.paymentMethod && <span className="text-red-500 text-xs italic">Payment Method is required.</span>}
                                                </div>


                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNumber">
                                                       Supplier
                                                    </label>
                                                    <input
                                                        {...register("mobileNumber", { required: false })}
                                                        value={Expenses.suppliersName}
                                                        onChange={(e) => setExpenses({ ...Expenses, suppliersName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter Suppliers Name"
                                                        id="mobileNumber"
                                                        type="text"
                                                        name="mobileNumber"
                                                    />
                                                    {errors.suppliersName && <span className="text-red-500 text-xs italic">Supplier or Vendor is required.</span>}
                                                </div>
                                            </div>

                                            <div className='flex flex-row gap-6 w-full mb-4 items-center'>

                                                <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentDate">
                                                        Payment Date
                                                    </label>
                                                    <DatePicker
                                                        {...register("paymentDate", { required: true })}
                                                        value={selectedDate}
                                                        onChange={handlePaymentDateChange}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="paymentDate"
                                                    />
                                                    <input type="hidden" name="id" value={Expenses.id}
                                                        onChange={(e) => setExpenses({ ...Expenses, id: e.target.valueAsNumber })} />
                                                    {errors.paymentDate && <span className="text-red-500 text-xs italic">Payment date is required.</span>}
                                                </div>

                                            </div>

                                            <div className="mt-16 md:flex justify-end w-full">
                                                <div className="md:w-1/4">
                                                    <MtnButton className="form-wizard-submit bg-[#318fe8] hover:bg-[#0054a0] text-white" type={"submit"} label={"Submit Request"} />
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

export default AddExpensesModal