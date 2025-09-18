import {useQuery} from '@tanstack/react-query';
import {exportCsv} from 'json2csv-export';
import {useEffect, useMemo, useState} from 'react';
import DataGrid from 'react-data-grid';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Confirmation, IPaginatableQuery, IUserState} from '../../../core/interfaces';
import {GetConfirmationList, Search, DeleteConfirmation} from '../../../core/services/confirmation.services';
import {RootState} from '../../../core/stores';
import {setAppLoading} from '../../../core/stores/slices/app_slice';
import {Icons} from '../../Assets';
import {DataPagination, IDataHandler} from '../../layout/DataPagination';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import {format} from 'react-string-format';
import AddConfirmationModal from './addconfirmationmodal';
import EditConfirmationModal from './editconfirmationmodal';
import useRedirectToAdminPage from '../auth/login/AuthRedirect';
import moment from 'moment';
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
import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import AddIcon from '@mui/icons-material/Add';
import { noAccessPrompt } from '../../../core/utility';


const dateFormat = 'MMM D, YYYY';

export const ConfirmationList = () => {
	useRedirectToAdminPage('confirmation/confirmationlist');
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let toast: IToastHandler;

	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<Confirmation[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	// const [searchString, setSearchString] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
	const [pageIndex, setPageIndex] = useState(0);

	const DeleteRecord = async (id: number) => {
		await DeleteConfirmation(id);
		ConfirmationListQuery?.refetch();
	};

	const formatConfirmationData = (data: Confirmation[]) => {
		return data.map((confirmation) => ({
			...confirmation,
			confirmationDate: confirmation.confirmationDate
				? moment(confirmation.confirmationDate).format(dateFormat)
				: 'N/A',
			createdDate: confirmation.createdDate ? moment(confirmation.createdDate).format(dateFormat) : 'N/A',
			modifiedDate: confirmation.modifiedDate ? moment(confirmation.modifiedDate).format(dateFormat) : 'N/A',
		}));
	};

	const ConfirmationListQuery = useQuery({
		retry: (count) => count < 1,
		//enabled:false,
		staleTime: Infinity,
		queryKey: ['ConfirmationsQuery'],
		queryFn: () => GetConfirmationList(isExportRequest).then((res) => res.data),
		onSuccess: (data) => {
			const formattedData = formatConfirmationData(data);
			setRows(formattedData);
			setRowsTotal(formattedData.length);
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(ConfirmationListQuery?.isFetching));
	}, [ConfirmationListQuery.isFetching]);

	useEffect(() => {
		ConfirmationListQuery?.refetch();
	}, [pageIndex, limit]);

	const handleExportRows = (rowsToExport: MRT_Row<Confirmation>[]) => {
		const header = {
			memberId: 'Member Number',
			firstName: 'First Name',
			middleName: 'Middle Name',
			lastName: 'Last Name',
			godParent: 'Last Name',
			confirmationNumber: 'Confirmation Number',
			confirmationDate: 'Confirmation Date',
			revMinister: 'Minister',
			placeOfConfirmation: 'Venue',
			createdDate: 'Created Date',
			createdBy: 'Created By',
			modifiedDate: 'Modified Date',
			modifiedBy: 'Modified By',
			isActive: 'Active',
		};
		// exportCsv({
		// 	header,
		// 	data: rowsToExport,
		// 	filename: 'Confirmations-list',
		// });
		const doc = new jsPDF();
		const tableData = rowsToExport.map((row) => {
			return [
				`${row.original.title ? row.original.title : ''} ${
					row.original.firstName ? row.original.firstName : ''
				} ${row.original.lastName ? row.original.lastName : ''}`,
				row.original.confirmationNumber,
				row.original.confirmationDate,
				row.original.placeOfConfirmation,
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

		doc.save('Confirmation List ' + moment().format('LLL'));
		dispatch(setAppLoading(false));
	};

	// Updated handleExportData function
	const handleExportData = () => {
		// Exports all the rows fetched from the server (ignores pagination, sorting, and filtering)
		// handleExportRows(rows);
	};

	const handleExportAllRows = () => {
		// Exports all rows after filtering but before pagination (ignores pagination, respects filtering and sorting)
		handleExportRows(table.getPrePaginationRowModel().rows);
	};

	const handleExportPageRows = () => {
		// Exports the currently displayed page rows (respects pagination, sorting, and filtering)
		handleExportRows(table.getRowModel().rows);
	};

	const handleExportSelectedRows = () => {
		// Exports only selected rows
		handleExportRows(table.getSelectedRowModel().rows);
	};

	const columnHelper = createMRTColumnHelper<Confirmation>();

	const columns = [
		columnHelper.accessor('fullname', {
			header: 'Full Name',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original.firstName} ${row.original.lastName}`),
		}),
		columnHelper.accessor('confirmationNumber', {
			header: 'Confirmation Number',
			size: 70,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.confirmationNumber}`),
		}),
		columnHelper.accessor('confirmationDate', {
			header: 'Confirmation Date',
			size: 50,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.confirmationDate}`),
		}),
		columnHelper.accessor('placeOfConfirmation', {
			header: 'Place of Confirmation',
			size: 150,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.placeOfConfirmation}`),
		}),
		columnHelper.accessor('revMinister', {
			header: 'Minister',
			size: 80,
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

	useEffect(() => {
		const session = localStorage.getItem('user');
		const user = session ? JSON.parse(session) : undefined;
		console.log(user);

		if (user && !user?.roles.includes('Administrator') && !user?.roles.includes('Frontdesk')) {
			noAccessPrompt();
			navigate('/');
		}
	}, []);

	return (
		<>
			<div className='p-4'>
				<div className='flex flex-row justify-between items-center w-full'>
					<p className='font-medium text-2xl pb-4'>Confirmation List</p>
					<div>
						<MtnButton
							label='Add Confirmation'
							onClick={() => setIsModalOpen(true)}
							className='w-full px-10 mb-5 bg-blue-500 text-white text-sm'
							icon={<AddIcon />}
						/>
					</div>
				</div>

				<MaterialReactTable table={table} />
			</div>
			<Toast position='top-right' onInit={(e) => (toast = e)} />
			<AddConfirmationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
			<EditConfirmationModal
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
