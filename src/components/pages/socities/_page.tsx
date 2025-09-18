import { useQuery } from "@tanstack/react-query";
import { exportCsv } from "json2csv-export";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IPaginatableQuery, IUserState } from "../../../core/interfaces";
import { DeleteSociety, GetSocietiesList, SearchMemberList } from "../../../core/services/member.services";
import { RootState } from "../../../core/stores";
import { setAppLoading } from "../../../core/stores/slices/app_slice";
import { Icons } from "../../Assets";
import { DataPagination, IDataHandler } from "../../layout/DataPagination";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import useRedirectToAdminPage from "../auth/login/AuthRedirect"
import {
	MaterialReactTable,
	MRT_ColumnDef,
	createMRTColumnHelper,
	useMaterialReactTable,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import swal from "sweetalert";
import Swal from "sweetalert2";
import { Box, Button } from "@mui/material";
import EditSocietyModal from "./editsocietymodal";
import AddSocietyModal from "./addsocietymodal";
import { format } from "react-string-format";


export const SocietyList = () => {
	 useRedirectToAdminPage("society/societylist");
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let toast: IToastHandler;


	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<any[]>([]);
	const [limit, setLimit] = useState(10);
	const [rowsTotal, setRowsTotal] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedRowData, setSelectedRowData] = useState(null);
	const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
	const [pageIndex, setPageIndex] = useState(0);


	const DeleteRecord = async (id: number) => {
		await DeleteSociety(id)
		SocityListQuery?.refetch();
	}
	const SocityListQuery = useQuery({
		retry: (count) => count < 1,
		//enabled:false,
		staleTime: Infinity,
		queryKey: ["societyTransactionsQuery"],
		queryFn: () => GetSocietiesList(isExportRequest).then(res => res.data),
		onSuccess: (data) => {
			setRows(data);
			setRowsTotal(Number(data.length));
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(SocityListQuery?.isFetching));
	}, [SocityListQuery.isFetching]);

	useEffect(() => {
		SocityListQuery?.refetch();
	}, [pageIndex, limit]);


	const handleExportRows = (rowsToExport: any) => {
		const header = {
			name: "Society Name",
			Active: "Active"
		};

		exportCsv({
			header,
			data: rowsToExport,
			filename: "society-list"
		});
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

	const columnHelper = createMRTColumnHelper<any>();


	const columns = [
		columnHelper.accessor('name', {
			header: 'Society',
			size: 500,
			enableClickToCopy: true,
			Cell: ({ row }) => format(`${row.original.name}`),
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
				<Button
					disabled={table.getPrePaginationRowModel().rows.length === 0}
					onClick={handleExportAllRows}
					startIcon={<FileDownloadIcon />}
				>
					Export All Rows
				</Button>
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



	return (
		<>
			<div className='relative p-4'>
				<p className="font-medium text-2xl pb-4">Society List</p>
				<div className="flex flex-row mb-4 gap-10 w-full">
					<MtnButton
						label="Add Society"
						onClick={() => (
							setIsModalOpen(true)
						)}
						className="w-1/2 p-3 mb-0 bg-blue-500 text-white text-sm"
					/>
				</div>

				<MaterialReactTable table={table} />

			</div>
			<Toast position="top-right" onInit={e => toast = e} />
			<AddSocietyModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
			<EditSocietyModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				rowData={selectedRowData}
				loading={isLoadingModalOpen}
				done={() => setIsLoadingModalOpen(false)}
			/>
		</>

	);
}; 
