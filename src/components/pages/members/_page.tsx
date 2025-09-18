import {useQuery} from '@tanstack/react-query';
import {exportCsv} from 'json2csv-export';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {GetMemberList, DeleteMember} from '../../../core/services/member.services';
import {setAppLoading} from '../../../core/stores/slices/app_slice';
import {Icons} from '../../Assets';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import {format} from 'react-string-format';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import AddMemberModal from './addmembermodal';
import EditMemberModal from './editmembermodal';
import {Member} from '../../../core/interfaces';
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import {MaterialReactTable, type MRT_Row, useMaterialReactTable, createMRTColumnHelper} from 'material-react-table';
import {Box, Button, IconButton} from '@mui/material';
import AddPersonIcon from '@mui/icons-material/PersonAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import swal from 'sweetalert';
import useRedirectToAdminPage from '../auth/login/AuthRedirect';
import {checkUserRole, getUserSession, noAccessPrompt} from '../../../core/utility';
import {useNavigate} from 'react-router-dom';

const dateFormat = 'MMM D, YYYY';

export const MemberList = () => {
	useRedirectToAdminPage('member/memberlist');
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	let toast: IToastHandler;
	// const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [rows, setRows] = useState<Member[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState<Member | null>(null);
	const [pageIndex, setPageIndex] = useState(0);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);

	const DeleteRecord = async (id: number) => {
		await DeleteMember(id);
		memberListQuery?.refetch();
	};

	const formatMemberData = (data: Member[]) => {
		return data.map((member) => ({
			...member,
			dateOfBirth: member.dateOfBirth ? moment(member.dateOfBirth).format(dateFormat) : 'N/A',
			createdDate: member.createdDate ? moment(member.createdDate).format(dateFormat) : 'N/A',
			modifiedDate: member.modifiedDate ? moment(member.modifiedDate).format(dateFormat) : 'N/A',
		}));
	};

	const memberListQuery = useQuery({
		retry: (count) => count < 1,
		staleTime: Infinity,
		queryKey: ['GetMemberList'],
		queryFn: () => GetMemberList().then((res) => res.data),
		onSuccess: (data) => {
			const formattedData = formatMemberData(data);
			setRows(formattedData);
			setRowsTotal(formattedData.length);
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(memberListQuery?.isFetching));
	}, [memberListQuery.isFetching]);

	useEffect(() => {
		memberListQuery?.refetch();
	}, [pageIndex, limit]);

	const handleExportRows = (rowsToExport: MRT_Row<Member>[]) => {
		console.log(rowsToExport);
		console.log(columns);
		const header = {
			membershipNumber: 'Member Number',
			title: 'Title',
			firstName: 'First Name',
			middleName: 'Middle Name',
			lastName: 'Last Name',
			gender: 'Gender',
			occupation: 'Occupation',
			email: 'Email',
			dateOfBirth: 'Date Of Birth',
			homeDistrict: 'Home District',
			region: 'Region',
			placeOfStay: 'Region',
			fathersName: "Father's Name",
			mothersName: "Mother's Name",
			phoneNumber: 'Phone Number',
			isDeceased: 'Deceased',
			isMinister: 'Minister',
			createdDate: 'Created Date',
			createdBy: 'Created By',
			modifiedDate: 'Modified Date',
			modifiedBy: 'Modified By',
			isActive: 'Active',
		};

		// exportCsv({
		// 	header,
		// 	data: rowsToExport,
		// 	filename: 'members-list',
		// });

		// const tableData = rowsToExport.map((row) => Object.values(row.original));
		const doc = new jsPDF();
		const tableData = rowsToExport.map((row) => {
			return [
				'',
				row.original.membershipNumber,
				`${row.original.title ? row.original.title : ''} ${
					row.original.firstName ? row.original.firstName : ''
				} ${row.original.lastName ? row.original.lastName : ''}`,
				row.original.gender,
				row.original.dayBorn,
				row.original.email,
				row.original.occupation,
				'',
			];
		});
		const tableHeaders = columns.map((c) => c.header);

		console.log(tableHeaders);
		console.log(tableData);

		autoTable(doc, {
			head: [tableHeaders],
			body: tableData,
		});

		doc.save('Members List ' + moment().format('LLL'));
		// doc.save('mrt-pdf-example.pdf');
	};

	// Updated handleExportData function
	const handleExportData = () => {
		// Exports all the rows fetched from the server (ignores pagination, sorting, and filtering)
		// handleExportRows(rows);
		handleExportRows(table.getPrePaginationRowModel().rows);
	};

	const handleExportAllRows = () => {
		// Exports all rows after filtering but before pagination (ignores pagination, respects filtering and sorting)
		// handleExportRows(table.getPrePaginationRowModel().rows.map((row) => row.original));
		handleExportRows(table.getPrePaginationRowModel().rows);
	};

	const handleExportPageRows = () => {
		// Exports the currently displayed page rows (respects pagination, sorting, and filtering)
		// handleExportRows(table.getRowModel().rows.map((row) => row.original));
		handleExportRows(table.getRowModel().rows);
	};

	const handleExportSelectedRows = () => {
		// Exports only selected rows
		// handleExportRows(table.getSelectedRowModel().rows.map((row) => row.original));
		handleExportRows(table.getSelectedRowModel().rows);
	};

	const columnHelper = createMRTColumnHelper<Member>();

	const navigate = useNavigate();

	useEffect(() => {
		const session = localStorage.getItem('user');
		const user = session ? JSON.parse(session) : undefined;
		console.log(user);

		if (user && !user?.roles.includes('Administrator') && !user?.roles.includes('Frontdesk')) {
			noAccessPrompt();
			navigate('/');
		}
	}, []);

	const columns = [
		columnHelper.accessor('imageUrl', {
			header: '',
			size: 100,
			Cell: ({row}) => (
				<Box sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
					<LazyLoadImage
						src={row.original.imageUrl}
						className='w-20 h-10 rounded-md'
						alt='Avatar'
						height={10}
						loading='lazy'
					/>
				</Box>
			),
		}),
		columnHelper.accessor('membershipNumber', {
			header: 'Member Number',
			size: 100,
			enableClickToCopy: true,
		}),
		columnHelper.accessor('fullname', {
			header: 'Full Name',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original.title} ${row.original.firstName} ${row.original.lastName}`),
		}),
		columnHelper.accessor('gender', {
			header: 'Gender',
			size: 70,
			enableClickToCopy: true,
			filterVariant: 'select',
			filterSelectOptions: ['Male', 'Female'],
		}),
		columnHelper.accessor('dayBorn', {
			header: 'Day Born',
			size: 50,
			enableClickToCopy: true,
		}),
		columnHelper.accessor('email', {
			header: 'Email',
			size: 150,
			enableClickToCopy: true,
		}),
		columnHelper.accessor('occupation', {
			header: 'Occupation',
			size: 80,
			enableClickToCopy: true,
		}),

		columnHelper.accessor('action', {
			header: '',
			size: 20,
			Cell: ({row}) => (
				<div className='flex gap-3'>
					<Icons.EyeNew
						onClick={() => {
							setSelectedRowData(row.original);
							setIsEditModalOpen(true);
							setIsView(true);
						}}
						className='w-4 h-5 text-blue-500 cursor-pointer'
					/>
					<Icons.EditNew
						onClick={() => {
							setSelectedRowData(row.original);
							setIsEditModalOpen(true);
							setIsView(false);
						}}
						className='w-4 h-5 text-blue-500 cursor-pointer'
					/>
					<Icons.Delete
						onClick={() => {
							swal({
								title: 'Are you sure?',
								text: 'Once deleted, you will not be able to recover this record!',
								icon: 'warning',
								buttons: true,
								dangerMode: true,
							}).then((willDelete) => {
								if (willDelete) {
									DeleteRecord(row.original.id);
									swal('Poof! Your record has been deleted!', {
										icon: 'success',
									});
								} else {
									swal('Your record is safe!');
								}
							});
						}}
						className='w-4 h-5 text-red-500 cursor-pointer'
					/>
				</div>
			),
		}),
	];

	const table = useMaterialReactTable({
		columns,
		data: rows,
		// globalFilterFn: 'startsWith',
		globalFilterModeOptions: ['startsWith', 'contains', 'endsWith'],
		enableRowSelection: true,
		columnFilterDisplayMode: 'popover',
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		renderTopToolbarCustomActions: ({table}) => (
			<Box
				sx={{
					display: 'flex',
					gap: '16px',
					padding: '8px',
					flexWrap: 'wrap',
				}}
			>
				<Button
					//export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
					onClick={handleExportAllRows}
					startIcon={<FileDownloadIcon />}
				>
					Export All Data / Print
				</Button>
				{/* <Button
					disabled={table.getPrePaginationRowModel().rows.length === 0}
					onClick={handleExportAllRows}
					startIcon={<FileDownloadIcon />}
				>
					Export All Rows
				</Button> */}
				<Button
					disabled={table.getRowModel().rows.length === 0}
					onClick={handleExportPageRows}
					startIcon={<FileDownloadIcon />}
				>
					Export Page Rows / Print
				</Button>
				<Button
					disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
					onClick={handleExportSelectedRows}
					startIcon={<FileDownloadIcon />}
				>
					Export Selected Rows / Print
				</Button>
			</Box>
		),
	});

	return (
		<div className='relative p-4 w-full'>
			<div className='flex flex-row justify-between items-center w-full'>
				<p className='font-medium text-2xl pb-4'>Membership List</p>
				<div>
					{/* <AddIconButton
						onClick={() => setIsModalOpen(true)}
						icon={<Icons.Edit />}
						size={'large'}
					/> */}
					{/* <IconButton aria-label='add' sx={{paddingX: 1, marginBottom: 1}} onClick={() => setIsModalOpen(true)}>
						<AddIcon
							className='bg-blue-500 text-white rounded-full'
							sx={{fontSize: 50}}
						/>
					</IconButton> */}
					<MtnButton
						label='Add Member'
						onClick={() => setIsModalOpen(true)}
						className='w-full px-10 mb-5 bg-blue-500 items-center text-white text-sm hover:bg-blue-700'
						icon={<AddPersonIcon />}
					/>
				</div>
			</div>

			<MaterialReactTable table={table} />

			<Toast position='top-right' onInit={(e) => (toast = e)} />
			<AddMemberModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
			<EditMemberModal
				recordId={0}
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				rowData={selectedRowData}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
				isView={isView}
			/>
		</div>
	);
};

export default MemberList;

// import {
// 	MaterialReactTable,
// 	useMaterialReactTable,
// 	type MRT_Row,
// 	createMRTColumnHelper,
//   } from 'material-react-table';
//   import { Box, Button } from '@mui/material';
//   import FileDownloadIcon from '@mui/icons-material/FileDownload';
//   import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
//   import { data, type Person } from './makeData';

//   const columnHelper = createMRTColumnHelper<Person>();

//   const columns = [
// 	columnHelper.accessor('id', {
// 	  header: 'ID',
// 	  size: 40,
// 	}),
// 	columnHelper.accessor('firstName', {
// 	  header: 'First Name',
// 	  size: 120,
// 	}),
// 	columnHelper.accessor('lastName', {
// 	  header: 'Last Name',
// 	  size: 120,
// 	}),
// 	columnHelper.accessor('company', {
// 	  header: 'Company',
// 	  size: 300,
// 	}),
// 	columnHelper.accessor('city', {
// 	  header: 'City',
// 	}),
// 	columnHelper.accessor('country', {
// 	  header: 'Country',
// 	  size: 220,
// 	}),
//   ];

//   const csvConfig = mkConfig({
// 	fieldSeparator: ',',
// 	decimalSeparator: '.',
// 	useKeysAsHeaders: true,
//   });

//   const Example = () => {
// 	const handleExportRows = (rows: MRT_Row<Person>[]) => {
// 	  const rowData = rows.map((row) => row.original);
// 	  const csv = generateCsv(csvConfig)(rowData);
// 	  download(csvConfig)(csv);
// 	};

// 	const handleExportData = () => {
// 	  const csv = generateCsv(csvConfig)(data);
// 	  download(csvConfig)(csv);
// 	};

// 	const table = useMaterialReactTable({
// 	  columns,
// 	  data,
// 	  enableRowSelection: true,
// 	  columnFilterDisplayMode: 'popover',
// 	  paginationDisplayMode: 'pages',
// 	  positionToolbarAlertBanner: 'bottom',
// 	  renderTopToolbarCustomActions: ({ table }) => (
// 		<Box
// 		  sx={{
// 			display: 'flex',
// 			gap: '16px',
// 			padding: '8px',
// 			flexWrap: 'wrap',
// 		  }}
// 		>
// 		  <Button
// 			//export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
// 			onClick={handleExportData}
// 			startIcon={<FileDownloadIcon />}
// 		  >
// 			Export All Data
// 		  </Button>
// 		  <Button
// 			disabled={table.getPrePaginationRowModel().rows.length === 0}
// 			//export all rows, including from the next page, (still respects filtering and sorting)
// 			onClick={() =>
// 			  handleExportRows(table.getPrePaginationRowModel().rows)
// 			}
// 			startIcon={<FileDownloadIcon />}
// 		  >
// 			Export All Rows
// 		  </Button>
// 		  <Button
// 			disabled={table.getRowModel().rows.length === 0}
// 			//export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
// 			onClick={() => handleExportRows(table.getRowModel().rows)}
// 			startIcon={<FileDownloadIcon />}
// 		  >
// 			Export Page Rows
// 		  </Button>
// 		  <Button
// 			disabled={
// 			  !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
// 			}
// 			//only export selected rows
// 			onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
// 			startIcon={<FileDownloadIcon />}
// 		  >
// 			Export Selected Rows
// 		  </Button>
// 		</Box>
// 	  ),
// 	});

// 	return <MaterialReactTable table={table} />;
//   };

//   export default Example;
