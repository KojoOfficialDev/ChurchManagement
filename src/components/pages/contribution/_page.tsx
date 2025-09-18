import { useQuery } from "@tanstack/react-query";
import { exportCsv } from "json2csv-export";
import { useEffect, useMemo, useState } from "react";
import DataGrid from 'react-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Contribution, IPaginatableQuery, IUserState } from "../../../core/interfaces";
import { GetContributionList, Search, DeleteContribution } from "../../../core/services/contribution.services";
import { RootState } from "../../../core/stores";
import { setAppLoading } from "../../../core/stores/slices/app_slice";
import { Icons } from "../../Assets";
import { DataPagination, IDataHandler } from "../../layout/DataPagination";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import { format } from 'react-string-format';
import AddConfirmationModal from "./addcontributionmodal";
import EditConfirmationModal from "./editconfirmationmodal";
import useRedirectToAdminPage from "../auth/login/AuthRedirect"
import moment from "moment";
import {
	MaterialReactTable,
	MRT_ColumnDef,
	createMRTColumnHelper,
	useMaterialReactTable,
} from "material-react-table";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import swal from "sweetalert";
import { Box, Button } from "@mui/material";


const dateFormat = 'MMM D, YYYY';


export const ContributionList = () => {
	 useRedirectToAdminPage("contribution/contributionlist");
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let toast: IToastHandler;

	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<Contribution[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	// const [searchString, setSearchString] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false)
	const [pageIndex, setPageIndex] = useState(0);

	const DeleteRecord = async (id: number) => {
		await DeleteContribution(id)
		ContributionQuery?.refetch();
	}

	const formatConfirmationData = (data: Contribution[]) => {
		return data.map(contribution => ({
			...contribution,
			// confirmationDate: contribution.confirmationDate ? moment(contribution.confirmationDate).format(dateFormat) : 'N/A',
			// createdDate: contribution.createdDate ? moment(contribution.createdDate).format(dateFormat) : 'N/A',
			// modifiedDate: contribution.modifiedDate ? moment(contribution.modifiedDate).format(dateFormat) : 'N/A'
		}));
	};

	const ContributionQuery = useQuery({
		retry: (count) => count < 1,
		//enabled:false,
		staleTime: Infinity,
		queryKey: ["ContributionQuery"],
		queryFn: () => GetContributionList(isExportRequest).then(res => res.data),
		onSuccess: (data) => {
			const formattedData = formatConfirmationData(data)
			setRows(formattedData);
			setRowsTotal(formattedData.length);
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(ContributionQuery?.isFetching));
	}, [ContributionQuery.isFetching]);

	useEffect(() => {
		ContributionQuery?.refetch();
	}, [pageIndex, limit]);


	const handleExportRows = (rowsToExport: Contribution[]) => {
		const header = {
			memberId: "Member Number",
			firstName: "First Name",
			middleName: "Middle Name",
			lastName: "Last Name",
			godParent: "Last Name",
			confirmationNumber: "Confirmation Number",
			confirmationDate: "Confirmation Date",
			revMinister: "Minister",
			placeOfConfirmation: "Venue",
			createdDate: "Created Date",
			createdBy: "Created By",
			modifiedDate: "Modified Date",
			modifiedBy: "Modified By",
			isActive: "Active"
		};
		exportCsv({
			header,
			data: rowsToExport,
			filename: "Contribution-list"
		})
		dispatch(setAppLoading(false));
	}



	// Updated handleExportData function
	const handleExportData = () => {
		// Exports all the rows fetched from the server (ignores pagination, sorting, and filtering)
		handleExportRows(rows);
	};

	const handleExportAllRows = () => {
		// Exports all rows after filtering but before pagination (ignores pagination, respects filtering and sorting)
		handleExportRows(table.getPrePaginationRowModel().rows.map((row) => row.original));
	};

	const handleExportPageRows = () => {
		// Exports the currently displayed page rows (respects pagination, sorting, and filtering)
		handleExportRows(table.getRowModel().rows.map((row) => row.original));
	};

	const handleExportSelectedRows = () => {
		// Exports only selected rows
		handleExportRows(table.getSelectedRowModel().rows.map((row) => row.original));
	};

	const columnHelper = createMRTColumnHelper<Contribution>();


	const columns = [
		columnHelper.accessor('name', {
			header: 'Name',
			size: 200,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original.name}`),
		}),
		columnHelper.accessor('contributionType', {
			header: 'Contribution Type',
			size: 70,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.contributionType}`),
		}),
		columnHelper.accessor('amount', {
			header: 'Amount',
			size: 60,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.amount}`),
		}),
		columnHelper.accessor('description', {
			header: 'Description',
			size: 80,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.description}`),
		}),
		columnHelper.accessor('channel', {
			header: 'Channel',
			size: 80,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.channel}`),
		}),
		columnHelper.accessor('paymentDate', {
			header: 'Payment Date',
			size: 50,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.paymentDate}`),
		}),
		columnHelper.accessor('church', {
			header: 'Church',
			size: 50,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.church}`),
		}),
		columnHelper.accessor('active', {
			header: 'Active',
			size: 80,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original?.active}`),
		}),

		columnHelper.accessor('action', {
			header: '',
			size: 20,
			Cell: ({ row }) => (
				<div className="flex gap-3">
					<Icons.Edit
						onClick={() => {
							setSelectedRowData(row.original);
							setIsEditModalOpen(true);
						}}
						className="w-4 h-5 text-blue-500 cursor-pointer"
					/>
					<Icons.Delete
						onClick={() => {
							swal({
								title: "Are you sure?",
								text: "Once deleted, you will not be able to recover this record!",
								icon: "warning",
								buttons: true,
								dangerMode: true,
							}).then((willDelete) => {
								if (willDelete) {
									DeleteRecord(row.original.id);
									swal("Poof! Your record has been deleted!", {
										icon: "success",
									});
								} else {
									swal("Your record is safe!");
								}
							});
						}}
						className="w-4 h-5 text-red-500 cursor-pointer"
					/>
				</div>
			),
		}),
	]

	const table = useMaterialReactTable({
		columns,
		data: rows,
		enableRowSelection: true,
		columnFilterDisplayMode: 'popover',
		paginationDisplayMode: 'pages',
		positionToolbarAlertBanner: 'bottom',
		renderTopToolbarCustomActions: ({ table }) => (
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
					onClick={handleExportData}
					startIcon={<FileDownloadIcon />}
				>
					Export All Data
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
					Export Page Rows
				</Button>
				<Button
					disabled={
						!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
					}
					onClick={handleExportSelectedRows}
					startIcon={<FileDownloadIcon />}
				>
					Export Selected Rows
				</Button>
			</Box>
		)
	})

	return (<>
		<div className='p-4'>
			<p className="font-medium text-2xl pb-4">Contributions List</p>
			<div className="flex flex-row mb-4 gap-10 w-full">
				<MtnButton
					label="Add Contribution"
					onClick={() => setIsModalOpen(true)}
					className="w-1/2 p-3 mb-0 bg-blue-500 text-white text-sm"
				/>
			</div>

			<MaterialReactTable table={table} />

		</div>
		<Toast position="top-right" onInit={e => toast = e} />
		<AddConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} loading={isLoadingModalOpen} done={() => setIsLoadingModalOpen(false)} />
		<EditConfirmationModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} rowData={selectedRowData} loading={isLoadingModalOpen} done={() => setIsLoadingModalOpen(false)} />
	</>

	);
}; 
