import {FormEvent, Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import useRedirectToAdminPage from '../auth/login/AuthRedirect';
import DatePicker from 'react-flatpickr';
import {Dialog, Transition} from '@headlessui/react';
import {getConfig} from '../../../core/utility';
import {Check} from '../../../core/services/marriage.services';
import {Icons} from '../../Assets';
import {RootState} from '../../../core/stores';
import {IAppState} from '../../../core/interfaces';

interface AddMarriageModalProps {
	isOpen: boolean;
	onClose: () => void;
	loading: boolean;
	done: () => void;
}

const AddMarriageModal: React.FC<AddMarriageModalProps> = ({isOpen, onClose, loading, done}) => {
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [selectedMinister, setSelectedMinister] = useState<string>('');
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	const [selectedMarriageDate, setSelectedMarriageDate] = useState(new Date());
	const [selectedNuptialDate, setSelectedNuptialDate] = useState(new Date());

	const appState = useSelector<RootState, IAppState>((state) => state.app);

	const [Marriage, setMarriage] = useState({
		id: appState?.config?.id,
		memberId: '',
		marriageNumber: '',
		firstName: '',
		middleName: '',
		lastName: '',
		revMinister: '',
		brideParentName: '',
		groomParentName: '',
		marriageType: '',
		placeOfStay: '',
		homeDistrict: '',
		marriageDate: '',
		churchId: appState?.config?.churchId,
		nuptialBlessingDate: '',
		placeOfMarriage: '',
		coupleName: '',
		groomId: '',
		groomWitness: '',
		brideId: '',
		brideWitness: '',
		ministerId: appState?.config?.ministerId,
		createdDate: '',
		createdBy: appState?.config?.createdBy,
		modifiedDate: '',
		modifiedBy: appState?.config?.modifiedBy,
		isActive: true,
	});

	const handleMarriageDateChange = (date: Date) => {
		setSelectedMarriageDate(date);
	};

	const handleMarriagenuptialBlessingDate = (date: Date) => {
		setSelectedNuptialDate(date);
	};

	let toast: IToastHandler;

	const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (Marriage.marriageNumber == '') {
			toast.Error('Error', 'NLM cannot be empty');
			return;
		}

		if (Marriage.groomId == '') {
			toast.Error('Error', 'Groom Name cannot be empty');
			return;
		}
		if (Marriage.brideId == '') {
			toast.Error('Error', 'Bride Name cannot be empty');
			return;
		}
		if (Marriage.revMinister == '') {
			toast.Error('Error', 'Please Enter a Minister');
			return;
		}

		const responseData = await Check(Marriage.marriageNumber);
		if (responseData) {
			toast.Error('Error', 'Sorry N.L.M  already Exist');
			return;
		}

		setIsloading(true);
		const today = new Date();
		Marriage.ministerId = Number(selectedMinister);
		Marriage.marriageDate = new Date(selectedMarriageDate).toISOString();
		Marriage.nuptialBlessingDate = new Date(selectedNuptialDate).toISOString();
		Marriage.createdDate = today.toISOString();
		Marriage.modifiedDate = today.toISOString();

		const response = await fetch('https://catholicportal.net/api/Marriage/Save', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(Marriage),
		});

		if (response.ok) {
			setMarriage({
				id: appState?.config?.id,
				memberId: '',
				marriageNumber: '',
				firstName: '',
				middleName: '',
				nuptialBlessingDate: '',
				lastName: '',
				revMinister: '',
				brideParentName: '',
				groomParentName: '',
				placeOfStay: '',
				homeDistrict: '',
				churchId: appState?.config?.churchId,
				marriageType: '',
				marriageDate: '',
				coupleName: '',
				groomId: '',
				groomWitness: '',
				brideId: '',
				brideWitness: '',
				placeOfMarriage: '',
				ministerId: appState?.config?.ministerId,
				createdDate: '',
				createdBy: appState?.config?.createdBy,
				modifiedDate: '',
				modifiedBy: appState?.config?.modifiedBy,
				isActive: true,
			});
			setSelectedMinister('');
			setIsloading(false);
			swal('Great! Marriage data has been added!', {
				icon: 'success',
			});
			// toast.Info("Marriage Form Submission", "Marriage Data Submitted Successfully");
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		} else {
			setIsloading(false);
			console.error('Error submitting form data:', response.status);
			toast.Error('Error', 'Failed to create Marriage. Please try again.');
			// Handle error
		}
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
											Add Marriage
										</Dialog.Title>
										<Icons.Close
											type='button'
											className='w-4 h-5 hover:cursor-pointer rounded-full font-bold text-2xl'
											onClick={onClose}
										/>
									</div>
									<div className='mt-2'>
										<form onSubmit={onFormSubmit}>
											<div className='flex gap-6 w-full items-start'>
												<div className='w-full'>
													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='marriageNumber'
														>
															N.L.M
														</label>
														<input
															{...register('marriageNumber', {required: true})}
															value={Marriage.marriageNumber}
															onChange={(e) =>
																setMarriage({
																	...Marriage,
																	marriageNumber: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter N.L.M number'
															id='marriageNumber'
															type='text'
															name='marriageNumber'
														/>
														{errors.marriageNumber && (
															<span className='text-red-500 text-xs italic'>
																Marriage number is required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='nuptialBlessingDate'
														>
															Nuptial Blessing Date
														</label>
														<DatePicker
															{...register('nuptialBlessingDate', {required: true})}
															value={Marriage.nuptialBlessingDate}
															onChange={handleMarriagenuptialBlessingDate}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Select nuptial blessing date'
															id='nuptialBlessingDate'
															type='text'
															name='nuptialBlessingDate'
														/>
														<input
															type='hidden'
															name='id'
															value={Marriage.id}
															onChange={(e) =>
																setMarriage({...Marriage, id: e.target.valueAsNumber})
															}
														/>
														{errors.nuptialBlessingDate && (
															<span className='text-red-500 text-xs italic'>
																Nuptial Blessing Date is required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='marriageDate'
														>
															Marriage Date
														</label>
														<DatePicker
															{...register('marriageDate', {required: true})}
															value={Marriage.marriageDate}
															onChange={handleMarriageDateChange}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Select marriage date'
															id='marriageDate'
															// type="text"
															name='marriageDate'
														/>
														<input
															type='hidden'
															name='id'
															value={Marriage.id}
															onChange={(e) =>
																setMarriage({...Marriage, id: e.target.valueAsNumber})
															}
														/>
														{errors.marriageDate && (
															<span className='text-red-500 text-xs italic'>
																Marriage Date is required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='placeOfMarriage'
														>
															Place of marriage
														</label>
														<input
															{...register('placeOfMarriage', {required: true})}
															value={Marriage.placeOfMarriage}
															onChange={(e) =>
																setMarriage({
																	...Marriage,
																	placeOfMarriage: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter place of marriage'
															id='placeOfMarriage'
															type='text'
															name='placeOfMarriage'
														/>
														{errors.placeOfMarriage && (
															<span className='text-red-500 text-xs italic'>
																Place of marriage is required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='groomWitness'
														>
															Groom's witnesses (2)
														</label>
														<textarea
															{...register('groomWitness', {required: true})}
															value={Marriage.groomWitness}
															onChange={(e) =>
																setMarriage({...Marriage, groomWitness: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter groom witness'
															id='groomWitness'
															// type="text"
															name='groomWitness'
														></textarea>
														{errors.groomWitness && (
															<span className='text-red-500 text-xs italic'>
																Groom witnesses are required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='groomParentName'
														>
															Bride's Parents' Names (Father & Mother)
														</label>
														<textarea
															{...register('brideParentName', {required: true})}
															value={Marriage.brideParentName}
															onChange={(e) =>
																setMarriage({
																	...Marriage,
																	brideParentName: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter bride parent's name"
															id='brideParentName'
															// type="text"
															name='brideParentName'
														></textarea>
														{errors.brideParentName && (
															<span className='text-red-500 text-xs italic'>
																Names of bride's parents are required.
															</span>
														)}
													</div>

													{/* <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marriageType">
                                                        Marriage Type
                                                    </label>
                                                    <select
                                                        {...register("marriageType", { required: true })}
                                                        value={Marriage.marriageType}
                                                        onChange={(e) => setMarriage({ ...Marriage, marriageType: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="confirmationDate"
                                                    >
                                                        <option value={""}>Select marriage type</option>
                                                        <option value={"Church"}>Church</option>
                                                        <option value={"Civil"}>Civil</option>
                                                        <option value={"Customary"}>Customary</option>
                                                    </select>
                                                    {errors.marriageType && <span className="text-red-500 text-xs italic">Marriage type is required.</span>}
                                                </div> */}
												</div>
                                                
												<div className='w-full'>
													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='groomId'
														>
															Groom
														</label>
														<input
															{...register('groomId', {required: true})}
															value={Marriage.groomId}
															onChange={(e) =>
																setMarriage({...Marriage, groomId: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter groom name'
															id='groomId'
															type='text'
															name='groomId'
														/>
														{errors.groomId && (
															<span className='text-red-500 text-xs italic'>
																Groom name is required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='groomParentName'
														>
															Groom Parents' Names (Father & Mother)
														</label>
														<textarea
															{...register('groomParentName', {required: true})}
															value={Marriage.groomParentName}
															onChange={(e) =>
																setMarriage({
																	...Marriage,
																	groomParentName: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter groom parent's name"
															id='groomParentName'
															// type="text"
															name='groomParentName'
														></textarea>
														{errors.groomParentName && (
															<span className='text-red-500 text-xs italic'>
																Names of groom's parents are required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='brideId'
														>
															Bride
														</label>
														<input
															{...register('brideId', {required: false})}
															value={Marriage.brideId}
															onChange={(e) =>
																setMarriage({...Marriage, brideId: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter bride's name"
															id='brideId'
															type='text'
															name='brideId'
														/>
														{errors.brideId && (
															<span className='text-red-500 text-xs italic'>
																Bride's name is required.
															</span>
														)}
													</div>

													<div className='mb-4 w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='brideWitness'
														>
															Bride's witnesses (2)
														</label>
														<textarea
															{...register('brideWitness', {required: true})}
															value={Marriage.brideWitness}
															onChange={(e) =>
																setMarriage({...Marriage, brideWitness: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter groom witness'
															id='brideWitness'
															// type="text"
															name='brideWitness'
														></textarea>
														{errors.brideWitness && (
															<span className='text-red-500 text-xs italic'>
																Bride witnesses are required.
															</span>
														)}
													</div>

													<div className='w-full'>
														<label
															className='block text-gray-700 text-sm font-bold mb-2'
															htmlFor='revMinister'
														>
															Rev Father
														</label>
														<input
															{...register('revMinister', {required: true})}
															value={Marriage.revMinister}
															onChange={(e) =>
																setMarriage({...Marriage, revMinister: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter Father's name"
															id='revMinister'
															type='text'
															name='revMinister'
														/>
														{errors.brideParentName && (
															<span className='text-red-500 text-xs italic'>
																Rev Father is required.
															</span>
														)}
													</div>
												</div>
											</div>

											<div className='mt-10 md:flex justify-end w-full'>
												<div className='md:w-1/4'>
													<MtnButton
														className='form-wizard-submit bg-[#318fe8] hover:bg-[#0054a0] text-white'
														type={'submit'}
														label={'Submit Request'}
													/>
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
			<Toast position='top-right' onInit={(e) => (toast = e)} />
		</>
	);
};

export default AddMarriageModal;
