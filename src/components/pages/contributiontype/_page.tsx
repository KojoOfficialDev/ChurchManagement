import {useQuery} from '@tanstack/react-query';
import {exportCsv} from 'json2csv-export';
import {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {IPaginatableQuery, IUserState} from '../../../core/interfaces';
import {DeleteContributionType, GetContributionTypeList} from '../../../core/services/contributionType.services ';
import {RootState} from '../../../core/stores';
import {setAppLoading} from '../../../core/stores/slices/app_slice';
import {Icons} from '../../Assets';
import {DataPagination, IDataHandler} from '../../layout/DataPagination';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import useRedirectToAdminPage from '../auth/login/AuthRedirect';
import {
	MaterialReactTable,
	MRT_ColumnDef,
	createMRTColumnHelper,
	useMaterialReactTable,
	MRT_Row,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import {Box, Button} from '@mui/material';
import EditContributionTypeModal from './editContributionTypeModal';
import AddContributionTypeModal from './addcontributiontypemodal';
import {format} from 'react-string-format';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { noAccessPrompt } from '../../../core/utility';

export const ContributionTypeList = () => {
	useRedirectToAdminPage('ContributionType/ContributionTypelist');
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let toast: IToastHandler;

	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<any[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
	const [pageIndex, setPageIndex] = useState(0);

	const DeleteRecord = async (id: number) => {
		await DeleteContributionType(id);
		ContributionTypeListQuery?.refetch();
	};
	const ContributionTypeListQuery = useQuery({
		retry: (count) => count < 1,
		//enabled:false,
		staleTime: Infinity,
		queryKey: ['ContributionTypeTransactionsQuery'],
		queryFn: () => GetContributionTypeList(isExportRequest).then((res) => res.data),
		onSuccess: (data) => {
			setRows(data);
			setRowsTotal(Number(data.length));
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(ContributionTypeListQuery?.isFetching));
	}, [ContributionTypeListQuery.isFetching]);

	useEffect(() => {
		ContributionTypeListQuery?.refetch();
	}, [pageIndex, limit]);

	const handleExportRows = (rowsToExport: MRT_Row<any>[]) => {
		const header = {
			name: 'Contribution Type Name',
			Active: 'Active',
		};

		// exportCsv({
		// 	header,
		// 	data: rowsToExport,
		// 	filename: 'ContributionType-list',
		// });

		const doc = new jsPDF();
		const tableData = rowsToExport.map((row) => {
			return [row.original.name, ''];
		});
		const tableHeaders = columns.map((c) => c.header);

		console.log(tableHeaders);
		console.log(tableData);

		autoTable(doc, {
			head: [tableHeaders],
			body: tableData,
		});

		doc.save('Contribution Type List ' + moment().format('LLL'));

		dispatch(setAppLoading(false));
	};

	// Updated handleExportData function
	const handleExportData = () => {
		// Exports all the rows fetched from the server (ignores pagination, sorting, and filtering)
		handleExportRows(rows);
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

	const columnHelper = createMRTColumnHelper<any>();

	const columns = [
		columnHelper.accessor('name', {
			header: 'Name',
			size: 500,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original.name}`),
		}),
		columnHelper.accessor('action', {
			header: '',
			size: 20,
			Cell: ({row}) => (
				<div className='flex gap-3'>
					<Icons.EditNew
						onClick={() => {
							setSelectedRowData(row.original);
							setIsEditModalOpen(true);
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

		if (user && !user?.roles.includes('Administrator')) {
			noAccessPrompt();
			navigate('/');
		}
	}, []);

	return (
		<>
			<div className='relative p-4'>
				<div className='flex flex-row justify-between items-center w-full'>
					<p className='font-medium text-2xl pb-4'>ContributionTypes List</p>
					<div>
						<MtnButton
							label='Add ContributionType'
							onClick={() => setIsModalOpen(true)}
							className='w-full px-10 mb-5 bg-blue-500 text-white text-sm'
							icon={<AddIcon />}
						/>
					</div>
				</div>

				<MaterialReactTable table={table} />
			</div>
			<Toast position='top-right' onInit={(e) => (toast = e)} />
			<AddContributionTypeModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
			<EditContributionTypeModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				rowData={selectedRowData}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
		</>
	);
};
