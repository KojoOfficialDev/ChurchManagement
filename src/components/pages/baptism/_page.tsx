import {useQuery} from '@tanstack/react-query';
import {exportCsv} from 'json2csv-export';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Baptism, IPaginatableQuery, IUserState} from '../../../core/interfaces';
import {GetBaptismList, Search, DeleteBaptism} from '../../../core/services/baptism.services';
import {RootState} from '../../../core/stores';
import {setAppLoading} from '../../../core/stores/slices/app_slice';
import {Icons} from '../../Assets';
import {DataPagination, IDataHandler} from '../../layout/DataPagination';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import useRedirectToAdminPage from '../auth/login/AuthRedirect';
import {format} from 'react-string-format';
import AddBaptismModal from './addbaptismmodal';
import EditBaptismModal from './editbaptismmodal';
import {
	MaterialReactTable,
	MRT_ColumnDef,
	createMRTColumnHelper,
	useMaterialReactTable,
	MRT_Row,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import swal from 'sweetalert';
import {Box, Button} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AddIcon from '@mui/icons-material/Add';
import { noAccessPrompt } from '../../../core/utility';


const dateFormat = 'MMM D, YYYY';

export const BaptismList = () => {
	useRedirectToAdminPage('baptism/baptismlist');
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();

	let toast: IToastHandler;

	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<Baptism[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
	const [pageIndex, setPageIndex] = useState(0);

	const DeleteRecord = async (id: number) => {
		await DeleteBaptism(id);
		BaptismListQuery?.refetch();
	};
	const formatBaptismData = (data: Baptism[]) => {
		return data.map((baptism) => ({
			...baptism,
			baptismDate: baptism.baptismDate ? moment(baptism.baptismDate).format(dateFormat) : 'N/A',
			createdDate: baptism.createdDate ? moment(baptism.createdDate).format(dateFormat) : 'N/A',
			modifiedDate: baptism.modifiedDate ? moment(baptism.modifiedDate).format(dateFormat) : 'N/A',
		}));
	};
	const BaptismListQuery = useQuery({
		retry: (count) => count < 1,
		// enabled:false,
		staleTime: Infinity,
		queryKey: ['baptismsQuery'],
		queryFn: () => GetBaptismList(isExportRequest).then((res) => res.data),
		onSuccess: (data) => {
			const formattedData = formatBaptismData(data);
			setRows(formattedData);
			setRowsTotal(formattedData.length);
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(BaptismListQuery?.isFetching));
	}, [BaptismListQuery.isFetching]);

	useEffect(() => {
		BaptismListQuery?.refetch();
	}, [pageIndex, limit]);

	const handleExportRows = (rowsToExport: MRT_Row<Baptism>[]) => {
		const header = {
			baptismNumber: 'Baptism Number',
			memberId: 'Member Number',
			firstName: 'First Name',
			middleName: 'Middle Name',
			lastName: 'Last Name',
			baptismDate: 'Baptism Date',
			godParent: 'God Parent',
			revMinister: 'Minister',
			placeOfBaptism: 'Venue',
			createdDate: 'Created Date',
			createdBy: 'Created By',
			modifiedDate: 'Modified Date',
			modifiedBy: 'Modified By',
			isActive: 'Active',
		};

		// exportCsv({
		// 	header,
		// 	data: rowsToExport,
		// 	filename: 'baptisms-list',
		// });

		const doc = new jsPDF();
		const tableData = rowsToExport.map((row) => {
			return [
				`${row.original.firstName ? row.original.firstName : ''} ${
					row.original.lastName ? row.original.lastName : ''
				}`,
				row.original.baptismNumber,
				row.original.baptismDate,
				row.original.godParent,
				row.original.placeOfBaptism,
				row.original.revMinister,
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

		doc.save('Baptism List ' + moment().format('LLL'));
	};

	// Updated handleExportData function
	const handleExportData = () => {
		// Exports all the rows fetched from the server (ignores pagination, sorting, and filtering)
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

	const columnHelper = createMRTColumnHelper<Baptism>();

	const columns = [
		columnHelper.accessor('fullname', {
			header: 'Full Name',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original.firstName} ${row.original.lastName}`),
		}),
		columnHelper.accessor('nlb', {
			header: 'Baptism Number',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.baptismNumber}`),
		}),
		columnHelper.accessor('baptismDate', {
			header: 'Baptism Date',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.baptismDate}`),
		}),
		columnHelper.accessor('godParent', {
			header: 'Godparent',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.godParent}`),
		}),
		columnHelper.accessor('placeOfBaptism', {
			header: 'Place of Baptism',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.placeOfBaptism}`),
		}),
		columnHelper.accessor('revMinister', {
			header: 'Minister',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.revMinister}`),
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

	const table = useMaterialReactTable({
		columns,
		data: rows,
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
					Export/Print All Data
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
					Export/Print Page Rows
				</Button>
				<Button
					disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
					onClick={handleExportSelectedRows}
					startIcon={<FileDownloadIcon />}
				>
					Export/Print Selected Rows
				</Button>
			</Box>
		),
	});

	return (
		<>
			<div className='p-4 w-full'>
				<div className='flex flex-row justify-between items-center w-full'>
					<p className='font-medium text-2xl pb-4'>Baptism List</p>
					<div>
						<MtnButton
							label='Add Baptism'
							onClick={() => setIsModalOpen(true)}
							className='w-full px-10 mb-5 bg-blue-500 text-white text-sm'
							icon={<AddIcon />}
						/>
					</div>
				</div>

				<MaterialReactTable table={table} />
			</div>
			<Toast position='top-right' onInit={(e) => (toast = e)} />
			<AddBaptismModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
			<EditBaptismModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				rowData={selectedRowData}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
				isView={isView}
			/>
		</>
	);
};
