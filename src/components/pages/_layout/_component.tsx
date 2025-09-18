import {useDispatch, useSelector} from 'react-redux';
import {Outlet, useNavigate, useLocation} from 'react-router-dom';
import {IAppState, IUserState} from '../../../core/interfaces';
import {ExpireToken} from '../../../core/services/auth.services';
import {RootState} from '../../../core/stores';
import {setAppLoading} from '../../../core/stores/slices/app_slice';
import {setUser} from '../../../core/stores/slices/user_slice';
import {clearUserData} from '../../../core/utility';
import {Images} from '../../Assets';
import {MtnAlertButton} from '../../layout/MtnButton';
import {MtnCurve} from '../../layout/MtnCurve';
import {IToastHandler, Toast} from '../../layout/Toast';
import '../../../assets/css/icofont.css';
import './index.scss';
import Swal from 'sweetalert2';

import {Menu, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import {Icons} from '../../Assets';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LanguageIcon from '@mui/icons-material/Language';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WaterIcon from '@mui/icons-material/Water';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ArticleIcon from '@mui/icons-material/Article';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';

const MenuItems = [
	{
		category: 'Setups',
		menulist: [
			{
				name: 'Society',
				icon: <Diversity1Icon />,
				link: '/society/societylist',
			},
			{
				name: 'Country',
				icon: <LanguageIcon />,
				link: '/country/countrylist',
			},
			{
				name: 'Contribution Type',
				icon: <VolunteerActivismIcon />,
				link: '/ContributionType/ContributionTypelist',
			},
			{
				name: 'Expenses Type',
				icon: <PaidIcon />,
				link: '/expensecategory/expensecategorylist',
			},
		],
	},
	{
		category: 'Front Desk',
		menulist: [
			{
				name: 'Members',
				icon: <PeopleIcon />,
				link: '/member/memberlist',
			},
			{
				name: 'Marriage',
				icon: <FavoriteIcon />,
				link: '/marriage/marriagelist',
			},
			{
				name: 'Baptism',
				icon: <WaterIcon />,
				link: '/baptism/baptismlist',
			},
			{
				name: 'Confirmation',
				icon: <ThumbUpAltIcon />,
				link: '/confirmation/confirmationlist',
			},
			{
				name: 'First Communion',
				icon: <FastfoodIcon />,
				link: '/firstcommunion/firstcommunionlist',
			},
		],
	},
	{
		category: 'Finance',
		menulist: [
			{
				name: 'Contribution',
				icon: <VolunteerActivismIcon />,
				link: '/contribution/contributionlist',
			},
			{
				name: 'Expenses',
				icon: <PaidIcon />,
				link: '/Expenses/Expenseslist',
			},
		],
	},
];

const FronteDeskMenu = [
	{
		category: 'Front Desk',
		menulist: [
			{
				name: 'Members',
				icon: <PeopleIcon />,
				link: '/member/memberlist',
			},
			{
				name: 'Marriage',
				icon: <FavoriteIcon />,
				link: '/marriage/marriagelist',
			},
			{
				name: 'Baptism',
				icon: <WaterIcon />,
				link: '/baptism/baptismlist',
			},
			{
				name: 'Confirmation',
				icon: <ThumbUpAltIcon />,
				link: '/confirmation/confirmationlist',
			},
			{
				name: 'First Communion',
				icon: <FastfoodIcon />,
				link: '/firstcommunion/firstcommunionlist',
			},
		],
	},
];

const FinanceMenu = [
	{
		category: 'Finance',
		menulist: [
			{
				name: 'Contribution',
				icon: <VolunteerActivismIcon />,
				link: '/contribution/contributionlist',
			},
			{
				name: 'Expenses',
				icon: <PaidIcon />,
				link: '/Expenses/Expenseslist',
			},
		],
	},
];

export const PageLayout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	let toast: IToastHandler;
	const user = localStorage.getItem('user');
	const appState = useSelector<RootState, IAppState>((state) => state.app);
	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const isUser = user && JSON.parse(user);
	const MenustoShow = isUser?.roles.includes('Administrator')
		? MenuItems
		: isUser?.roles.includes('Frontdesk') && isUser?.roles.includes('Financial-Secretary')
		? [...FronteDeskMenu, ...FinanceMenu]
		: isUser?.roles.includes('Frontdesk') && !isUser?.roles.includes('Financial-Secretary')
		? FronteDeskMenu
		: isUser?.roles.includes('Financial-Secretary')
		? FinanceMenu
		: [];

	const onLogout = () => {
		Swal.fire({
			title: 'Confirm log out',
			text: 'Are you sure you want to log out?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Confirm',
			cancelButtonText: 'Cancel',
			reverseButtons: true,
			customClass: {
				popup: 'rounded-lg shadow-lg bg-white dark:bg-gray-800 text-white',
				title: 'text-red-600 font-bold',
				icon: 'text-red-600',
				confirmButton:
					'bg-red-500 font-medium text-white hover:bg-red-600 focus:outline-none rounded-md px-4 py-2 mx-2',
				cancelButton:
					'bg-gray-200 font-medium text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-200 focus:outline-none rounded-md px-4 py-2 mx-2',
			},
			buttonsStyling: false, // Disable default SweetAlert2 button styles
		}).then((result) => {
			if (result.isConfirmed) {
				confirmLogout();
			}
		});
	};

	const confirmLogout = () => {
		dispatch(setAppLoading(true));
		localStorage.removeItem('user');
		dispatch(setAppLoading(false));
		dispatch(setUser(null));
		navigate('/login');
	};

	return (
		<>
			<div className='header min-h-[88vh] border-t-[2px] border-b border-solid border-[#0054a0] bg-cover bg-center bg-fixed bg-church-sky bg-opacity-20'>
				<div className='container mx-auto px-4'>
					<div className='flex items-center'>
						<div className=' w-full'>
							<div className='flex' onClick={() => navigate('/')}>
								<div>
									<img className='mx-auto h-[4em]' src={Images.LogoSvg} alt='logo' />
								</div>
								<div>
									<div className='text-lg font-medium mt-4'>{appState?.config?.appName}</div>
								</div>
							</div>
						</div>

						{location.pathname !== '/login' && (
							<div className='w-min'>
								{/* Use Headless UI Menu for the dropdown */}
								<Menu as='div' className='relative inline-block text-left'>
									<div>
										<Menu.Button className='inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
											<span className='pr-3'>{<MenuIcon />}</span>
											Menu
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<Menu.Items className='absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 font-medium'>
											<div className='px-1 py-1'>
												<Menu.Item>
													{({active}) => (
														<button
															className={`${
																active ? 'bg-[#0054a0] text-white' : 'text-gray-900'
															} group flex rounded-md items-center w-full p-2 mb-1 text-sm`}
															onClick={() => navigate('/')}
														>
															<span className='pr-3'>{<HomeIcon />}</span>
															Dashboard
														</button>
													)}
												</Menu.Item>
												<Menu.Separator>
													<hr />
												</Menu.Separator>
												{MenustoShow.map((item, i) => (
													<div className='mb-1'>
														<Menu.Section
															className={
																'text-sm text-white bg-gray-600 p-2 rounded-md mb-1'
															}
														>
															{item?.category}
														</Menu.Section>
														{item.menulist.map((menu) => (
															<Menu.Item>
																{({active}) => (
																	<button
																		className={`${
																			active
																				? 'bg-[#0054a0] text-white'
																				: 'text-gray-900'
																		} group flex rounded-md items-center w-full p-2 pl-3 text-sm`}
																		onClick={() => navigate(menu?.link)}
																	>
																		<span className='px-3'>{menu?.icon}</span>
																		{menu?.name}
																	</button>
																)}
															</Menu.Item>
														))}
														<Menu.Separator>
															<hr />
														</Menu.Separator>
													</div>
												))}

												{/* <Menu.Item>
													{({active}) => (
														<button
															className={`${
																active ? 'bg-[#0054a0] text-white' : 'text-gray-900'
															} group flex rounded-md items-center w-full p-2 text-sm`}
															onClick={() => navigate('/')}
														>
															<span className='pr-3'>{<ArticleIcon />}</span>
															Report
														</button>
													)}
												</Menu.Item>
												<Menu.Separator>
													<hr />
												</Menu.Separator> */}

												<Menu.Item>
													{({active}) => (
														<button
															className={`${
																active ? 'bg-[#0054a0] text-white' : 'text-gray-900'
															} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
															onClick={() => navigate('/')}
														>
															<span className='pr-3'>{<WebAssetIcon />}</span>
															Asset Management
														</button>
													)}
												</Menu.Item>
												<Menu.Separator>
													<hr />
												</Menu.Separator>

												<Menu.Item>
													{({active}) => (
														<button
															className={`${
																active
																	? 'bg-violet-500 text-gray-900 hover:bg-red-800 hover:text-white justify-between'
																	: 'text-red-800'
															} group flex rounded-md items-center w-full px-2 py-2 text-sm justify-between`}
															onClick={onLogout}
														>
															<>
																<div>Log out</div>
																<div>
																	<Icons.User fontWeight={`10`} className='w-4 h-5' />
																</div>
															</>
														</button>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						)}
					</div>
					<div className='pt-5'>
						<Outlet />
					</div>
				</div>
			</div>
			{/* <MtnCurve className='fill-[#fc0]' /> */}
			{/* <div className="bg-[#9a24cd] font-medium text-center pt-8 pb-14 h-16"> */}
			<div className='bg-[#0054a0] text-white font-medium text-center pt-8 pb-14 h-16'>
				&copy; ST. MAURICE CATHOLIC CHURCH
			</div>
			<Toast position='top-right' onInit={(e) => (toast = e)} />
		</>
	);
};
