import {FormEvent, Fragment, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import {GetMinistersList} from '../../../core/services/member.services';
import DatePicker from 'react-flatpickr';
import {Dialog, Transition} from '@headlessui/react';
import {getConfig} from '../../../core/utility';
import {Icons} from '../../Assets';
import {IAppState} from '../../../core/interfaces';
import {useSelector} from 'react-redux';
import {RootState} from '../../../core/stores';

interface EditMarriageModalProps {
	isOpen: boolean;
	onClose: () => void;
	rowData: any;
	loading: boolean;
	done: () => void;
	isView: boolean;
}

const EditMarriageModal: React.FC<EditMarriageModalProps> = ({isOpen, onClose, rowData, loading, done, isView}) => {
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	const [isLoading, setIsloading] = useState<boolean>(false);
	const [selectedMinister, setSelectedMinister] = useState<string>('');

	const initialDate = '2024-05-06T10:00';
	const [selectedMarriageDate, setSelectedMarriageDate] = useState(new Date());
	const [selectedNuptialDate, setSelectedNuptialDate] = useState(new Date());

	const navigate = useNavigate();
	const appState = useSelector<RootState, IAppState>((state) => state.app);

	const [formData, setFormData] = useState({
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
		churchId: appState?.config?.churchId,
	});

	useEffect(() => {
		if (isOpen && rowData) {
			setFormData({
				id: rowData.id || appState?.config?.id,
				memberId: rowData.memberId || '',
				marriageNumber: rowData.marriageNumber || '',
				firstName: rowData.firstName || '',
				middleName: rowData.middleName || '',
				lastName: rowData.lastName || '',
				revMinister: rowData.revMinister || '',
				brideParentName: rowData.brideParentName || '',
				groomParentName: rowData.groomParentName || '',
				marriageType: rowData.marriageType || '',
				placeOfStay: rowData.placeOfStay || '',
				homeDistrict: rowData.homeDistrict || '',
				marriageDate: rowData.marriageDate ? new Date(rowData.marriageDate).toISOString().split('T')[0] : '',
				nuptialBlessingDate: rowData.nuptialBlessingDate || '',
				placeOfMarriage: rowData.placeOfMarriage || '',
				coupleName: rowData.coupleName || '',
				groomId: rowData.groomId || '',
				groomWitness: rowData.groomWitness || '',
				brideId: rowData.brideId || '',
				brideWitness: rowData.brideWitness || '',
				ministerId: rowData.ministerId || appState?.config?.ministerId,
				createdDate: rowData.createdDate || '',
				createdBy: rowData.createdBy || appState?.config?.createdBy,
				modifiedDate: rowData.modifiedDate || '',
				modifiedBy: rowData.modifiedBy || appState?.config?.modifiedBy,
				isActive: rowData.isActive || true,
				churchId: rowData.churchId || appState?.config?.churchId,
			});
				setSelectedMarriageDate(new Date(new Date(rowData.marriageDate).toISOString().split('T')[0]))
				setSelectedNuptialDate(new Date(rowData.nuptialBlessingDate))
		}
	}, [isOpen, rowData]);

	let toast: IToastHandler;

	const {id} = useParams();

	const fetchMarriage = async (id: any) => {
		setIsloading(true);
		try {
			const response = await fetch(`https://catholicportal.net/api/Marriage/Get?id=${id}`);
			if (response.ok) {
				const marriageData = await response.json();
				// Update form data with fetched product details
				setFormData(formData);
				setSelectedMarriageDate(new Date(formData.marriageDate.slice(0, 16)));
				setSelectedNuptialDate(new Date(formData.nuptialBlessingDate.slice(0, 16)));
				setSelectedMinister(formData.ministerId.toString());
				setIsloading(false);
			} else {
				console.error('Failed to fetch Marriage details:', response.statusText);
				toast.Error('Error', 'Failed to fetch Marriage details');
				setIsloading(false);
			}
		} catch (error) {
			console.error('Error fetching Marriage:', error);
			toast.Error('Error', 'Error fetching Marriage');
		}
	};

	const handleMarriageDateChange = (date: Date) => {
		setSelectedMarriageDate(date);
	};

	const handleMarriageNuptialBlessingDate = (date: Date) => {
		setSelectedNuptialDate(date);
	};

	const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (formData.marriageDate == '') {
			toast.Error('Error', 'Please Select Marriage Date');
			return;
		}

		if (formData.groomId == '') {
			toast.Error('Error', 'Groom Name cannot be empty');
			return;
		}
		if (formData.brideId == '') {
			toast.Error('Error', 'Brides Name cannot be empty');
			return;
		}
		if (formData.marriageNumber == '') {
			toast.Error('Error', 'NLM cannot be empty');
			return;
		}

		if (formData.revMinister == '') {
			toast.Error('Error', 'Please Enter a Minister');
			return;
		}

		setIsloading(true);
		const today = new Date();

		formData.ministerId = Number(selectedMinister);
		rowData.marriageDate = new Date(selectedMarriageDate).toISOString();
		rowData.nuptialBlessingDate = new Date(selectedNuptialDate).toISOString();
		rowData.createdDate = today.toISOString();
		rowData.modifiedDate = today.toISOString();

		const response = await fetch('https://catholicportal.net/api/Marriage/Update', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			setFormData({
				id: appState?.config?.id,
				memberId: '',
				marriageNumber: '',
				marriageDate: '',
				coupleName: '',
				groomId: '',
				groomWitness: '',
				brideId: '',
				brideWitness: '',
				placeOfMarriage: '',
				firstName: '',
				middleName: '',
				lastName: '',
				revMinister: '',
				brideParentName: '',
				groomParentName: '',
				marriageType: '',
				placeOfStay: '',
				homeDistrict: '',
				nuptialBlessingDate: '',
				ministerId: appState?.config?.ministerId,
				createdDate: '',
				createdBy: appState?.config?.createdBy,
				churchId: appState?.config?.churchId,
				modifiedDate: '',
				modifiedBy: appState?.config?.modifiedBy,
				isActive: true,
			});
			setSelectedMinister('');
			setIsloading(false);
			toast.Info('Marriage Form Submission', 'Marriage Data Submitted Successfully');
			window.location.reload();
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
											Edit Marriage
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
															value={formData.marriageNumber}
															onChange={(e) =>
																setFormData({
																	...formData,
																	marriageNumber: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter N.L.M number'
															id='marriageNumber'
															type='text'
															name='marriageNumber'
															disabled={isView}
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
															value={formData.nuptialBlessingDate}
															onChange={handleMarriageNuptialBlessingDate}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Select nuptial blessing date'
															id='nuptialBlessingDate'
															type='text'
															name='nuptialBlessingDate'
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
															value={formData.marriageDate}
															onChange={handleMarriageDateChange}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Select marriage date'
															id='marriageDate'
															// type="text"
															name='marriageDate'
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
															value={formData.placeOfMarriage}
															onChange={(e) =>
																setFormData({
																	...formData,
																	placeOfMarriage: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter place of marriage'
															id='placeOfMarriage'
															type='text'
															name='placeOfMarriage'
															disabled={isView}
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
															value={formData.groomWitness}
															onChange={(e) =>
																setFormData({...formData, groomWitness: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter groom witness'
															id='groomWitness'
															// type="text"
															name='groomWitness'
															disabled={isView}
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
															value={formData.brideParentName}
															onChange={(e) =>
																setFormData({
																	...formData,
																	brideParentName: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter bride parent's name"
															id='brideParentName'
															// type="text"
															name='brideParentName'
															disabled={isView}
														></textarea>
														{errors.brideParentName && (
															<span className='text-red-500 text-xs italic'>
																Names of bride's parents are required.
															</span>
														)}
													</div>
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
															value={formData.groomId}
															onChange={(e) =>
																setFormData({...formData, groomId: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter groom name'
															id='groomId'
															type='text'
															name='groomId'
															disabled={isView}
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
															value={formData.groomParentName}
															onChange={(e) =>
																setFormData({
																	...formData,
																	groomParentName: e.target.value,
																})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter groom parent's name"
															id='groomParentName'
															// type="text"
															name='groomParentName'
															disabled={isView}
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
															value={formData.brideId}
															onChange={(e) =>
																setFormData({...formData, brideId: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter bride's name"
															id='brideId'
															type='text'
															name='brideId'
															disabled={isView}
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
															value={formData.brideWitness}
															onChange={(e) =>
																setFormData({...formData, brideWitness: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder='Enter groom witness'
															id='brideWitness'
															// type="text"
															name='brideWitness'
															disabled={isView}
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
															value={formData.revMinister}
															onChange={(e) =>
																setFormData({...formData, revMinister: e.target.value})
															}
															className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
															placeholder="Enter Father's name"
															id='revMinister'
															type='text'
															name='revMinister'
															disabled={isView}
														/>
														{errors.brideParentName && (
															<span className='text-red-500 text-xs italic'>
																Rev Father's name is required.
															</span>
														)}
													</div>
												</div>

												{/* <div className="mb-4 w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marriageType">
                                                        Marriage Type
                                                    </label>
                                                    <select
                                                        {...register("marriageType", { required: true })}
                                                        value={formData.marriageType}
                                                        onChange={(e) => setFormData({ ...formData, marriageType: e.target.value })}
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

											{/* <div className='flex flex-row gap-6 w-full items-center'></div>

											<div className='flex flex-row gap-6 w-full items-center'></div>

											<div className='flex flex-row gap-6 w-full items-center'></div>

											<div className='flex flex-row gap-6 w-full items-center'></div>

											<div className='flex flex-row gap-6 w-full items-center'></div> */}

											<div className='flex flex-row gap-6 w-full items-center'>
												{/* <div className="w-1/2">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coupleName">
                                                        Couple name
                                                    </label>
                                                    <input
                                                        {...register("coupleName", { required: true })}
                                                        value={formData.coupleName}
                                                        onChange={(e) => setFormData({ ...formData, coupleName: e.target.value })}
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        placeholder="Enter couple name"
                                                        id="coupleName"
                                                        type="text"
                                                        name="coupleName"
                                                    />
                                                    {errors.coupleName && <span className="text-red-500 text-xs italic">Couple name is required.</span>}
                                                </div> */}

												<div className='w-1/2'></div>
											</div>

											<div className='mt-10 md:flex justify-end w-full'>
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

export default EditMarriageModal;
