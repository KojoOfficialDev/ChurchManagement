// src/components/AddMemberModal.tsx
import React, {useState, useEffect, Fragment} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {Dialog, Transition} from '@headlessui/react';
import {IToastHandler, Toast} from '../../layout/Toast';
import {GetSocietiesList, GetNationalityList} from '../../../core/services/member.services';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import DatePicker from 'react-flatpickr';
import {Icons} from '../../Assets';
import {useSelector} from 'react-redux';
import {RootState} from '../../../core/stores';
import {IAppState} from '../../../core/interfaces';
import Webcam from 'react-webcam';
import {Button, Container, Grid, Paper} from '@material-ui/core';

interface AddMemberModalProps {
	isOpen: boolean;
	onClose: () => void;
	loading: boolean;
	done: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({isOpen, onClose, loading, done}) => {
	const [step, setStep] = useState(1);
	const {
		register,
		formState: {errors},
	} = useForm();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedSocieties, setSelectedSocieties] = useState(['']);
	const [selectedDateOfBaptism, setSelectedDateOfBaptism] = useState(new Date());
	const [selectedDateOfCommunion, setSelectedDateOfCommunion] = useState(new Date());
	const [selectedDateOfConfirmation, setSelectedDateOfConfirmation] = useState(new Date());
	const [isParent, setIsParent] = useState();
	let toast: IToastHandler;
	const [base64Image, setBase64Image] = useState<string | null>('');

	const [marritalStatus, setMarritalStatus] = useState('');
	const [showMarriageFields, setShowMarriageFields] = useState(false);

	const [employmentStatus, setEmploymentStatus] = useState('');
	const [showPlaceOfWork, setShowPlaceOfWork] = useState(false);

	const [societyStatus, setSocietyStatus] = useState('');
	const [showSocieties, setShowSocieties] = useState(false);

	const [society, setSociety] = useState({
		id: 0,
		name: '',
		active: true,
	});
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
	const [otherValue, setOtherValue] = useState<string>('');
	const [otherNationValue, setOtherNationValue] = useState<string>('');

	const [parentStatus, setParentStatus] = useState('');
	const [showChildren, setShowChildren] = useState(false);

	const appState = useSelector<RootState, IAppState>((state) => state.app);

