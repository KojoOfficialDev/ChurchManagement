import React, {useState, useEffect, FormEvent, Fragment} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import {MtnButton} from '../../layout/MtnButton';
import {Dialog, Transition} from '@headlessui/react';
import {IToastHandler, Toast} from '../../layout/Toast';
import DatePicker from 'react-flatpickr';
import useRedirectToAdminPage from '../auth/login/AuthRedirect';
import {getConfig} from '../../../core/utility';
import {Icons} from '../../Assets';
import {RootState} from '../../../core/stores';
import {IAppState} from '../../../core/interfaces';

interface EditBaptismModalProps {
	isOpen: boolean;
	onClose: () => void;
	rowData: any;
	loading: boolean;
	done: () => void;
	isView: boolean;
}

const EditBaptismModal: React.FC<EditBaptismModalProps> = ({isOpen, onClose, rowData, loading, done, isView}) => {
	const {
		register,
		formState: {errors},
	} = useForm();
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [selectedBaptismDate, setSelectedBaptismDate] = useState(new Date());
	const [selectedDateOfBirth, setSelectedDateOfBirth] = useState(new Date());

	const appState = useSelector<RootState, IAppState>((state) => state.app);

	const [formData, setFormData] = useState({
		id: appState?.config?.id,
		memberId: '',
		baptismNumber: '',
		baptismDate: '',
		placeOfBaptism: '',
		firstName: '',
		middleName: '',
		lastName: '',
		placeOfBirth: '',
		dateOfBirth: '',
		parentsName: '',
		homeDistrict: '',
		godParent: '',
		fathersName: '',
		mothersName: '',
		revMinister: '',
		ministerId: appState?.config?.ministerId,
		createdDate: '',
		createdBy: appState?.config?.createdBy,
		modifiedDate: '',
		modifiedBy: appState?.config?.modifiedBy,
		isActive: true,
		churchId: appState?.config?.churchId,
		baptismDOB : "",
	});

	
	useEffect(() => {
		if (isOpen && rowData) {
			setFormData({
				id: rowData.id || appState?.config?.id,
				memberId: rowData.memberId || '',
				baptismNumber: rowData.baptismNumber || '',
				baptismDate: rowData.baptismDate ? new Date(rowData.baptismDate).toISOString().split('T')[0] : '',
				placeOfBaptism: rowData.placeOfBaptism || '',
				firstName: rowData.firstName || '',
				middleName: rowData.middleName || '',
				lastName: rowData.lastName || '',
				placeOfBirth: rowData.placeOfBirth || '',
				dateOfBirth: rowData.dateOfBirth || '',
				parentsName: rowData.parentsName || '',
				homeDistrict: rowData.homeDistrict || '',
				godParent: rowData.godParent || '',
				fathersName: rowData.fathersName || '',
				mothersName: rowData.mothersName || '',
				baptismDOB : rowData.baptismDOB || '',
				revMinister: rowData.revMinister || '',
				ministerId: rowData.ministerId || appState?.config?.ministerId,
				createdDate: rowData.createdDate || '',
				createdBy: rowData.createdBy || appState?.config?.createdBy,
				modifiedDate: rowData.modifiedDate || '',
				modifiedBy: rowData.modifiedBy || appState?.config?.modifiedBy,
				isActive: rowData.isActive || true,
				churchId: appState?.config?.churchId,

			});
		 	setSelectedBaptismDate(new Date(new Date(rowData.baptismDate).toISOString().split('T')[0]))
		}
	}, [isOpen, rowData]);

	const handleBirthDateChange = (date: Date) => {
		setSelectedDateOfBirth(date);
	};

	const handleBaptismDateChange = (date: Date) => {
		setSelectedBaptismDate(date);
	};

	const dispatch = useDispatch();
	let toast: IToastHandler;

	const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// setIsloading(true);
		if (formData.firstName == '') {
			toast.Error('Error', 'firstname cannot be empty');
			return;
		}
		if (formData.lastName == '') {
			toast.Error('Error', 'lastname cannot be empty');
			return;
		}
		if (formData.baptismNumber == '') {
			toast.Error('Error', 'NLB cannot be empty');
			return;
		}

		if (formData.revMinister == '') {
			toast.Error('Error', 'Please Enter a Minister');
			return;
		}

		const today = new Date();
		 
		formData.baptismDate = new Date(selectedBaptismDate).toISOString();
		formData.dateOfBirth = today.toISOString();
		formData.modifiedDate = today.toISOString();
		formData.createdDate = today.toISOString();

		setIsloading(true);
		console.log(JSON.stringify(formData))
		const response = await fetch('https://catholicportal.net/api/Baptism/Update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			setIsloading(false);
			toast.Info('Baptism Form Submission', 'baptism Data Updated Successfully');
			window.location.reload();
		} else {
			setIsloading(false);
			console.error('Error submitting form data:', response.status);
			toast.Error('Error', 'Failed to Update baptism. Please try again.');
			// Handle error
		}
	};

	if (!isOpen) return null;

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
					<Dialog onClose={onClose} className={`fixed z-10 inset-0 overflow-y-auto`}>
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
								<div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle  w-[80%] sm:p-10'>
									<div className='flex justify-between items-start mb-4 border-b-2 border-red-50'>
										<Dialog.Title
											as='h3'
											className='text-lg leading-6 font-bold text-gray-900 uppercase'
										>
											Edit Baptism
										</Dialog.Title>
										<Icons.Close
											type='button'
											className='w-4 h-5 hover:cursor-pointer rounded-full font-bold text-2xl'
											onClick={onClose}
										/>
									</div>
									<div className='mt-2'>
										<form onSubmit={onFormSubmit}>
											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='baptismNumber'
													>
														N.L.B Number
													</label>
													<input
														{...register('baptismNumber', {required: true})}
														value={formData.baptismNumber}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, baptismNumber: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter N.L.B number'
														id='baptismNumber'
														type='text'
														name='baptismNumber'
														disabled={isView}
													/>
													{errors.baptismNumber && (
														<span className='text-red-500 text-xs italic'>
															Baptism number is required.
														</span>
													)}
												</div>

												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='baptismDate'
													>
														Baptism date
													</label>
													<DatePicker
														{...register('baptismDate', {required: true})}
														value={formData.baptismDate}
														onChange={handleBaptismDateChange}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														id='baptismDate'
                                                        disabled={isView}
														
													/>
													<input
														type='hidden'
														name='id'
														value={formData.id}
														onChange={(e) =>
															setFormData({...formData, id: e.target.valueAsNumber})
														}
														disabled={isView}
													/>
													{errors.baptismDate && (
														<span className='text-red-500 text-xs italic'>
															Baptism date is required.
														</span>
													)}
												</div>
											</div>

											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='firstName'
													>
														First Name
													</label>
													<input
														{...register('firstName', {required: true})}
														value={formData.firstName}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, firstName: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter first name'
														id='firstName'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.firstName && (
														<span className='text-red-500 text-xs italic'>
															First name is required.
														</span>
													)}
												</div>

												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='placeOfBaptism'
													>
														Place of baptism
													</label>
													<input
														{...register('placeOfBaptism', {required: true})}
														value={formData.placeOfBaptism}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, placeOfBaptism: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder="Enter Place Of Baptism"
														id='placeOfBaptism'
														type='text'
														name='placeOfBaptism'
														disabled={isView}
													/>
													{errors.placeOfBaptism && (
														<span className='text-red-500 text-xs italic'>
															Place of baptism is required.
														</span>
													)}
												</div>
											</div>

											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='middleName'
													>
														Middle name
													</label>
													<input
														{...register('middleName', {required: false})}
														value={formData.middleName}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, middleName: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter middle name'
														id='middleName'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.middleName && (
														<span className='text-red-500 text-xs italic'>
															Middle name is required.
														</span>
													)}
												</div>

												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='godParent'
													>
														Godparent
													</label>
													<input
														{...register('godparent', {required: true})}
														value={formData.godParent}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, godParent: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter name of godparent'
														id='godParent'
														type='text'
														name='godParent'
														disabled={isView}
													/>
													{errors.godParent && (
														<span className='text-red-500 text-xs italic'>
															Baptism date is required.
														</span>
													)}
												</div>
											</div>

											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='lastName'
													>
														Last Name
													</label>
													<input
														{...register('lastName', {required: true})}
														value={formData.lastName}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, lastName: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter last name'
														id='lastName'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.lastName && (
														<span className='text-red-500 text-xs italic'>
															Last name is required.
														</span>
													)}
												</div>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='fathersName'
													>
														Father's Name
													</label>
													<input
														{...register('fathersName', {required: true})}
														value={formData.fathersName}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, fathersName: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder="Enter father's name"
														id='fathersName'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.fathersName && (
														<span className='text-red-500 text-xs italic'>
															Father's name is required.
														</span>
													)}
												</div>
											</div>

											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='dateOfBirth'
													>
														Date Of Birth
													</label>
													<input
														{...register('baptismDOB', {required: true})}
														value={formData.baptismDOB}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, baptismDOB: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder="Enter Date Of Birth"
														id='baptismDOB'
														type='text'
														name='baptismDOB'
														disabled={isView}
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
														htmlFor='mothersName'
													>
														Mother's name
													</label>
													<input
														{...register('mothersName', {required: false})}
														value={formData.mothersName}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, mothersName: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder="Enter mother's name"
														id='mothersName'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.mothersName && (
														<span className='text-red-500 text-xs italic'>
															Mother's name is required.
														</span>
													)}
												</div>
											</div>
											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='placeOfBirth'
													>
														Place of birth
													</label>
													<input
														{...register('placeOfBirth', {required: true})}
														value={formData.placeOfBirth}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, placeOfBirth: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter Place of Birth'
														id='placeOfBirth'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.placeOfBirth && (
														<span className='text-red-500 text-xs italic'>
															Place of birth is required.
														</span>
													)}
												</div>

												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='revMinister'
													>
														Rev Father
													</label>
													<input
														{...register('revMinister', {required: true})}
														value={formData.revMinister}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, revMinister: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter name of Rev Father'
														id='revMinister'
														type='text'
														name='revMinister'
														disabled={isView}
													/>
													{errors.revMinister && (
														<span className='text-red-500 text-xs italic'>
															Reverend Minister is required.
														</span>
													)}
												</div>
											</div>
											<div className='flex flex-row gap-6 w-full items-center'>
												<div className='mb-4 w-1/2'>
													<label
														className='block text-gray-700 text-sm font-bold mb-2'
														htmlFor='homeDistrict'
													>
														Home Town
													</label>
													<input
														{...register('homeDistrict', {required: false})}
														value={formData.homeDistrict}
														// onChange={handleChange}
														onChange={(e) =>
															setFormData({...formData, homeDistrict: e.target.value})
														}
														className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
														placeholder='Enter home town'
														id='homeDistrict'
														type='text'
														name='memberId'
														disabled={isView}
													/>
													{errors.homeDistrict && (
														<span className='text-red-500 text-xs italic'>
															Home district is required.
														</span>
													)}
												</div>

												<div className='w-1/2'></div>
											</div>
											<div className='mt-5 md:flex justify-end w-full'>
												{!isView && (
													<div className='md:w-1/4'>
														<MtnButton
															className='form-wizard-submit bg-[#318fe8] hover:bg-[#0054a0] text-white'
															type={'submit'}
															label={'Submit Request'}
														/>
													</div>
												)}
											</div>
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

export default EditBaptismModal;
