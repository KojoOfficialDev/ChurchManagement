import { useQuery } from "@tanstack/react-query";
import { exportCsv } from "json2csv-export";
import moment from "moment";
import { useEffect, useState } from "react";
import DataGrid from 'react-data-grid';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import { IPaginatableQuery, IUserState } from "../../../core/interfaces";
import { GetMemberList,DeleteMember,SearchMemberList } from "../../../core/services/member.services";
import { RootState } from "../../../core/stores";
import { setAppLoading } from "../../../core/stores/slices/app_slice";
import { Icons } from "../../Assets";
import { DataPagination, IDataHandler } from "../../layout/DataPagination";
import { MtnButton } from "../../layout/MtnButton";
import { IToastHandler, Toast } from "../../layout/Toast";
import { format } from 'react-string-format';
import useRedirectToAdminPage from "../auth/login/AuthRedirect";
import { LazyLoadImage } from "react-lazy-load-image-component";
export const DeathList = () => {
 
	useRedirectToAdminPage("member/memberlist");
	let pagineHandler: IDataHandler;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	let toast: IToastHandler;


	const userState = useSelector<RootState, IUserState>((state) => state.user);

	const [isExportRequest, setIsExportRequest] = useState<boolean>(false);
	const [rows, setRows] = useState<any[]>([]);
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);
	const [rowsTotal, setRowsTotal] = useState(0);
	const [searchString, setSearchString] = useState("");

	const SearchRecord = async () => {
		var data = await SearchMemberList(searchString);
		setRows(data.data)
		setRowsTotal(data.data.length);
	
}

	const columns = [
		{ key: 'imageUrl', name: '', renderCell: (e: { row: any }) =>  <LazyLoadImage src={`${e.row?.imageUrl }`} className="w-20 h-20 rounded-md"/> ?? <span className='text-gray-400'>N/A</span> },
		{ key: 'membershipNumber', name: 'Member #', renderCell: (e: { row: any }) => e.row?.membershipNumber ?? <span className='text-gray-400'>N/A</span> },
		{ key: 'fullname', name: 'Name', renderCell: (e: { row: any }) => format(e.row?.title + " " +e.row?.firstName+ " " + e.row?.lastName ) ?? <span className='text-gray-400'>N/A</span> },
		{ key: 'gender', name: 'Gender', renderCell: (e: { row: any }) => e.row?.gender ?? <span className='text-gray-400'>N/A</span> },
		{ key: 'dayborn', name: 'Day born', renderCell: (e: { row: any }) => e.row?.dayBorn ?? <span className='text-gray-400'>N/A</span> },
		{ key: 'email', name: 'Email', renderCell: (e: { row: any }) => e.row?.email ?? <span className='text-gray-400'>N/A</span> },
		{ key: 'occupation', name: 'Occupation', renderCell: (e: { row: any }) => e.row?.occupation ?? <span className='text-gray-400'>N/A</span> },
		 { key: 'action', name: 'Actions', renderCell: (e: { row: any }) =>  <div className="flex  pb-4 flex-wrap gap-3 w-full"><div><Icons.Edit onClick={() => navigate('/member/memberedit/'+ e.row?.id)}  className="w-4 h-5 mt-2 text-blue dark:text-blue-400"></Icons.Edit></div><div><Icons.Delete onClick={() =>   DeleteRecord(e.row?.id)}  className="w-4 h-5 mt-2 text-red-500 dark:text-red-400"></Icons.Delete></div> </div> },
		 
	].map(d => ({ ...d, ['resizable']: true }));

	const DeleteRecord = async (id : number) => {
		 	await DeleteMember(id)
			memberListQuery?.refetch();
		 
	}
				
	const memberListQuery = useQuery({
		retry: (count) => count < 1,
		//enabled:false,
		staleTime: Infinity,
		queryKey: ["GetMemberList"],
		queryFn: () => GetMemberList( isExportRequest).then(res => res.data),
		onSuccess: (data) => {
			 
			if (!isExportRequest) {
				pagineHandler?.isLoading(false);
				setRows(data);
				setRowsTotal( data.length);
			} else {
				dispatch(setAppLoading(true));
				setIsExportRequest(false);

				const header = {
					membershipNumber:"Member Number",
					firstName:"First Name",
					lastName:"Last Name",
					gender:"Gender",
					occupation:"Occupation",
					email:"Email"
				};

				exportCsv({ header, data: data, filename: "members-list" });
				dispatch(setAppLoading(false));
			}
		},
	});

	useEffect(() => {
		dispatch(setAppLoading(memberListQuery?.isFetching));
	}, [memberListQuery.isFetching]);

	useEffect(() => {
		memberListQuery?.refetch();
	}, [isExportRequest,offset, limit]);

	return (<>
		<div className=''>
		<p className="font-medium text-2xl pb-1">Deceased List</p>
			<div className="flex bg-slate-200 py-3 px-4 flex-wrap gap-3 w-full">
				 
				<MtnButton label="Export" onClick={e => {
					if (rows.length == 0) {
						toast.Info("Export", "No data to export");
						return;
					}
					setIsExportRequest(true);
				}} className="w-max mb-0 bg-red-500 text-white" />

				{/* <MtnButton label="Add Member" onClick={() => navigate('/member/membercreate')} className="w-max mb-0 bg-blue-500 text-white" /> */}

				<div className="relative w-full mb-2">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icons.Search2 className="w-5 h-5 mt-2 text-gray-500 dark:text-gray-400" />
					</div>
					<input type="text" id="voice-search"
						className="bg-gray-50 border mt-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5 "
						placeholder="Search By Member Number or name"
						onKeyDown={e => {
							if (e.key === 'Enter') {
								SearchRecord();
							}
						}}
						onChange={(e) => setSearchString( e.target.value )} />
				</div>
			</div>
			<DataGrid rowHeight={40} className='rdg-light grid-container text-sm' columns={columns} rows={rows} />

			<div className="py-5 text-sm">
				<DataPagination
					onInit={e => pagineHandler = e}
					maxPageLength={20}
					rows={rows}
					limit={limit}
					showPerFetch={true}
					loading={memberListQuery.isLoading}
					isLoading={(state) => { }}
					onDataChange={async (e) => {
						setLimit(e?.limit)
						setOffset(e?.offset);
						memberListQuery.refetch();
						pagineHandler.isLoading(true);
					}}
					total={rowsTotal}
				/>
			</div>
		</div>
		<Toast position="top-right" onInit={e => toast = e} />
	</>

	);
}; 