	const handleMarritalStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMarritalStatus = e.target.value;
		setMarritalStatus(newMarritalStatus);
		setMember((prevMember) => ({
			...prevMember,
			marritalStatus: newMarritalStatus,
		}));
		console.log(newMarritalStatus);
		setShowMarriageFields(newMarritalStatus === 'Married'); // Show fields only if marritalStatus is 'Married'
	};

	const handleSocieties = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSocietyStatus(e.target.value);
		setMember({...member, isBelongToSociety: e.target.checked});
		setShowSocieties(e.target.checked === true);
	};

	const handleChildren = (e: React.ChangeEvent<HTMLInputElement>) => {
		setParentStatus(e.target.value);
		setMember({...member, isParent: e.target.checked});
		setShowChildren(e.target.checked === true);
	};

	const handleEmploymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setEmploymentStatus(e.target.value);
		setMember({...member, professionalStatus: e.target.value});
		setShowPlaceOfWork(e.target.value === 'Employed' || e.target.value === 'Self Employed'); // Show fields only if professionalStatus is 'Employed' or 'Self Employed'
	};

	// const options = ['CYO', 'Cristian Mothers', 'Youth', 'Other'];

	const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {id, checked} = event.target;
		const intId = parseInt(id, 10);

		if (id === 'other') {
			setShowOtherInput(checked);
			if (!checked) {
				setOtherValue('');
			}
		} else {
			if (checked) {
				setSelectedIds([...selectedIds, intId]);
				setShowSocieties(true);
			} else {
				setSelectedIds(selectedIds.filter((societyId) => societyId !== intId));
			}
		}
	};

	const handleOtherInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOtherValue(event.target.value);
	};

	const handleOtherNationInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setOtherNationValue(event.target.value);
	};

	const [member, setMember] = useState({
		id: appState?.config?.id,
		membershipNumber: '',
		cardNumber: '',
		title: '',
		firstName: '',
		lastName: '',
		email: '',
		gender: '',
		notes: '',
		dateOfBirth: '2024-04-11 09:22:18.51+00',
		homeDistrict: '',
		region: '',
		occupation: '',
		fathersName: '',
		mothersName: '',
		phoneNumber: '',
		imageUrl: '',
		isDeceased: false,
		isMinister: false,
		createdDate: '',
		createdBy: appState?.config?.createdBy,
		modifiedDate: '',
		modifiedBy: appState?.config?.modifiedBy,
		isActive: true,
		isBaptized: false,
		isFirstCommunion: false,
		isConfirmed: false,
		isBelongToSociety: false,
		societyName: [0],
		placeOfStay: '',
		houseNumber: '',
		mothersTelePhone: '',
		fathersTelePhone: '',
		isMotherACatholic: true,
		isFatherACatholic: true,
		isFatherDeceased: false,
		isMotherDeceased: false,
		isFatherAMemberOfCathedral: true,
		isMotherAMemberOfCathedral: true,
		areUHomeBound: false,
		isDisabled: false,
		doYouBelongToAnyChurchApartFromMainChurch: false,
		nameOfOtherChurchYouBelongTo: '',
		churchFatherAttends: '',
		churchMotherAttends: '',
		educationalLevel: '',
		position: '',
		house: '',
		marritalStatus: '',
		isPayDues: false,
		reasonForPayingOrNotPayingDues: '',
		isEmployed: true,
		professionalStatus: '',
		reasonForNotWorking: '',
		isAdult: false,
		guardianName: '',
		isGuardianACatholic: true,
		isGuardianAMemberOfCathedral: true,
		churchGuardianAttends: '',
		guardianTelephone: '',
		middleName: '',
		postalAddress: '',
		marriageType: '',
		nameOfSpouse: '',
		nationality: '',
		placeOfWork: '',
		baptismNumber: '',
		baptismDate: '',
		placeOfBaptism: '',
		confirmationNumber: '',
		confirmationDate: '',
		placeOfConfirmation: '',
		firstCommunionNumber: '',
		nationalId: appState?.config?.nationalId,
		churchId: appState?.config?.churchId,
		firstCommunionDate: '',
		placeOfFirstCommunion: '',
		placeOfBirth: '',
		children: '',
		isParent: false,
	});

	const [countries, setCountry] = useState([
		{
			id: 0,
			name: '',
			active: true,
		},
	]);

	const [societies, setSocieties] = useState([
		{
			id: 0,
			name: '',
			active: true,
		},
	]);

	const [churchs, setChurches] = useState([
		{
			id: 0,
			name: '',
			active: true,
		},
	]);

	const [imageUploaded, setImageUploaded] = useState(false);

	const GetData = async () => {
		try {
			const countryresponse = await GetNationalityList();
			const societyresponse = await GetSocietiesList();
			setCountry(countryresponse.data);
			setSocieties(societyresponse.data);
		} catch (error) {
			console.error('Error fetching Data:', error);
		}
	};

	const fetchMember = async (memberId: any) => {
		try {
			const responseData = await fetch(`https://catholicportal.net/api/Member/GenerateId?code=1000&id=1`);
			if (responseData.ok) {
				const membershipNumber = await responseData.text();
				member.membershipNumber = membershipNumber;
			}
		} catch (error) {
			console.error('Error fetching member Code:', error);
			toast.Error('Error', 'Error fetching member code');
		}
	};

	useEffect(() => {
		fetchMember(member.id);
		GetData();
	}, []);

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setSelectedImage(file || null);
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setBase64Image(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
		setImageUploaded(true);
	};

	const handleBirthDateChange = (date: Date) => {
		setSelectedDate(date);
	};

	const handleBaptismDateChange = (date: Date) => {
		setSelectedDateOfBaptism(date);
	};

	const handleFirstCommunionDateChange = (date: Date) => {
		setSelectedDateOfCommunion(date);
	};

	const handleConfirmationDateChange = (date: Date) => {
		setSelectedDateOfConfirmation(date);
	};

	const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = event.currentTarget.selectedOptions;
		for (let i = 0; i < selectedOptions.length; i++) {
			member.societyName.push(parseInt(selectedOptions[i].value));
			selectedSocieties.push(selectedOptions[i].value);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (member.firstName == '') {
				toast.Error('Error', 'firstname cannot be empty');
				return;
			}
			if (member.lastName == '') {
				toast.Error('Error', 'lastname cannot be empty');
				return;
			}

			setIsLoading(true);
			const today = new Date();
			member.dateOfBirth = new Date(selectedDate).toISOString();
			member.baptismDate = new Date(selectedDateOfBaptism).toISOString();
			member.confirmationDate = new Date(selectedDateOfConfirmation).toISOString();
			member.firstCommunionDate = new Date(selectedDateOfCommunion).toISOString();
			member.createdDate = today.toISOString();
			member.modifiedDate = today.toISOString();

			if (member.nationalId == -1) {
				try {
					const submitCountry = await fetch('https://catholicportal.net/api/Nationalities/Save', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: 0,
							name: otherNationValue,
							active: true,
							churchId: appState?.config?.churchId,
						}),
					});

					if (submitCountry.ok) {
						const returnedOption = await submitCountry.json();

						member.nationalId = returnedOption.id;
						member.nationality = returnedOption.id.toString();
					} else {
						console.error('Error submitting form data:', submitCountry.status);
						toast.Error('Error', 'Failed to create Country. Please try again.');
					}
				} catch (error) {
					console.error('Error parsing JSON:', error);
					toast.Error('Error', 'Failed to create Society. Please try again.');
				} finally {
					setIsLoading(false);
				}
			}

			const societiesSelected = {
				selectedIds,
				otherValue: showOtherInput ? otherValue : null,
			};

			if (societiesSelected.otherValue != null) {
				// setIsLoading(true);

				try {
					const submitSociety = await fetch('https://catholicportal.net/api/Societies/Save', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: 0,
							name: societiesSelected.otherValue,
							active: false,
							churchId: appState?.config?.churchId,
						}),
					});

					if (submitSociety.ok) {
						const returnedOption = await submitSociety.json();
						setSociety({
							id: returnedOption.id,
							name: returnedOption.name,
							active: returnedOption.active,
						});

						// Add the new id to the selectedIds array
						const updatedSelectedIds = [...societiesSelected.selectedIds, returnedOption.id];

						member.societyName = updatedSelectedIds;
					} else {
						console.error('Error submitting form data:', submitSociety.status);
						toast.Error('Error', 'Failed to create Society. Please try again.');
					}
				} catch (error) {
					console.error('Error parsing JSON:', error);
					toast.Error('Error', 'Failed to create Society. Please try again.');
				} finally {
					setIsLoading(false);
				}
			}

			const formData = new FormData();
			setIsLoading(true);
			if (selectedImage) {
				formData.append('file', selectedImage);

				try {
					const response = await fetch('https://catholicportal.net/api/products/UploadImage', {
						method: 'POST',
						body: formData,
					});

					if (!response.ok) {
						const errorText = await response.text();
						console.log(errorText);
					} else {
						const imageUrl = await response.text();
						member.imageUrl = imageUrl;
						console.log(imageUrl);
					}
				} catch (error) {
					console.error(error);
				}
			}

			const response = await fetch('https://catholicportal.net/api/Member/Save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(member),
			});

			if (response.ok) {
				setMember({
					id: appState?.config?.id,
					membershipNumber: '',
					cardNumber: '',
					title: '',
					firstName: '',
					lastName: '',
					email: '',
					gender: '',
					notes: '',
					dateOfBirth: '2024-04-11 09:22:18.51+00',
					homeDistrict: '',
					region: '',
					occupation: '',
					fathersName: '',
					mothersName: '',
					phoneNumber: '',
					imageUrl: '',
					isDeceased: false,
					isMinister: false,
					createdDate: '',
					createdBy: appState?.config?.createdBy,
					modifiedDate: '',
					modifiedBy: appState?.config?.modifiedBy,
					isActive: true,
					isBaptized: false,
					house: '',
					isFirstCommunion: false,
					isConfirmed: false,
					isBelongToSociety: false,
					societyName: [0],
					placeOfStay: '',
					houseNumber: '',
					mothersTelePhone: '',
					fathersTelePhone: '',
					isMotherACatholic: true,
					isFatherACatholic: true,
					isFatherDeceased: false,
					isMotherDeceased: false,
					isFatherAMemberOfCathedral: true,
					isMotherAMemberOfCathedral: true,
					areUHomeBound: false,
					isDisabled: false,
					doYouBelongToAnyChurchApartFromMainChurch: false,
					nameOfOtherChurchYouBelongTo: '',
					churchFatherAttends: '',
					churchMotherAttends: '',
					educationalLevel: '',
					position: '',
					marritalStatus: '',
					isPayDues: false,
					reasonForPayingOrNotPayingDues: '',
					isEmployed: true,
					professionalStatus: '',
					reasonForNotWorking: '',
					isAdult: false,
					guardianName: '',
					isGuardianACatholic: true,
					isGuardianAMemberOfCathedral: true,
					churchGuardianAttends: '',
					guardianTelephone: '',
					middleName: '',
					postalAddress: '',
					marriageType: '',
					nameOfSpouse: '',
					nationality: '',
					placeOfWork: '',
					baptismNumber: '',
					baptismDate: '',
					placeOfBaptism: '',
					confirmationNumber: '',
					confirmationDate: '',
					placeOfConfirmation: '',
					firstCommunionNumber: '',
					firstCommunionDate: '',
					placeOfFirstCommunion: '',
					placeOfBirth: '',
					nationalId: appState?.config?.nationalId,
					churchId: appState?.config?.churchId,
					children: '',
					isParent: false,
				});
				setBase64Image('');

				toast.Info('Member Form Submission', 'Member Data Submitted Successfully');
				setIsLoading(false);
				window.location.reload();
			} else {
				setIsLoading(false);
				console.error('Error submitting form data:', response.status);
				toast.Error('Error', 'Failed to create member. Please try again.');
				// Handle error
			}
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	const webcamRef = React.useRef(null);

	const capture = () => {
		setBase64Image(webcamRef?.current.getScreenshot() as string);
	};

	return (
		<>
			{isLoading ? (
				<Transition show={loading} as={Fragment}>
					<Dialog onClose={done} className='fixed z-10 inset-0 overflow-y-auto'>
						<div className='flex items-center justify-center min-h-screen'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0'
								enterTo='opacity-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
							>
								<div className='fixed inset-0 bg-black opacity-30' />
							</Transition.Child>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[80%] sm:p-10 items-center'>
									<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto'></div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition>
			) : (
				<Transition show={isOpen} as={Fragment}>
					<Dialog onClose={onClose} className='fixed z-10 inset-0 overflow-y-auto'>
						<div className='flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0'
								enterTo='opacity-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
							>
								<div className='fixed inset-0 bg-black opacity-30' />
							</Transition.Child>

							<span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
								&#8203;
							</span>

							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  w-[50%] sm:p-10'>
									<div className='flex justify-between items-start'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 font-bold text-gray-900 uppercase'
										>
											Add Member
										</Dialog.Title>
										<Icons.Close
											type='button'
											className='w-4 h-5 hover:cursor-pointer rounded-full font-bold text-2xl'
											onClick={onClose}
										/>
									</div>
									<div className='mt-2'>
										<div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
											<div
												className={`bg-blue-600 h-2.5 rounded-full transition-all duration-500 ${
													step === 1
														? 'w-1/5'
														: step === 2
														? 'w-2/5'
														: step === 3
														? 'w-3/5'
														: step === 4
														? 'w-4/5'
														: 'w-full'
												}`}
											></div>
										</div>
										<form id='memberForm' onSubmit={handleSubmit}>
											{step === 1 && (
												<div>
													<div className='flex flex-row gap-10 w-full'>
														<div className='mb-10 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='image'
															>
																Profile Image
															</label>
															{!base64Image && (
																<Container>
																	<Grid container spacing={3}>
																		<Grid item xs={12} md={6}>
																			<Paper
																				elevation={3}
																				style={{
																					padding: '20px',
																					textAlign: 'center',
																				}}
																			>
																				<Webcam
																					audio={false}
																					ref={webcamRef}
																					screenshotFormat='image/jpeg'
																					width='100%'
																				/>
																				<Button
																					variant='contained'
																					color='primary'
																					onClick={capture}
																					style={{marginTop: '20px'}}
																				>
																					Capture Photo
																				</Button>
																			</Paper>
																		</Grid>
																	</Grid>
																</Container>
															)}

															{base64Image && (
																<LazyLoadImage
																	src={base64Image}
																	alt='Uploaded'
																	style={{maxWidth: '100%'}}
																/>
															)}
															<input
																{...register('imageUrl', {required: true})}
																// value={member.imageUrl}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='image'
																type='file'
																accept='image/*'
																onChange={handleImageUpload}
															/>

															{errors.image && (
																<span className='text-red-500 text-xs italic'>
																	Image is required.
																</span>
															)}
														</div>
														<div className='flex flex-col gap-2 w-full'>
															<div className='flex flex-row gap-6 w-full'>
																<div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='membershipNumber'
																	>
																		Membership Number
																	</label>
																	<input
																		{...register('membershipNumber', {
																			required: true,
																		})}
																		name='membershipNumber'
																		value={member.membershipNumber}
																		onChange={(e) =>
																			setMember({
																				...member,
																				membershipNumber: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='membershipNumber'
																		type='text'
																		disabled
																	/>
																	{errors.membershipNumber && (
																		<span className='text-red-500 text-xs italic'>
																			Membership number is required.
																		</span>
																	)}
																</div>
																{/* <div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='title'
																	>
																		Title
																	</label>
																	<select
																		{...register('title', {required: true})}
																		value={member.title}
																		onChange={(e) =>
																			setMember({
																				...member,
																				title: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='title'
																		// type="dropdown"
																	>
																		<option value={''}>Select title</option>
																		<option value={'Mr'}>Mr</option>
																		<option value={'Mrs'}>Mrs</option>
																		<option value={'Miss'}>Miss</option>
																		<option value={'Rev Fr'}>Rev Fr</option>
																		<option value={'Dr'}>Dr</option>
																		<option value={'Prof'}>Prof</option>
																	</select>
																	{errors.membershipNumber && (
																		<span className='text-red-500 text-xs italic'>
																			Title is required.
																		</span>
																	)}
																</div> */}

																{/* <div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='title'
																	>
																		House
																	</label>
																	<select
																		{...register('tihousetle', {required: true})}
																		value={member.house}
																		onChange={(e) =>
																			setMember({
																				...member,
																				house: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='house'
																		// type="dropdown"
																	>
																		<option value={''}>Select House</option>
																		<option value={'Aggrey'}>Aggrey</option>
																		<option value={'Guggisberg'}>Guggisberg</option>
																		<option value={'Gyamfi'}>Gyamfi</option>
																		<option value={'Cadbury'}>Cadbury</option>
																		<option value={'Lugard'}>Lugard</option>
																		<option value={'Livingstone'}>
																			Livingstone
																		</option>
																		<option value={'Fraser'}>Aggrey</option>
																		<option value={'Kwapong'}>Kwapong</option>
																		<option value={'Kingsley'}>Kingsley</option>
																		<option value={'McCarthy'}>McCarthy</option>
																		<option value={'Slessor'}>Slessor</option>
																		<option value={'Clark'}>Clark</option>
																		<option value={'S.O.A'}>S.O.A</option>
																		<option value={'Baeta'}>Baeta</option>
																		<option value={'Stopford'}>Stopford</option>
																		<option value={'Atta Mills'}>Atta Mills</option>
																		<option value={'Aryee'}>Aryee</option>
																	</select>
																	{errors.membershipNumber && (
																		<span className='text-red-500 text-xs italic'>
																			Title is required.
																		</span>
																	)}
																</div> */}
															</div>

															<div className='flex flex-row gap-6 w-full'>
																<div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='firstName'
																	>
																		First Name (s)
																	</label>
																	<input
																		{...register('firstName', {required: true})}
																		value={member.firstName}
																		onChange={(e) =>
																			setMember({
																				...member,
																				firstName: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='firstName'
																		type='text'
																	/>
																	{errors.firstName && (
																		<span className='text-red-500 text-xs italic'>
																			First name is required.
																		</span>
																	)}
																</div>

																<div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='lastName'
																	>
																		Last Name
																	</label>
																	<input
																		{...register('lastName', {required: true})}
																		value={member.lastName}
																		onChange={(e) =>
																			setMember({
																				...member,
																				lastName: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='lastName'
																		type='text'
																	/>
																	{errors.lastName && (
																		<span className='text-red-500 text-xs italic'>
																			Last name is required.
																		</span>
																	)}
																</div>
															</div>

															<div className='flex flex-row gap-6 w-full mb-10'>
																<div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='middleName'
																	>
																		Middle Name (s)
																	</label>
																	<input
																		{...register('middleName', {required: false})}
																		value={member.middleName}
																		onChange={(e) =>
																			setMember({
																				...member,
																				middleName: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='middleName'
																		type='text'
																	/>
																	{errors.middleName && (
																		<span className='text-red-500 text-xs italic'>
																			Middle name is required.
																		</span>
																	)}
																</div>

																<div className='w-1/2'>
																	<label
																		className='block text-gray-700 text-sm font-bold mb-2'
																		htmlFor='gender'
																	>
																		Gender
																	</label>
																	<select
																		{...register('gender', {required: true})}
																		value={member.gender}
																		onChange={(e) =>
																			setMember({
																				...member,
																				gender: e.target.value,
																			})
																		}
																		className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		id='gender'
																		// type="dropdown"
																	>
																		<option value={''}>Select gender...</option>
																		<option value={'Male'}>Male</option>
																		<option value={'Female'}>Female</option>
																	</select>
																	{errors.lastName && (
																		<span className='text-red-500 text-xs italic'>
																			Gender is required.
																		</span>
																	)}
																</div>
															</div>
														</div>
													</div>

													<div className='flex flex-row justify-evenly mb-10'>
														<div className='flex flex-row gap-5 items-center'>
															<label
																className='block text-gray-700 text-sm font-bold'
																htmlFor='isBaptized'
															>
																Are you a baptized Catholic?
															</label>
															<input
																{...register('isBaptized', {required: true})}
																checked={member.isBaptized}
																onChange={(e) =>
																	setMember({...member, isBaptized: e.target.checked})
																}
																className='rounded w-4 h-4 py-2 px-3'
																id='isBaptized'
																type='checkbox'
															/>
															{errors.isBaptized && (
																<span className='text-red-500 text-xs italic'>
																	This is required.
																</span>
															)}
														</div>
														<div className='flex flex-row gap-5 items-center'>
															<label
																className='block text-gray-700 text-sm font-bold'
																htmlFor='isFirstCommunion'
															>
																Are you a Communicant?
															</label>
															<input
																{...register('isFirstCommunion', {required: true})}
																checked={member.isFirstCommunion}
																onChange={(e) =>
																	setMember({
																		...member,
																		isFirstCommunion: e.target.checked,
																	})
																}
																className='rounded w-4 h-4 py-2 px-3'
																id='isFirstCommunion'
																type='checkbox'
															/>
															{errors.isFirstCommunion && (
																<span className='text-red-500 text-xs italic'>
																	This is required.
																</span>
															)}
														</div>
														<div className='flex flex-row gap-5 items-center'>
															<label
																className='block text-gray-700 text-sm font-bold'
																htmlFor='isConfirmed'
															>
																Have you received Confirmation?
															</label>
															<input
																{...register('isConfirmed', {required: true})}
																checked={member.isConfirmed}
																onChange={(e) =>
																	setMember({
																		...member,
																		isConfirmed: e.target.checked,
																	})
																}
																className='rounded w-4 h-4 py-2 px-3'
																id='isConfirmed'
																type='checkbox'
															/>
															{errors.isFirstCommunion && (
																<span className='text-red-500 text-xs italic'>
																	This is required.
																</span>
															)}
														</div>
													</div>

													<div className=''>
														<button
															type='button'
															onClick={() => setStep(2)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline float-right'
														>
															Next
														</button>
													</div>
												</div>
											)}
											{step === 2 && (
												<div>
													{member.isBaptized && (
														<div className='flex flex-row gap-5 w-full'>
															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='baptismDate'
																>
																	Date Of Baptism
																</label>
																<DatePicker
																	{...register('baptismDate', {required: true})}
																	value={member.baptismDate}
																	onChange={handleBaptismDateChange}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='baptismDate'
																/>
																{errors.baptismDate && (
																	<span className='text-red-500 text-xs italic'>
																		Baptism date is required.
																	</span>
																)}
															</div>

															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='placeOfBaptism'
																>
																	Place Of Baptism
																</label>
																<input
																	{...register('placeOfBaptism', {required: true})}
																	value={member.placeOfBaptism}
																	onChange={(e) =>
																		setMember({
																			...member,
																			placeOfBaptism: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='placeOfBaptism'
																	type='text'
																	placeholder='Enter place of baptism'
																/>
																{errors.placeOfBaptism && (
																	<span className='text-red-500 text-xs italic'>
																		Place of birth is required.
																	</span>
																)}
															</div>

															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='baptismNumber'
																>
																	N.L.B
																</label>
																<input
																	{...register('baptismNumber', {required: true})}
																	value={member.baptismNumber}
																	onChange={(e) =>
																		setMember({
																			...member,
																			baptismNumber: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='baptismNumber'
																	type='text'
																	placeholder='Enter NLB number'
																/>
																{errors.placeOfBaptism && (
																	<span className='text-red-500 text-xs italic'>
																		N.L.B is required.
																	</span>
																)}
															</div>
														</div>
													)}

													{member.isFirstCommunion && (
														<div className='flex flex-row gap-5 w-full'>
															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='firstCommunionDate'
																>
																	Date of First Communion
																</label>
																<DatePicker
																	{...register('firstCommunionDate', {
																		required: true,
																	})}
																	value={member.firstCommunionDate}
																	onChange={handleFirstCommunionDateChange}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='firstCommunionDate'
																/>
																{errors.firstCommunionDate && (
																	<span className='text-red-500 text-xs italic'>
																		First communion date is required.
																	</span>
																)}
															</div>

															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='placeOfFirstCommunion'
																>
																	Place Of First Communion
																</label>
																<input
																	{...register('placeOfFirstCommunion', {
																		required: true,
																	})}
																	value={member.placeOfFirstCommunion}
																	onChange={(e) =>
																		setMember({
																			...member,
																			placeOfFirstCommunion: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='placeOfFirstCommunion'
																	type='text'
																	placeholder='Enter place of baptism'
																/>
																{errors.placeOfFirstCommunion && (
																	<span className='text-red-500 text-xs italic'>
																		Place of first communion is required.
																	</span>
																)}
															</div>

															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='baptismNumber'
																>
																	N.L.C
																</label>
																<input
																	{...register('baptismNumber', {required: true})}
																	value={member.baptismNumber}
																	onChange={(e) =>
																		setMember({
																			...member,
																			baptismNumber: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='baptismNumber'
																	type='text'
																	placeholder='Enter NLC number'
																/>
																{errors.baptismNumber && (
																	<span className='text-red-500 text-xs italic'>
																		N.L.C number is required.
																	</span>
																)}
															</div>
														</div>
													)}
													{member.isConfirmed && (
														<div className='flex flex-row gap-5 w-full mb-5'>
															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='confirmationDate'
																>
																	Date Of Confirmation
																</label>
																<DatePicker
																	{...register('placeOfConfirmation', {
																		required: true,
																	})}
																	value={member.confirmationDate}
																	onChange={handleConfirmationDateChange}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='confirmationDate'
																/>
																{errors.confirmationDate && (
																	<span className='text-red-500 text-xs italic'>
																		Confirmation date is required.
																	</span>
																)}
															</div>

															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='placeOfConfirmation'
																>
																	Place Of Confirmation
																</label>
																<input
																	{...register('placeOfConfirmation', {
																		required: true,
																	})}
																	value={member.placeOfConfirmation}
																	onChange={(e) =>
																		setMember({
																			...member,
																			placeOfConfirmation: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='placeOfConfirmation'
																	type='text'
																	placeholder='Enter place of Confirmation'
																/>
																{errors.placeOfConfirmation && (
																	<span className='text-red-500 text-xs italic'>
																		Place of confirmation is required.
																	</span>
																)}
															</div>

															<div className='mb-4 w-1/3'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='confirmationNumber'
																>
																	N.L Conf.
																</label>
																<input
																	{...register('confirmationNumber', {
																		required: true,
																	})}
																	value={member.confirmationNumber}
																	onChange={(e) =>
																		setMember({
																			...member,
																			confirmationNumber: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='confirmationNumber'
																	type='text'
																	placeholder='Enter NLC number'
																/>
																{errors.confirmationNumber && (
																	<span className='text-red-500 text-xs italic'>
																		N.L.C number is required.
																	</span>
																)}
															</div>
														</div>
													)}

													<div className='flex flex-row gap-10 w-full'>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='dateOfBirth'
															>
																Birth Date
															</label>
															<DatePicker
																{...register('dateOfBirth', {required: true})}
																value={member.dateOfBirth}
																onChange={handleBirthDateChange}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='dateOfBirth'
															/>
															{errors.dateOfBirth && (
																<span className='text-red-500 text-xs italic'>
																	Birth date is required.
																</span>
															)}
														</div>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='placeOfBirth'
															>
																Place Of Birth
															</label>
															<input
																{...register('placeOfBirth', {required: true})}
																value={member.placeOfBirth}
																onChange={(e) =>
																	setMember({...member, placeOfBirth: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='placeOfBirth'
																type='text'
															/>
															{errors.placeOfBirth && (
																<span className='text-red-500 text-xs italic'>
																	Place of birth is required.
																</span>
															)}
														</div>
													</div>

													<div className='flex flex-row gap-10 w-full'>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='homeDistrict'
															>
																Hometown
															</label>
															<input
																{...register('homeDistrict', {required: true})}
																value={member.homeDistrict}
																onChange={(e) =>
																	setMember({...member, homeDistrict: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='homeDistrict'
																type='text'
															/>
															{errors.homeDistrict && (
																<span className='text-red-500 text-xs italic'>
																	Hometown is required.
																</span>
															)}
														</div>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='nationality'
															>
																Nationality
															</label>
															<select
																value={member.nationality}
																onChange={(e) =>
																	setMember({...member, nationality: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='nationality'
															>
																<option value={''}>Select country</option>
																{countries.map(({id, name}) => (
																	<option key={id} value={id}>
																		{name}
																	</option>
																))}
																<option value={-1}>Other</option>
															</select>
															{errors.nationality && (
																<span className='text-red-500 text-xs italic'>
																	Nationality is required.
																</span>
															)}
														</div>

														{member.nationality == '-1' && (
															<div>
																<label htmlFor='otherInput'>Please specify:</label>
																<input
																	type='text'
																	id='otherInput'
																	value={otherNationValue}
																	onChange={handleOtherNationInputChange}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																/>
															</div>
														)}
													</div>

													<div className='flex flex-row gap-10 w-full mb-8'>
														<div className='w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='placeOfStay'
															>
																Place of stay
															</label>
															<input
																{...register('placeOfStay', {required: true})}
																value={member.placeOfStay}
																onChange={(e) =>
																	setMember({...member, placeOfStay: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='placeOfStay'
																type='text'
																placeholder='Where do you live?'
															/>
															{errors.placeOfStay && (
																<span className='text-red-500 text-xs italic'>
																	Place of stay is required.
																</span>
															)}
														</div>
														<div className='w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='houseNumber'
															>
																House Address or GPS Address
															</label>
															<input
																{...register('houseNumber', {required: true})}
																value={member.houseNumber}
																onChange={(e) =>
																	setMember({...member, houseNumber: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='houseNumber'
																type='text'
															/>
															{errors.houseNumber && (
																<span className='text-red-500 text-xs italic'>
																	Hometown is required.
																</span>
															)}
														</div>
													</div>

													<div className='float-right'>
														<button
															type='button'
															onClick={() => setStep(1)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
														>
															Previous
														</button>
														<button
															type='button'
															onClick={() => setStep(3)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
														>
															Next
														</button>
													</div>
												</div>
											)}
											{step === 3 && (
												<div>
													<div className=' flex flex-row gap-6 w-full'>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='email'
															>
																Email
															</label>
															<input
																{...register('email', {required: true})}
																value={member.email}
																onChange={(e) =>
																	setMember({...member, email: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='email'
																type='email'
															/>
															{errors.email && (
																<span className='text-red-500 text-xs italic'>
																	Email is required.
																</span>
															)}
														</div>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='phoneNumber'
															>
																Phone number
															</label>
															<input
																{...register('phoneNumber', {required: true})}
																value={member.phoneNumber}
																onChange={(e) =>
																	setMember({...member, phoneNumber: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='phoneNumber'
																type='number'
																placeholder='Enter phone number'
																min={0}
																max={9}
															/>
															{errors.phoneNumber && (
																<span className='text-red-500 text-xs italic'>
																	Phone number is required.
																</span>
															)}
														</div>
													</div>

													<div className='flex flex-row gap-6 w-full'>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='occupation'
															>
																Occupation
															</label>
															<input
																{...register('occupation', {required: true})}
																value={member.occupation}
																onChange={(e) =>
																	setMember({...member, occupation: e.target.value})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='occupation'
																type='text'
															/>
															{errors.occupation && (
																<span className='text-red-500 text-xs italic'>
																	Occupation is required.
																</span>
															)}
														</div>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='professionalStatus'
															>
																Employment Status
															</label>
															<select
																{...register('professionalStatus', {required: true})}
																value={member.professionalStatus}
																onChange={handleEmploymentStatusChange}
																// onChange={(e) => setMember({ ...member, professionalStatus: e.target.value })}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='professionalStatus'
															>
																<option value={''}>Select employment status</option>
																<option value={'Employed'}>Employed</option>
																<option value={'Unemployed'}>Unemployed</option>
																<option value={'Student'}>Student</option>
																<option value={'Self Employed'}>Self Employed</option>
															</select>
															{errors.professionalStatus && (
																<span className='text-red-500 text-xs italic'>
																	Employment Status is required.
																</span>
															)}
														</div>
													</div>

													<div className='flex flex-row gap-6 w-full'>
														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='educationalLevel'
															>
																Academic Qualification
															</label>
															<select
																{...register('educationalLevel', {required: true})}
																value={member.educationalLevel}
																onChange={(e) =>
																	setMember({
																		...member,
																		educationalLevel: e.target.value,
																	})
																}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='educationalLevel'
															>
																<option value={''}>
																	Select academic qualification
																</option>
																<option value={'Tertiary'}>Tertiary</option>
																<option value={'Secondry'}>Secondry</option>
																<option value={'Junior High/Middle School'}>
																	Junior High/Middle School
																</option>
																<option value={'None'}>None</option>
															</select>
															{errors.professionalStatus && (
																<span className='text-red-500 text-xs italic'>
																	Academic qualification is required.
																</span>
															)}
														</div>

														<div className='mb-4 w-1/2'>
															<label
																className='block text-gray-700 text-sm font-bold mb-2'
																htmlFor='marritalStatus'
															>
																Marital Status
															</label>
															<select
																{...register('marritalStatus', {required: true})}
																value={member.marritalStatus}
																// onChange={(e) => setMember({ ...member, marritalStatus: e.target.value })}
																onChange={handleMarritalStatusChange}
																className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																id='marritalStatus'
															>
																<option value={''}>Select marital status</option>
																<option value={'Single'}>Single</option>
																<option value={'Married'}>Married</option>
																<option value={'Divorced'}>Divorcee</option>
																<option value={'Widowed'}>Widowed</option>
																{/* <option value={"Widower"}>Widower</option> */}
															</select>
															{errors.marritalStatus && (
																<span className='text-red-500 text-xs italic'>
																	Marital status is required.
																</span>
															)}
														</div>
													</div>
													<div className='float-right'>
														<button
															type='button'
															onClick={() => setStep(2)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
														>
															Previous
														</button>
														<button
															type='button'
															onClick={() => setStep(4)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
														>
															Next
														</button>
													</div>
												</div>
											)}
											{step === 4 && (
												<div>
													{showPlaceOfWork && (
														<>
															<div className='mb-4'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='placeOfWork'
																>
																	Place of work
																</label>
																<input
																	{...register('placeOfWork', {required: true})}
																	value={member.placeOfWork}
																	onChange={(e) =>
																		setMember({
																			...member,
																			placeOfWork: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='placeOfWork'
																	type='text'
																	placeholder='Enter place of work'
																/>
																{errors.placeOfWork && (
																	<span className='text-red-500 text-xs italic'>
																		Place of work is required.
																	</span>
																)}
															</div>
														</>
													)}
													{showMarriageFields && (
														<>
															<div className='mb-4'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='marriageType'
																>
																	Marriage Type
																</label>
																<select
																	{...register('marriageType', {required: true})}
																	value={member.marriageType}
																	onChange={(e) =>
																		setMember({
																			...member,
																			marriageType: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='marriageType'
																>
																	<option value={''}>Select marriage type</option>
																	<option value={'Church'}>Church</option>
																	<option value={'Civil'}>Civil</option>
																	<option value={'Customary'}>Customary</option>
																</select>
																{errors.marriageType && (
																	<span className='text-red-500 text-xs italic'>
																		Marriage type is required.
																	</span>
																)}
															</div>
															<div className='mb-4'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='nameOfSpouse'
																>
																	Name Of Spouse
																</label>
																<input
																	{...register('nameOfSpouse', {required: true})}
																	value={member.nameOfSpouse}
																	onChange={(e) =>
																		setMember({
																			...member,
																			nameOfSpouse: e.target.value,
																		})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='nameOfSpouse'
																	type='text'
																/>
																{errors.nameOfSpouse && (
																	<span className='text-red-500 text-xs italic'>
																		Name of spouse is required.
																	</span>
																)}
															</div>
														</>
													)}

													<div className='mb-4'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='cardNumber'
														>
															Ghana Card Number
														</label>
														<input
															{...register('cardNumber', {required: true})}
															value={member.cardNumber}
															onChange={(e) =>
																setMember({...member, cardNumber: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															id='cardNumber'
															type='text'
															placeholder='GHA-000000000-0'
															maxLength={15}
														/>
														{errors.cardNumber && (
															<span className='text-red-500 text-xs italic'>
																Card number is required.
															</span>
														)}
													</div>
													<div className='mb-10'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='region'
														>
															Region
														</label>
														<select
															{...register('region', {required: true})}
															value={member.region}
															onChange={(e) =>
																setMember({...member, region: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															id='region'
														>
															<option value={''}>Select region of fellowship</option>
															<option value={'Ashanti'}>Ashanti</option>
															<option value={'Ahafo'}>Ahafo</option>
															<option value={'Bono East'}>Bono East</option>
															<option value={'Bono'}>Bono</option>
															<option value={'Central'}>Central</option>
															<option value={'Eastern'}>Eastern</option>
															<option value={'Greater Accra'}>Greater Accra</option>
															<option value={'Northern'}>Northern</option>
															<option value={'Upper West'}>Upper West</option>
															<option value={'Upper East'}>Upper East</option>
															<option value={'Volta'}>Volta</option>
															<option value={'Western'}>Western</option>
															<option value={'Savannah'}>Savannah</option>
															<option value={'Oti'}>Oti</option>
															<option value={'Western North'}>Western North</option>
															<option value={'North East'}>Upper East</option>
														</select>
														{errors.occupation && (
															<span className='text-red-500 text-xs italic'>
																Region is required.
															</span>
														)}
													</div>

													<div className='flex flex-row justify-evenly mb-10'>
														<div className='mb-4 flex flex-row items-center w-1/4 justify-between'>
															<label
																className='block text-gray-700 text-sm font-bold'
																htmlFor='isBelongToSociety'
															>
																Do you belong to any society(ies)?
															</label>
															<input
																{...register('isBelongToSociety', {required: true})}
																checked={member.isBelongToSociety}
																onChange={handleSocieties}
																// onChange={(e) => setMember({ ...member, isBelongToSociety: e.target.checked })}
																className='rounded w-4 h-4 py-2 px-3'
																id='isBelongToSociety'
																type='checkbox'
															/>
															{errors.isBelongToSociety && (
																<span className='text-red-500 text-xs italic'>
																	This is required.
																</span>
															)}
														</div>

														{/* <div className="mb-4 flex flex-row items-center w-1/4 justify-between">
                                                        <label className="block text-gray-700 text-sm font-bold" htmlFor="isDeceased">
                                                            Is the member deceased?
                                                        </label>
                                                        <input
                                                            {...register("isDeceased", { required: true })}
                                                            checked={member.isDeceased}
                                                            onChange={(e) => setMember({ ...member, isDeceased: e.target.checked })}
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
                                                            checked={member.isMinister}
                                                            onChange={(e) => setMember({ ...member, isMinister: e.target.checked })}
                                                            className="rounded w-4 h-4 py-2 px-3"
                                                            id="isMinister"
                                                            type="checkbox"
                                                        />
                                                        {errors.isMinister && <span className="text-red-500 text-xs italic">This is required.</span>}
                                                    </div> */}

														<div className='mb-4 flex flex-row items-center w-1/4 justify-between'>
															<label
																className='block text-gray-700 text-sm font-bold'
																htmlFor='isActive'
															>
																Is this an active member?
															</label>
															<input
																{...register('isActive', {required: true})}
																checked={member.isActive}
																onChange={(e) =>
																	setMember({...member, isActive: e.target.checked})
																}
																className='rounded w-4 h-4 py-2 px-3'
																id='isActive'
																type='checkbox'
															/>
															{errors.isActive && (
																<span className='text-red-500 text-xs italic'>
																	This is required.
																</span>
															)}
														</div>

														<div className='mb-5 flex flex-row items-center w-1/4 justify-between'>
															<label
																className='block text-gray-700 text-sm font-bold'
																htmlFor='isParent'
															>
																Do you have children?
															</label>
															<input
																{...register('isParent', {required: true})}
																checked={member.isParent}
																onChange={handleChildren}
																// onChange={(e) => setMember({ ...member, isParent: e.target.checked })}
																className='rounded w-4 h-4 py-2 px-3'
																id='isParent'
																type='checkbox'
															/>
															{errors.isParent && (
																<span className='text-red-500 text-xs italic'>
																	This is required.
																</span>
															)}
														</div>
													</div>
													<div className='float-right'>
														<button
															type='button'
															onClick={() => setStep(3)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
														>
															Previous
														</button>
														<button
															type='button'
															onClick={() => setStep(5)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
														>
															Next
														</button>
													</div>
												</div>
											)}
											{step === 5 && (
												<div>
													{showChildren && (
														<>
															<div className='mb-4'>
																<label
																	className='block text-gray-700 text-sm font-bold mb-2'
																	htmlFor='children'
																>
																	Names of children
																</label>
																<textarea
																	{...register('children', {required: true})}
																	value={member.children}
																	onChange={(e) =>
																		setMember({...member, children: e.target.value})
																	}
																	className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																	id='children'
																	placeholder='Enter names of children'
																/>
																{errors.children && (
																	<span className='text-red-500 text-xs italic'>
																		Names of children is required.
																	</span>
																)}
															</div>
														</>
													)}

													{showSocieties && (
														<>
															<div className='my-10'>
																<label htmlFor='selectedSocieties'>
																	Select Societies:
																</label>
																<div id='dropdown'>
																	{societies.map((option) => (
																		<div
																			key={option.id}
																			className='flex flex-row gap-4 my-2 items-center'
																		>
																			<input
																				type='checkbox'
																				id={option.id.toString()}
																				value={option.name}
																				onChange={handleOptionChange}
																				className='rounded w-4 h-4 py-2 px-3'
																			/>
																			<label htmlFor={option.id.toString()}>
																				{option.name}
																			</label>
																		</div>
																	))}
																</div>
																<div className='flex flex-row gap-4 my-2 items-center'>
																	<input
																		type='checkbox'
																		id='other'
																		value='Other'
																		onChange={handleOptionChange}
																		className='rounded w-4 h-4 py-2 px-3'
																	/>
																	<label htmlFor='other'>Other</label>
																</div>
																{showOtherInput && (
																	<div>
																		<label htmlFor='otherInput'>
																			Please specify:
																		</label>
																		<input
																			type='text'
																			id='otherInput'
																			value={otherValue}
																			onChange={handleOtherInputChange}
																			className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
																		/>
																	</div>
																)}
															</div>
														</>
													)}
													<div className='mb-4'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='notes'
														>
															Notes
														</label>
														<textarea
															{...register('notes', {required: false})}
															value={member.notes}
															onChange={(e) =>
																setMember({...member, notes: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															id='children'
															placeholder='Add notes'
														/>
														{errors.children && (
															<span className='text-red-500 text-xs italic'>
																Names of children is required.
															</span>
														)}
													</div>
													<div className='float-right'>
														<button
															type='button'
															onClick={() => setStep(4)}
															className='hover:bg-gray-700 hover:text-white text-black font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2'
														>
															Previous
														</button>
														<button
															type='submit'
															className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline'
														>
															Submit
														</button>
													</div>
												</div>
											)}
										</form>
									</div>
								</div>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition>
			)}

			<Toast position='top-right' onInit={(e) => (toast = e)} />
		</>
	);
};

export default AddMemberModal;
