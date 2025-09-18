import {useQuery} from '@tanstack/react-query';
import {exportCsv} from 'json2csv-export';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {IPaginatableQuery, IUserState, Marriage} from '../../../core/interfaces';
import {DeleteMarriage, GetMarriageList, Search} from '../../../core/services/marriage.services';
import {RootState} from '../../../core/stores';
import {setAppLoading} from '../../../core/stores/slices/app_slice';
import {Icons} from '../../Assets';
import {DataPagination, IDataHandler} from '../../layout/DataPagination';
import {MtnButton} from '../../layout/MtnButton';
import {IToastHandler, Toast} from '../../layout/Toast';
import AddMarriageModal from './addmarriagemodal';
import EditMarriageModal from './editmarriagemodal';
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
import {Box, Button} from '@mui/material';
import {format} from 'react-string-format';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AddIcon from '@mui/icons-material/Add';
import { noAccessPrompt } from '../../../core/utility';

const dateFormat = 'MMM D, YYYY';

export const MarriageList = () => {
	useRedirectToAdminPage('marriage/marriagelist');
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let toast: IToastHandler;

	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<Marriage[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isView, setIsView] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
	const [pageIndex, setPageIndex] = useState(0);

	const DeleteRecord = async (id: number) => {
		await DeleteMarriage(id);
		MarriageListQuery?.refetch();
	};

	const formatMarriageData = (data: Marriage[]) => {
		return data.map((marriage) => ({
			...marriage,
			marriageDate: marriage.marriageDate ? moment(marriage.marriageDate).format(dateFormat) : 'N/A',
			createdDate: marriage.createdDate ? moment(marriage.createdDate).format(dateFormat) : 'N/A',
			modifiedDate: marriage.modifiedDate ? moment(marriage.modifiedDate).format(dateFormat) : 'N/A',
			nuptialBlessingDate: marriage.nuptialBlessingDate
				? moment(marriage.nuptialBlessingDate).format(dateFormat)
				: 'N/A',
		}));
	};
	const MarriageListQuery = useQuery({
		retry: (count) => count < 1,
		//enabled:false,
		staleTime: Infinity,
		queryKey: ['marriageTransactionsQuery'],
		queryFn: () => GetMarriageList(isExportRequest).then((res) => res.data),
		onSuccess: (data) => {
			const formattedData = formatMarriageData(data);
			setRows(formattedData);
			setRowsTotal(formattedData.length);

			if (!isExportRequest) {
				pagineHandler?.isLoading(false);
				setRows(data);
				setRowsTotal(Number(data.length));
			} else {
				const formattedData = formatMarriageData(data);
				dispatch(setAppLoading(true));
				setIsExportRequest(false);

				const header = {
					marriageNumber: 'Marriage Number',
					coupleName: 'Couple Name',
					marriageDate: 'Marriage Date',
					groomId: 'Groom',
					groomWitness: 'Groom Witness',
					brideId: 'Bride',
					brideWitness: 'Bride Witness',
					placeOfMarriage: 'Venue',
					revMinister: 'Minister',
					groomParentName: 'Groom Parent(s) Name',
					brideParentName: 'Bride Parent(s) Name',
					marriageType: 'Marriage Type',
					nuptialBlessingDate: 'Nuptial Blessing Date',
					createdDate: 'Created Date',
					createdBy: 'Created By',
					modifiedDate: 'Modified Date',
					modifiedBy: 'Modified By',
					isActive: 'Active',
				};

				exportCsv({header, data: formattedData, filename: 'marriage-list'});
				dispatch(setAppLoading(false));
			}
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(MarriageListQuery?.isFetching));
	}, [MarriageListQuery.isFetching]);

	useEffect(() => {
		MarriageListQuery?.refetch();
	}, [pageIndex, limit]);

	const handleExportRows = (rowsToExport: MRT_Row<Marriage>[]) => {
		const header = {
			marriageNumber: 'Marriage Number',
			coupleName: 'Couple Name',
			marriageDate: 'Marriage Date',
			groomId: 'Groom',
			groomWitness: 'Groom Witness',
			brideId: 'Bride',
			brideWitness: 'Bride Witness',
			placeOfMarriage: 'Venue',
			revMinister: 'Minister',
			groomParentName: 'Groom Parent(s) Name',
			brideParentName: 'Bride Parent(s) Name',
			marriageType: 'Marriage Type',
			nuptialBlessingDate: 'Nuptial Blessing Date',
			createdDate: 'Created Date',
			createdBy: 'Created By',
			modifiedDate: 'Modified Date',
			modifiedBy: 'Modified By',
			isActive: 'Active',
		};

		// exportCsv({
		// 	header,
		// 	data: rowsToExport,
		// 	filename: 'marriage-list',
		// });
		const doc = new jsPDF();
		const tableData = rowsToExport.map((row) => {
			return [
				row.original.marriageNumber,
				row.original.marriageDate,
				row.original.groomId,
				row.original.groomWitness,
				row.original.brideId,
				row.original.brideWitness,
				row.original.placeOfMarriage,
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

		doc.save('Marriage List ' + moment().format('LLL'));

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

	const columnHelper = createMRTColumnHelper<Marriage>();

	const columns = [
		columnHelper.accessor('marriageNumber', {
			header: 'N.L.M',
			size: 80,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.marriageNumber}`),
		}),
		columnHelper.accessor('marriageDate', {
			header: 'Marriage Date',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.marriageDate}`),
		}),
		columnHelper.accessor('groomId', {
			header: 'Groom',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.groomId}`),
		}),
		columnHelper.accessor('groomWitness', {
			header: 'Groom Witness',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.groomWitness}`),
		}),
		columnHelper.accessor('brideId', {
			header: 'Bride',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.brideId}`),
		}),
		columnHelper.accessor('brideWitness', {
			header: 'Bride Witness',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.brideWitness}`),
		}),
		columnHelper.accessor('placeOfMarriage', {
			header: 'Place Of Marriage',
			size: 200,
			enableClickToCopy: true,
			Cell: ({row}) => format(`${row.original?.placeOfMarriage}`),
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
			<div className='p-4 w-full'>
				<div className='flex flex-row justify-between items-center w-full'>
					<p className='font-medium text-2xl pb-4'>Marriage List</p>
					<div>
						<MtnButton
							label='Add Marriage'
							onClick={() => setIsModalOpen(true)}
							className='w-full px-10 mb-5 bg-blue-500 text-white  text-sm'
							icon={<AddIcon />}
						/>
					</div>
				</div>

				<MaterialReactTable table={table} />
			</div>
			<Toast position='top-right' onInit={(e) => (toast = e)} />
			<AddMarriageModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
			<EditMarriageModal
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
