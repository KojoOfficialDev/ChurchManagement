import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { IToastHandler, Toast } from "../../layout/Toast";
import { GetSocietiesList, GetNationalityList } from "../../../core/services/member.services";
import { LazyLoadImage } from "react-lazy-load-image-component"
import axios from 'axios';
import DatePicker from 'react-flatpickr'
import { MemberList } from './_page';
import { getConfig } from '../../../core/utility';
import { Icons } from '../../Assets';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/stores';
import { IAppState } from '../../../core/interfaces';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowData: any;
    recordId: any
    loading: boolean
    done: () => void
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, rowData, recordId, loading, done }) => {
    const [step, setStep] = useState(1)
    // const methods = useForm({
    //     defaultValues: formData,
    // });
    const appState = useSelector<RootState, IAppState>((state) => state.app);
    const { register, formState: { errors } } = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedSocieties, setSelectedSocieties] = useState([""])
    const [selectedDateOfBaptism, setSelectedDateOfBaptism] = useState(new Date())
    const [selectedDateOfCommunion, setSelectedDateOfCommunion] = useState(new Date())
    const [selectedDateOfConfirmation, setSelectedDateOfConfirmation] = useState(new Date())
    const [isParent, setIsParent] = useState()
    let toast: IToastHandler
    const [base64Image, setBase64Image] = useState<string | null>(null)

    const [marritalStatus, setMarritalStatus] = useState('')
    const [showMarriageFields, setShowMarriageFields] = useState(false)

    const [employmentStatus, setEmploymentStatus] = useState('')
    const [showPlaceOfWork, setShowPlaceOfWork] = useState(false)

    const [societyStatus, setSocietyStatus] = useState('')
    const [showSocieties, setShowSocieties] = useState(false)

    const [society, setSociety] = useState({
        id: 0,
        name: "",
        active: true
    })
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [showOtherInput, setShowOtherInput] = useState<boolean>(false)
    const [otherValue, setOtherValue] = useState<string>('')
    const [otherNationValue, setOtherNationValue] = useState<string>('')

    const [parentStatus, setParentStatus] = useState('')
    const [showChildren, setShowChildren] = useState(false)


    const handleChildren = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParentStatus(e.target.value)
        setFormData({ ...formData, isParent: e.target.checked })
        setShowChildren(e.target.checked === true)
    }

    const handleEmploymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        setEmploymentStatus(e.target.value);
        setFormData({ ...formData, professionalStatus: value })
        setShowPlaceOfWork(value === 'Employed' || value === 'Self Employed') // Show fields only if professionalStatus is 'Employed' or 'Self Employed'
    };

    const handleSocieties = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSocietyStatus(e.target.value);
        setFormData({ ...formData, isBelongToSociety: e.target.checked });
        setShowSocieties(e.target.checked === true)
    };


    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = event.target;
        const intId = parseInt(id, 10);

        if (id === 'other') {
            setShowOtherInput(checked);
            if (!checked) {
                setOtherValue('');
            }
        } else {
            if (checked) {
                formData.societyName = [...formData.societyName, intId]
                setSelectedIds([...selectedIds, intId])
                setShowSocieties(true)
            } else {
                setSelectedIds(selectedIds.filter(societyId => societyId !== intId))
                formData.societyName =  formData.societyName.filter(societyId => societyId !== intId)
                setShowSocieties(true)
            }
        }
    };

    const handleOtherInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtherValue(event.target.value);
    };

    const handleOtherNationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtherNationValue(event.target.value);
    };

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const [formData, setFormData] = useState({
        id: appState?.config?.id,
        membershipNumber: "",
        cardNumber: "",
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        notes: "",
        dateOfBirth: "2024-04-11 09:22:18.51+00",
        homeDistrict: "",
        region: "",
        occupation: "",
        fathersName: "",
        mothersName: "",
        phoneNumber: "",
        imageUrl: "",
        isDeceased: false,
        isMinister: false,
        createdDate: "",
        createdBy: appState?.config?.createdBy,
        modifiedDate: "",
        modifiedBy: appState?.config?.modifiedBy,
        isActive: true,
        isBaptized: false,
        isFirstCommunion: false,
        isConfirmed: false,
        isBelongToSociety: false,
        societyName: [0],
        placeOfStay: "",
        houseNumber: "",
        house: "",
        mothersTelePhone: "",
        fathersTelePhone: "",
        isMotherACatholic: true,
        isFatherACatholic: true,
        isFatherDeceased: false,
        isMotherDeceased: false,
        isFatherAMemberOfCathedral: true,
        isMotherAMemberOfCathedral: true,
        areUHomeBound: false,
        isDisabled: false,
        doYouBelongToAnyChurchApartFromMainChurch: false,
        nameOfOtherChurchYouBelongTo: "",
        churchFatherAttends: "",
        churchMotherAttends: "",
        educationalLevel: "",
        position: "",
        marritalStatus: "",
        isPayDues: false,
        reasonForPayingOrNotPayingDues: "",
        isEmployed: true,
        professionalStatus: "",
        reasonForNotWorking: "",
        isAdult: false,
        guardianName: "",
        isGuardianACatholic: true,
        isGuardianAMemberOfCathedral: true,
        churchGuardianAttends: "",
        guardianTelephone: "",
        middleName: "",
        postalAddress: "",
        marriageType: "",
        nameOfSpouse: "",
        nationality: "",
        placeOfWork: "",
        baptismNumber: "",
        baptismDate: "",
        placeOfBaptism: "",
        confirmationNumber: "",
        confirmationDate: "",
        placeOfConfirmation: "",
        firstCommunionNumber: "",
        nationalId: appState?.config?.nationalId,
        churchId: appState?.config?.churchId,
        firstCommunionDate: "",
        placeOfFirstCommunion: "",
        placeOfBirth: "",
        children: "",
        isParent: false
    })


    useEffect(() => {
        if (isOpen && rowData) {
            setFormData({
                id: rowData.id || appState?.config?.id,
                membershipNumber: rowData.membershipNumber || "",
                cardNumber: rowData.cardNumber || "",
                title: rowData.title || "",
                firstName: rowData.firstName || "",
                lastName: rowData.lastName || "",
                email: rowData.email || "",
                gender: rowData.gender || "",
                notes: rowData.notes || "",
                house: rowData.house || "",
                dateOfBirth: rowData.dateOfBirth || "2024-04-11 09:22:18.51+00",
                homeDistrict: rowData.homeDistrict || "",
                region: rowData.region || "",
                occupation: rowData.occupation || "",
                fathersName: rowData.fathersName || "",
                mothersName: rowData.mothersName || "",
                phoneNumber: rowData.phoneNumber || "",
                imageUrl: rowData.imageUrl || "",
                isDeceased: rowData.isDeceased || false,
                isMinister: rowData.isMinister || false,
                createdDate: rowData.createdDate || "",
                createdBy: rowData.createdBy || appState?.config?.createdBy,
                modifiedDate: rowData.modifiedDate || "",
                modifiedBy: rowData.modifiedBy || appState?.config?.modifiedBy,
                isActive: rowData.isActive || true,
                isBaptized: rowData.isBaptized || false,
                isFirstCommunion: rowData.isFirstCommunion || false,
                isConfirmed: rowData.isConfirmed || false,
                isBelongToSociety: rowData.isBelongToSociety || false,
                societyName: rowData.societyName || [0],
                placeOfStay: rowData.placeOfStay || "",
                houseNumber: rowData.houseNumber || "",
                mothersTelePhone: rowData.mothersName || "",
                fathersTelePhone: rowData.fathersTelephone || "",
                isMotherACatholic: rowData.isMotherACatholic || true,
                isFatherACatholic: rowData.isFatherACatholic || true,
                isFatherDeceased: rowData.isFatherDeceased || false,
                isMotherDeceased: rowData.isMotherDeceased || false,
                isFatherAMemberOfCathedral: rowData.isFatherAMemberOfCathedral || true,
                isMotherAMemberOfCathedral: rowData.isMotherAMemberOfCathedral || true,
                areUHomeBound: rowData.areUHomeBound || false,
                isDisabled: rowData.isDisabled || false,
                doYouBelongToAnyChurchApartFromMainChurch: rowData.doYouBelongToAnyChurchApartFromMainChurch || false,
                nameOfOtherChurchYouBelongTo: rowData.nameOfOtherChurchYouBelongTo || "",
                churchFatherAttends: rowData.churchFatherAttends || "",
                churchMotherAttends: rowData.churchMotherAttends || "",
                educationalLevel: rowData.educationalLevel || "",
                position: rowData.position || "",
                marritalStatus: rowData.marritalStatus || "",
                isPayDues: rowData.isPayDues || false,
                reasonForPayingOrNotPayingDues: rowData.reasonForPayingOrNotPayingDues || "",
                isEmployed: rowData.isEmployed || true,
                professionalStatus: rowData.professionalStatus || "",
                reasonForNotWorking: rowData.reasonForNotWorking || "",
                isAdult: rowData.isAdult || false,
                guardianName: rowData.guardianName || "",
                isGuardianACatholic: rowData.isGuardianACatholic || true,
                isGuardianAMemberOfCathedral: rowData.isGuardianAMemberOfCathedral || true,
                churchGuardianAttends: rowData.churchGuardianAttends || "",
                guardianTelephone: rowData.guardianTelephone || "",
                middleName: rowData.middleName || "",
                postalAddress: rowData.postalAddress || "",
                marriageType: rowData.marriageType || "",
                nameOfSpouse: rowData.nameOfSpouse || "",
                nationality: rowData.nationality || "",
                placeOfWork: rowData.placeOfWork || "",
                baptismNumber: rowData.baptismNumber || "",
                baptismDate: rowData.baptismDate || "",
                placeOfBaptism: rowData.placeOfBaptism || "",
                confirmationNumber: rowData.confirmationNumber || "",
                confirmationDate: rowData.confirmationDate || "",
                placeOfConfirmation: rowData.placeOfConfirmation || "",
                firstCommunionNumber: rowData.firstCommunionNumber || "",
                nationalId: rowData.nationalId || appState?.config?.nationalId,
                churchId: rowData.churchId || appState?.config?.churchId,
                firstCommunionDate: rowData.firstCommunionDate || "",
                placeOfFirstCommunion: rowData.placeOfFirstCommunion || "",
                placeOfBirth: rowData.placeOfBirth || "",
                children: rowData.children || "",
                isParent: rowData.isParent || false
            })
        }
    }, [isOpen, rowData])

    const handleMarritalStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMarritalStatus = e.target.value;
        setMarritalStatus(newMarritalStatus)
        setFormData(prevMember => ({
            ...prevMember,
            marritalStatus: newMarritalStatus
        }));
        console.log(newMarritalStatus)
        setShowMarriageFields(newMarritalStatus === 'Married')
    }


    useEffect(() => {
        if (formData.professionalStatus === 'Employed' || formData.professionalStatus === 'Self Employed') {
            setShowPlaceOfWork(true);
        } else {
            setShowPlaceOfWork(false);
        }

        if (formData.marritalStatus === 'Married') {
            setShowMarriageFields(true);
        } else {
            setShowMarriageFields(false);
        }
    }, [formData.professionalStatus, formData.marritalStatus]);




    const [countries, setCountry] = useState([{
        id: 0,
        name: "",
        active: true
    }]);

    const [societies, setSocieties] = useState([{
        id: 0,
        name: "",
        active: true
    }]);

    const [churchs, setChurches] = useState([{
        id: 0,
        name: "",
        active: true
    }]);

    const [imageUploaded, setImageUploaded] = useState(false);



    const GetData = async () => {
        try {
            const countryresponse = await GetNationalityList();
            const societyresponse = await GetSocietiesList();
            setCountry(countryresponse.data);
            setSocieties(societyresponse.data);
            setSelectedIds(formData.societyName)
            

           
            if (selectedIds != null) {
                setShowSocieties(true)
            }
        } catch (error) {
            console.error("Error fetching Data:", error);
        }
    };



    useEffect(() => {
        GetData();
    }, []);


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedImage(file || null);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                if (typeof result === 'string') {
                    setBase64Image(result);
                    setFormData({ ...formData, imageUrl: result });
                }
            };
            reader.readAsDataURL(file);
        }

        setImageUploaded(true);
    };


    const handleBirthDateChange = (date: Date) => {
        setSelectedDate(date)
    }



    const handleBaptismDateChange = (date: Date) => {
        setSelectedDateOfBaptism(date)
    }

    const handleFirstCommunionDateChange = (date: Date) => {
        setSelectedDateOfCommunion(date)
    }


    const handleConfirmationDateChange = (date: Date) => {
        setSelectedDateOfConfirmation(date);
    }



    // Function to retrieve form data from localStorage for a given stage
    const retrieveFormDataFromLocalStorage = (step: number, recordId: string) => {
        const savedFormData = localStorage.getItem(`formData_${recordId}_${step}`);
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }

    };

    // Call this function when returning to a previous stage
    const returnToPreviousStage = (step: number, recordId: string, refresh: boolean) => {
        const previousStage = step - 1;
        recordId = formData.id.toString()
        retrieveFormDataFromLocalStorage(previousStage, recordId);
        setStep(previousStage)

       
    };

    // Function to save form data to localStorage for a given stage
    const saveFormDataToLocalStorage = (step: number, recordId: string) => {
        recordId = formData.id.toString()
        localStorage.setItem(`formData_${recordId}_${step}`, JSON.stringify(formData));
         
    };

    // Call this function before moving to the next stage
    const moveToNextStage = (step: number, recordId: string) => {
        recordId = formData.id.toString()
        saveFormDataToLocalStorage(step, recordId)
        const nextStage = step + 1
        setStep(nextStage)

    };



    useEffect(() => {
        if (isOpen && step && recordId && formData) {
            recordId = formData.id.toString()
            // Load form data from localStorage when component mounts
            const savedFormData = localStorage.getItem(`formData_${recordId}_${step}`);
            if (savedFormData) {

                setFormData(JSON.parse(savedFormData));
            }
           
        }
    }, [isOpen, step, recordId, formData]);






    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const today = new Date();
            formData.dateOfBirth = new Date(formData.dateOfBirth).toISOString();
            formData.baptismDate = new Date(selectedDateOfBaptism).toISOString();
            formData.confirmationDate = new Date(selectedDateOfConfirmation).toISOString();
            formData.firstCommunionDate = new Date(selectedDateOfCommunion).toISOString();
            formData.modifiedDate = today.toISOString();
            formData.createdDate = new Date(formData.createdDate).toISOString()

           
            if(formData.nationalId == -1){
                try {
                    const submitCountry = await fetch('https://catholicportal.net/api/Nationalities/Save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: 0,
                            name:  otherNationValue,
                            active: true,
                            churchId : 1
                        }),
                    });

                    if (submitCountry.ok) {
                        const returnedOption = await submitCountry.json();
                         
                        formData.nationalId = returnedOption.id;
                        formData.nationality = returnedOption.id.toString()
                        // Log it
                        console.log(formData.societyName)
                    } else {
                        console.error('Error submitting form data:', submitCountry.status);
                        toast.Error("Error", "Failed to create Country. Please try again.");
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    toast.Error("Error", "Failed to create Society. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            }



            const selectedSocieties = {
                ...selectedIds,
                ...(showOtherInput && otherValue ? { other: otherValue } : {})
            };
             
            

            if (selectedSocieties.other != null) {
                // setIsLoading(true);

                try {
                    const submitSociety = await fetch('https://catholicportal.net/api/Societies/Save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: 0,
                            name: selectedSocieties.other,
                            active: true,
                            churchId : appState?.config?.churchId
                        }),
                    });

                    if (submitSociety.ok) {
                        const returnedOption = await submitSociety.json();
                        setSociety({
                            id: returnedOption.id,
                            name: returnedOption.name,
                            active: returnedOption.active
                        });

                        // Add the new id to the selectedIds array
                        const updatedSelectedIds = [...formData.societyName, returnedOption.id];

                        formData.societyName = updatedSelectedIds


                    } else {
                        console.error('Error submitting form data:', submitSociety.status);
                        toast.Error("Error", "Failed to create Society. Please try again.");
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    toast.Error("Error", "Failed to create Society. Please try again.");
                } finally {
                    // setIsLoading(false);
                }
            }

            const uploadFormData = new FormData();
            if (selectedImage) {
                uploadFormData.append("file", selectedImage);
                try {
                    const response = await fetch(
                        "https://catholicportal.net/api/products/UploadImage",
                        {
                            method: "POST",
                            body: uploadFormData,
                        }
                    );
    
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.log(errorText);
                    } else {
                        const imageUrl = await response.text();
                        formData.imageUrl = imageUrl
                    }
                } catch (error) {
                    console.error(error);
    
                }
            }

            console.log(formData)
            const response = await fetch('https://catholicportal.net/api/Member/Update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsLoading(false)
                toast.Info("Member Form Submission", "Member Data Submitted Successfully");
                window.location.reload();
            } else {
                setIsLoading(false)
                console.error('Error submitting form data:', response);
                toast.Error("Error", "Failed to edit member. Please try again.")
                // Handle error
            }

        } catch (error) {
            console.error('Error submitting form:', error);
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
                <Transition show={isOpen} as={Fragment}>
                    <Dialog onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
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
                                    <div className="flex justify-between items-start">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-bold text-gray-900 uppercase">
                                            Edit Member
                                        </Dialog.Title>
                                        <Icons.Close
                                            type="button"
                                            className="w-4 h-5 hover:cursor-pointer rounded-full font-bold text-2xl"
                                            onClick={onClose}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                            <div className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-1/5' : step === 2 ? 'w-2/5' : step === 3 ? 'w-3/5' : step === 4 ? 'w-4/5' : 'w-full'}`}></div>
                                        </div>
                                        <form onSubmit={onSubmit}>
                                            {step === 1 && formData && (
                                                <div>
                                                    <div className='flex flex-row gap-10 w-full'>
                                                        <div className="mb-2 w-1/3">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                                                Profile Image
                                                            </label>
                                                            <input
                                                                {...register("imageUrl", { required: true })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="image"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                            />
                                                            {formData.imageUrl && <LazyLoadImage src={formData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />}

                                                            {/* <LazyLoadImage src={formData.imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} /> */}

                                                            {errors.image && <span className="text-red-500 text-xs italic">Image is required.</span>}
                                                        </div>

                                                        <div className='flex flex-col gap-2 w-2/3'>
                                                            <div className='flex flex-row gap-6 w-full'>
                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="membershipNumber">
                                                                        Membership Number
                                                                    </label>
                                                                    <input
                                                                        {...register("membershipNumber", { required: true })}
                                                                        name="membershipNumber"
                                                                        value={formData.membershipNumber}
                                                                        onChange={
                                                                            (e) => setFormData({ ...formData, membershipNumber: e.target.value })
                                                                        }
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="membershipNumber"
                                                                        type="text"
                                                                        disabled
                                                                    />
                                                                    {errors.membershipNumber && <span className="text-red-500 text-xs italic">Membership number is required.</span>}
                                                                </div>
                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                                                        Title
                                                                    </label>
                                                                    <select
                                                                        {...register("title", { required: true })}
                                                                        value={formData.title}
                                                                        onChange={
                                                                            (e) => setFormData({ ...formData, title: e.target.value })
                                                                            // handleInputChange
                                                                        }
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="title"
                                                                    // type="dropdown"
                                                                    >
                                                                        <option value={""}>Select title</option>
                                                                        <option value={"Mr"}>Mr</option>
                                                                        <option value={"Mrs"}>Mrs</option>
                                                                        <option value={"Miss"}>Miss</option>
                                                                        <option value={"Rev Fr"}>Rev Fr</option>
                                                                        <option value={"Dr"}>Dr</option>
                                                                        <option value={"Prof"}>Prof</option>
                                                                    </select>
                                                                    {errors.title && <span className="text-red-500 text-xs italic">Title is required.</span>}
                                                                </div>

                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                                                        House
                                                                    </label>
                                                                    <select
                                                                        {...register("tihousetle", { required: true })}
                                                                        value={formData.house}
                                                                        onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="house"
                                                                    // type="dropdown"
                                                                    >
                                                                        <option value={""}>Select House</option>
                                                                        <option value={"Aggrey"}>Aggrey</option>
                                                                        <option value={"Guggisberg"}>Guggisberg</option>
                                                                        <option value={"Gyamfi"}>Gyamfi</option>
                                                                        <option value={"Cadbury"}>Cadbury</option>
                                                                        <option value={"Lugard"}>Lugard</option>
                                                                        <option value={"Livingstone"}>Livingstone</option>
                                                                        <option value={"Fraser"}>Aggrey</option>
                                                                        <option value={"Kwapong"}>Kwapong</option>
                                                                        <option value={"Kingsley"}>Kingsley</option>
                                                                        <option value={"McCarthy"}>McCarthy</option>
                                                                        <option value={"Slessor"}>Slessor</option>
                                                                        <option value={"Clark"}>Clark</option>
                                                                        <option value={"S.O.A"}>S.O.A</option>
                                                                        <option value={"Baeta"}>Baeta</option>
                                                                        <option value={"Stopford"}>Stopford</option>
                                                                        <option value={"Atta Mills"}>Atta Mills</option>
                                                                        <option value={"Aryee"}>Aryee</option>
                                                                    </select>
                                                                    {errors.membershipNumber && <span className="text-red-500 text-xs italic">Title is required.</span>}
                                                                </div>
                                                            </div>

                                                            <div className='flex flex-row gap-6 w-full'>
                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                                                        First Name (s)
                                                                    </label>
                                                                    <input

                                                                        value={formData.firstName}
                                                                        onChange={
                                                                            (e) => setFormData({ ...formData, firstName: e.target.value })
                                                                        }
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="firstName"
                                                                        type="text"
                                                                    />
                                                                    {errors.firstName && <span className="text-red-500 text-xs italic">First name is required.</span>}
                                                                </div>

                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                                                        Last Name
                                                                    </label>
                                                                    <input

                                                                        value={formData.lastName}
                                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="lastName"
                                                                        type="text"
                                                                    />
                                                                    {errors.lastName && <span className="text-red-500 text-xs italic">Last name is required.</span>}
                                                                </div>
                                                            </div>

                                                            <div className='flex flex-row gap-6 w-full mb-10'>
                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="middleName">
                                                                        Middle Name (s)
                                                                    </label>
                                                                    <input

                                                                        value={formData.middleName}
                                                                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="middleName"
                                                                        type="text"
                                                                    />
                                                                    {errors.middleName && <span className="text-red-500 text-xs italic">Middle name is required.</span>}
                                                                </div>

                                                                <div className="mb-4 w-1/2">
                                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                                                                        Gender
                                                                    </label>
                                                                    <select

                                                                        value={formData.gender}
                                                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        id="gender"
                                                                    // type="dropdown"
                                                                    >
                                                                        <option value={""}>Select gender...</option>
                                                                        <option value={"Male"}>Male</option>
                                                                        <option value={"Female"}>Female</option>
                                                                    </select>
                                                                    {errors.lastName && <span className="text-red-500 text-xs italic">Gender is required.</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-row justify-evenly my-5'>
                                                        <div className="mb-4 flex flex-row gap-5 items-center">
                                                            <label className="block text-gray-700 text-sm font-bold" htmlFor="isBaptized">
                                                                Are you a baptized Catholic?
                                                            </label>
                                                            <input

                                                                checked={formData.isBaptized}
                                                                onChange={(e) => setFormData({ ...formData, isBaptized: e.target.checked })}
                                                                className="rounded w-4 h-4 py-2 px-3"
                                                                id="isBaptized"
                                                                type="checkbox"
                                                            />
                                                            {errors.isBaptized && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                        </div>
                                                        <div className="mb-4 flex flex-row gap-5 items-center">
                                                            <label className="block text-gray-700 text-sm font-bold" htmlFor="isFirstCommunion">
                                                                Are you a Communicant?
                                                            </label>
                                                            <input

                                                                checked={formData.isFirstCommunion}
                                                                onChange={(e) => setFormData({ ...formData, isFirstCommunion: e.target.checked })}
                                                                className="rounded w-4 h-4 py-2 px-3"
                                                                id="isFirstCommunion"
                                                                type="checkbox"
                                                            />
                                                            {errors.isFirstCommunion && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                        </div>
                                                        <div className="mb-4 flex flex-row gap-5 items-center">
                                                            <label className="block text-gray-700 text-sm font-bold" htmlFor="isConfirmed">
                                                                Have you received Confirmation?
                                                            </label>
                                                            <input

                                                                checked={formData.isConfirmed}
                                                                onChange={(e) => setFormData({ ...formData, isConfirmed: e.target.checked })}
                                                                className="rounded w-4 h-4 py-2 px-3"
                                                                id="isConfirmed"
                                                                type="checkbox"
                                                            />
                                                            {errors.isFirstCommunion && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                        </div>
                                                    </div>

                                                    <div className=''>
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                // () => setStep(2)
                                                                () => moveToNextStage(step, recordId)
                                                            }
                                                            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                        >
                                                            Next
                                                        </button>
                                                    </div>

                                                </div>
                                                // <FirstStageForm
                                                //     formData={formData}
                                                //     setFormData={setFormData}
                                                //     onNext={handleNext}
                                                // />
                                            )}
                                            {step === 2 && (
                                                <div>
                                                    {formData.isBaptized && (
                                                        <div className='flex flex-row gap-5 w-full'>
                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baptismDate">
                                                                    Date Of Baptism
                                                                </label>
                                                                <DatePicker
                                                                    {...register("baptismDate", { required: true })}
                                                                    value={formData.baptismDate}
                                                                    onChange={handleBaptismDateChange}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="baptismDate"
                                                                />
                                                                {errors.baptismDate && <span className="text-red-500 text-xs italic">Baptism date is required.</span>}
                                                            </div>

                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfBaptism">
                                                                    Place Of Baptism
                                                                </label>
                                                                <input
                                                                    {...register("placeOfBaptism", { required: true })}
                                                                    value={formData.placeOfBaptism}
                                                                    onChange={(e) => setFormData({ ...formData, placeOfBaptism: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="placeOfBaptism"
                                                                    type="text"
                                                                    placeholder="Enter place of baptism"
                                                                />
                                                                {errors.placeOfBaptism && <span className="text-red-500 text-xs italic">Place of birth is required.</span>}
                                                            </div>

                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baptismNumber">
                                                                    N.L.B
                                                                </label>
                                                                <input
                                                                    {...register("baptismNumber", { required: true })}
                                                                    value={formData.baptismNumber}
                                                                    onChange={(e) => setFormData({ ...formData, baptismNumber: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="baptismNumber"
                                                                    type="text"
                                                                    placeholder="Enter NLB number"
                                                                />
                                                                {errors.placeOfBaptism && <span className="text-red-500 text-xs italic">N.L.B is required.</span>}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {formData.isFirstCommunion && (
                                                        <div className='flex flex-row gap-5 w-full'>
                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstCommunionDate">
                                                                    Date of First Communion
                                                                </label>
                                                                <DatePicker
                                                                    {...register("firstCommunionDate", { required: true })}
                                                                    value={formData.firstCommunionDate}
                                                                    onChange={handleFirstCommunionDateChange}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="firstCommunionDate"
                                                                />
                                                                {errors.firstCommunionDate && <span className="text-red-500 text-xs italic">First communion date is required.</span>}
                                                            </div>

                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfFirstCommunion">
                                                                    Place Of First Communion
                                                                </label>
                                                                <input
                                                                    {...register("placeOfFirstCommunion", { required: true })}
                                                                    value={formData.placeOfFirstCommunion}
                                                                    onChange={(e) => setFormData({ ...formData, placeOfFirstCommunion: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="placeOfFirstCommunion"
                                                                    type="text"
                                                                    placeholder="Enter place of baptism"
                                                                />
                                                                {errors.placeOfFirstCommunion && <span className="text-red-500 text-xs italic">Place of first communion is required.</span>}
                                                            </div>

                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baptismNumber">
                                                                    N.L.C
                                                                </label>
                                                                <input
                                                                    {...register("baptismNumber", { required: true })}
                                                                    value={formData.baptismNumber}
                                                                    onChange={(e) => setFormData({ ...formData, baptismNumber: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="baptismNumber"
                                                                    type="text"
                                                                    placeholder="Enter NLC number"
                                                                />
                                                                {errors.baptismNumber && <span className="text-red-500 text-xs italic">N.L.C number is required.</span>}
                                                            </div>

                                                        </div>
                                                    )}
                                                    {formData.isConfirmed && (
                                                        <div className='flex flex-row gap-5 w-full mb-5'>
                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmationDate">
                                                                    Date Of Confirmation
                                                                </label>
                                                                <DatePicker
                                                                    {...register("placeOfConfirmation", { required: true })}
                                                                    value={formData.confirmationDate}
                                                                    onChange={handleConfirmationDateChange}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="confirmationDate"
                                                                />
                                                                {errors.confirmationDate && <span className="text-red-500 text-xs italic">Confirmation date is required.</span>}
                                                            </div>

                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfConfirmation">
                                                                    Place Of Confirmation
                                                                </label>
                                                                <input
                                                                    {...register("placeOfConfirmation", { required: true })}
                                                                    value={formData.placeOfConfirmation}
                                                                    onChange={(e) => setFormData({ ...formData, placeOfConfirmation: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="placeOfConfirmation"
                                                                    type="text"
                                                                    placeholder="Enter place of Confirmation"
                                                                />
                                                                {errors.placeOfConfirmation && <span className="text-red-500 text-xs italic">Place of confirmation is required.</span>}
                                                            </div>

                                                            <div className="mb-4 w-1/3">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmationNumber">
                                                                    N.L Conf.
                                                                </label>
                                                                <input
                                                                    {...register("confirmationNumber", { required: true })}
                                                                    value={formData.confirmationNumber}
                                                                    onChange={(e) => setFormData({ ...formData, confirmationNumber: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="confirmationNumber"
                                                                    type="text"
                                                                    placeholder="Enter NLC number"
                                                                />
                                                                {errors.confirmationNumber && <span className="text-red-500 text-xs italic">N.L.C number is required.</span>}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className='flex flex-row gap-10 w-full'>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                                                                Birth Date
                                                            </label>
                                                            <DatePicker

                                                                value={formData.dateOfBirth}
                                                                onChange={handleBirthDateChange}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="dateOfBirth"
                                                            />
                                                            {errors.dateOfBirth && <span className="text-red-500 text-xs italic">Birth date is required.</span>}
                                                        </div>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfBirth">
                                                                Place Of Birth
                                                            </label>
                                                            <input
                                                                {...register("placeOfBirth", { required: true })}
                                                                value={formData.placeOfBirth}
                                                                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="placeOfBirth"
                                                                type="text"
                                                            />
                                                            {errors.placeOfBirth && <span className="text-red-500 text-xs italic">Place of birth is required.</span>}
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-row gap-10 w-full'>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="homeDistrict">
                                                                Hometown
                                                            </label>
                                                            <input
                                                                {...register("homeDistrict", { required: true })}
                                                                value={formData.homeDistrict}
                                                                onChange={(e) => setFormData({ ...formData, homeDistrict: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="homeDistrict"
                                                                type="text"
                                                            />
                                                            {errors.homeDistrict && <span className="text-red-500 text-xs italic">Hometown is required.</span>}
                                                        </div>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nationality">
                                                                Nationality
                                                            </label>
                                                            <select
                                                                {...register("nationality", { required: true })}
                                                                value={formData.nationalId}
                                                                onChange={(e) => setFormData({ ...formData, nationalId: Number(e.target.value) })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="nationality"
                                                            >
                                                                <option value={""}>Select country</option>
                                                                {countries.map(({ id, name }) => (
                                                                    <option key={id} value={id}>
                                                                        {name}
                                                                    </option>
                                                                ))}
                                                                <option value={-1}>Other</option>
                                                            </select>
                                                            {errors.nationality && <span className="text-red-500 text-xs italic">Nationality is required.</span>}
                                                        </div>

                                                        {formData.nationalId == -1 && (
                                                                    <div>
                                                                        <label htmlFor="otherInput">Please specify:</label>
                                                                        <input
                                                                            type="text"
                                                                            id="otherInput"
                                                                            value={otherNationValue}
                                                                            onChange={handleOtherNationInputChange}
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                )}
                                                    </div>

                                                    <div className='flex flex-row gap-10 w-full mb-8'>
                                                        <div className="w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfStay">
                                                                Place of stay
                                                            </label>
                                                            <input
                                                                {...register("placeOfStay", { required: true })}
                                                                value={formData.placeOfStay}
                                                                onChange={(e) => setFormData({ ...formData, placeOfStay: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="placeOfStay"
                                                                type="text"
                                                                placeholder='Where do you live?'
                                                            />
                                                            {errors.placeOfStay && <span className="text-red-500 text-xs italic">Place of stay is required.</span>}
                                                        </div>
                                                        <div className="w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="houseNumber">
                                                                House Address or GPS Address
                                                            </label>
                                                            <input
                                                                {...register("houseNumber", { required: true })}
                                                                value={formData.houseNumber}
                                                                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="houseNumber"
                                                                type="text"
                                                            />
                                                            {errors.houseNumber && <span className="text-red-500 text-xs italic">Hometown is required.</span>}
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            // () => setStep(1)
                                                            () => returnToPreviousStage(step, recordId, true)
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            // () => setStep(3)
                                                            () => moveToNextStage(step, recordId)
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                            {step === 3 && (
                                                <div>
                                                    <div className=' flex flex-row gap-6 w-full'>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                                                Email
                                                            </label>
                                                            <input
                                                                {...register("email", { required: true })}
                                                                value={formData.email}
                                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="email"
                                                                type="email"
                                                            />
                                                            {errors.email && <span className="text-red-500 text-xs italic">Email is required.</span>}
                                                        </div>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                                                                Phone number
                                                            </label>
                                                            <input
                                                                {...register("phoneNumber", { required: true })}
                                                                value={formData.phoneNumber}
                                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="phoneNumber"
                                                                type="text"
                                                                placeholder='Enter phone number'
                                                            />
                                                            {errors.phoneNumber && <span className="text-red-500 text-xs italic">Phone number is required.</span>}
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-row gap-6 w-full'>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="occupation">
                                                                Occupation
                                                            </label>
                                                            <input
                                                                {...register("occupation", { required: true })}
                                                                value={formData.occupation}
                                                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="occupation"
                                                                type="text"
                                                            />
                                                            {errors.occupation && <span className="text-red-500 text-xs italic">Occupation is required.</span>}
                                                        </div>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="professionalStatus">
                                                                Employment Status
                                                            </label>
                                                            <select
                                                                {...register("professionalStatus", { required: true })}
                                                                value={formData.professionalStatus}
                                                                onChange={handleEmploymentStatusChange}
                                                                // onChange={(e) => setMember({ ...member, professionalStatus: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="professionalStatus"
                                                            >
                                                                <option value={""}>Select employment status</option>
                                                                <option value={"Employed"}>Employed</option>
                                                                <option value={"Unemployed"}>Unemployed</option>
                                                                <option value={"Student"}>Student</option>
                                                                <option value={"Self Employed"}>Self Employed</option>
                                                            </select>
                                                            {errors.professionalStatus && <span className="text-red-500 text-xs italic">Employment Status is required.</span>}
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-row gap-6 w-full'>
                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="educationalLevel">
                                                                Academic Qualification
                                                            </label>
                                                            <select
                                                                {...register("educationalLevel", { required: true })}
                                                                value={formData.educationalLevel}
                                                                onChange={(e) => setFormData({ ...formData, educationalLevel: e.target.value })}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="educationalLevel"
                                                            >
                                                                <option value={""}>Select academic qualification</option>
                                                                <option value={"Tertiary"}>Tertiary</option>
                                                                <option value={"Secondry"}>Secondry</option>
                                                                <option value={"Junior High/Middle School"}>Junior High/Middle School</option>
                                                                <option value={"None"}>None</option>
                                                            </select>
                                                            {errors.professionalStatus && <span className="text-red-500 text-xs italic">Academic qualification is required.</span>}
                                                        </div>

                                                        <div className="mb-4 w-1/2">
                                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marritalStatus">
                                                                Marital Status
                                                            </label>
                                                            <select
                                                                {...register("marritalStatus", { required: true })}
                                                                value={formData.marritalStatus}
                                                                // onChange={(e) => setMember({ ...member, marritalStatus: e.target.value })}
                                                                onChange={handleMarritalStatusChange}
                                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                id="marritalStatus"
                                                            >
                                                                <option value={""}>Select marital status</option>
                                                                <option value={"Single"}>Single</option>
                                                                <option value={"Married"}>Married</option>
                                                                <option value={"Divorced"}>Divorcee</option>
                                                                <option value={"Widowed"}>Widowed</option>
                                                            </select>
                                                            {errors.marritalStatus && <span className="text-red-500 text-xs italic">Marital status is required.</span>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            // () => setStep(2)
                                                            () => returnToPreviousStage(step, recordId, false)
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveToNextStage(step, recordId)
                                                            // setStep(4)
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                            {step === 4 && (
                                                <div>
                                                    {showPlaceOfWork && (
                                                        <>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="placeOfWork">
                                                                    Place of work
                                                                </label>
                                                                <input
                                                                    {...register("placeOfWork", { required: true })}
                                                                    value={formData.placeOfWork}
                                                                    onChange={(e) => setFormData({ ...formData, placeOfWork: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="placeOfWork"
                                                                    type="text"
                                                                    placeholder='Enter place of work'
                                                                />
                                                                {errors.placeOfWork && <span className="text-red-500 text-xs italic">Place of work is required.</span>}
                                                            </div>
                                                        </>
                                                    )}
                                                    {showMarriageFields && (
                                                        <>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marriageType">
                                                                    Marriage Type
                                                                </label>
                                                                <select
                                                                    {...register("marriageType", { required: true })}
                                                                    value={formData.marriageType}
                                                                    onChange={(e) => setFormData({ ...formData, marriageType: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="marriageType"
                                                                >
                                                                    <option value={""}>Select marriage type</option>
                                                                    <option value={"Church"}>Church</option>
                                                                    <option value={"Civil"}>Civil</option>
                                                                    <option value={"Customary"}>Customary</option>
                                                                    
                                                                </select>
                                                                {errors.marriageType && <span className="text-red-500 text-xs italic">Marriage type is required.</span>}
                                                            </div>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nameOfSpouse">
                                                                    Name Of Spouse
                                                                </label>
                                                                <input
                                                                    {...register("nameOfSpouse", { required: true })}
                                                                    value={formData.nameOfSpouse}
                                                                    onChange={(e) => setFormData({ ...formData, nameOfSpouse: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="nameOfSpouse"
                                                                    type="text"
                                                                />
                                                                {errors.nameOfSpouse && <span className="text-red-500 text-xs italic">Name of spouse is required.</span>}
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="mb-4">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                                                            Registration / Dues Card Number
                                                        </label>
                                                        <input
                                                            {...register("cardNumber", { required: true })}
                                                            value={formData.cardNumber}
                                                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            id="cardNumber"
                                                            type="text"
                                                            placeholder='Enter card number'
                                                        />
                                                        {errors.cardNumber && <span className="text-red-500 text-xs italic">Card number is required.</span>}
                                                    </div>
                                                    <div className="mb-10">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="region">
                                                            Region
                                                        </label>
                                                        <select
                                                            {...register("region", { required: true })}
                                                            value={formData.region}
                                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            id="region"
                                                        >
                                                            <option value={""}>Select region of fellowship</option>
                                                            <option value={"Ashanti"}>Ashanti</option>
                                                            <option value={"Ahafo"}>Ahafo</option>
                                                            <option value={"Bono East"}>Bono East</option>
                                                            <option value={"Bono"}>Bono</option>
                                                            <option value={"Central"}>Central</option>
                                                            <option value={"Eastern"}>Eastern</option>
                                                            <option value={"Greater Accra"}>Greater Accra</option>
                                                            <option value={"Northern"}>Northern</option>
                                                            <option value={"Upper West"}>Upper West</option>
                                                            <option value={"Upper East"}>Upper East</option>
                                                            <option value={"Volta"}>Volta</option>
                                                            <option value={"Western"}>Western</option>
                                                            <option value={"Savannah"}>Savannah</option>
                                                            <option value={"Oti"}>Oti</option>
                                                            <option value={"Western North"}>Western North</option>
                                                            <option value={"North East"}>Upper East</option>
                                                        </select>
                                                        {errors.occupation && <span className="text-red-500 text-xs italic">Region is required.</span>}
                                                    </div>

                                                    <div className="mb-4 flex flex-row items-center w-1/4 justify-between">
                                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="isBelongToSociety">
                                                            Do you belong to any society(ies)?
                                                        </label>
                                                        <input
                                                            {...register("isBelongToSociety", { required: true })}
                                                            checked={formData.isBelongToSociety}
                                                            onChange={handleSocieties}
                                                            // onChange={(e) => setMember({ ...member, isBelongToSociety: e.target.checked })}
                                                            className="rounded w-4 h-4 py-2 px-3"
                                                            id="isBelongToSociety"
                                                            type="checkbox"
                                                        />
                                                        {errors.isBelongToSociety && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                    </div>

                                                    {/* <div className="mb-4 flex flex-row items-center w-1/4 justify-between">
                                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="isDeceased">
                                                            Is the member deceased?
                                                        </label>
                                                        <input
                                                            {...register("isDeceased", { required: true })}
                                                            checked={formData.isDeceased}
                                                            onChange={(e) => setFormData({ ...formData, isDeceased: e.target.checked })}
                                                            className="rounded w-4 h-4 py-2 px-3"
                                                            id="isDeceased"
                                                            type="checkbox"
                                                        />
                                                        {errors.isDeceased && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                    </div> */}

                                                    {/* <div className="mb-4 flex flex-row items-center w-1/4 justify-between">
                                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="isMinister">
                                                            Is the member a minister?
                                                        </label>
                                                        <input
                                                            {...register("isMinister", { required: true })}
                                                            checked={formData.isMinister}
                                                            onChange={(e) => setFormData({ ...formData, isMinister: e.target.checked })}
                                                            className="rounded w-4 h-4 py-2 px-3"
                                                            id="isMinister"
                                                            type="checkbox"
                                                        />
                                                        {errors.isMinister && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                    </div> */}

                                                    <div className="mb-4 flex flex-row items-center w-1/4 justify-between">
                                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="isActive">
                                                            Is this an active member?
                                                        </label>
                                                        <input
                                                            {...register("isActive", { required: true })}
                                                            checked={formData.isActive}
                                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                            className="rounded w-4 h-4 py-2 px-3"
                                                            id="isActive"
                                                            type="checkbox"
                                                        />
                                                        {errors.isActive && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                    </div>

                                                    <div className="mb-10 flex flex-row items-center w-1/4 justify-between">
                                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="isParent">
                                                            Do you have children?
                                                        </label>
                                                        <input
                                                            {...register("isParent", { required: true })}
                                                            checked={formData.isParent}
                                                            onChange={handleChildren}
                                                            // onChange={(e) => setMember({ ...member, isParent: e.target.checked })}
                                                            className="rounded w-4 h-4 py-2 px-3"
                                                            id="isParent"
                                                            type="checkbox"
                                                        />
                                                        {errors.isParent && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                    </div>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            // setStep(3)
                                                            returnToPreviousStage(step, recordId, false)
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            // setStep(5)
                                                            moveToNextStage(step, recordId)
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                            {step === 5 && (
                                                <div>
                                                    {showChildren && (
                                                        <>
                                                            <div className="mb-4">
                                                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="children">
                                                                    Names of children
                                                                </label>
                                                                <textarea
                                                                    {...register("children", { required: true })}
                                                                    value={formData.children}
                                                                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                    id="children"
                                                                    placeholder='Enter names of children'
                                                                />
                                                                {errors.children && <span className="text-red-500 text-xs italic">Names of children is required.</span>}
                                                            </div>
                                                        </>
                                                    )}

                                                    {showSocieties && (
                                                        <>
                                                            <div className='my-10'>
                                                                <label htmlFor="selectedSocieties">Select Societies:</label>
                                                                <div id="dropdown">
                                                                    {societies.map((option) => (
                                                                        <div key={option.id} className='flex flex-row gap-4 my-2 items-center'>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={option.id.toString()}
                                                                                value={option.name}
                                                                                onChange={handleOptionChange}
                                                                                className='rounded w-4 h-4 py-2 px-3'
                                                                                checked={formData.societyName.includes(option.id)}
                                                                            />
                                                                            <label htmlFor={option.id.toString()}>{option.name}</label>
                                                                        </div>
                                                                    ))}
                                                                    <div className='flex flex-row gap-4 my-2 items-center'>
                                                                        <input
                                                                            type="checkbox"
                                                                            id="other"
                                                                            value="Other"
                                                                            onChange={handleOptionChange}
                                                                            className='rounded w-4 h-4 py-2 px-3'
                                                                            checked={showOtherInput}
                                                                        />
                                                                        <label htmlFor="other">Other</label>
                                                                    </div>
                                                                </div>
                                                                {showOtherInput && (
                                                                    <div>
                                                                        <label htmlFor="otherInput">Please specify:</label>
                                                                        <input
                                                                            type="text"
                                                                            id="otherInput"
                                                                            value={otherValue}
                                                                            onChange={handleOtherInputChange}
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                                                            Notes
                                                        </label>
                                                        <textarea
                                                            {...register("notes", { required: false })}
                                                            value={formData.notes}
                                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            id="children"
                                                            placeholder='Add notes'
                                                        />
                                                        {errors.children && <span className="text-red-500 text-xs italic">Names of children is required.</span>}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            // setStep(4)
                                                            returnToPreviousStage(step, recordId, false)
                                                        }
                                                        className="bg-gray-500 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                        {/* </FormProvider> */}
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

export default EditMemberModal