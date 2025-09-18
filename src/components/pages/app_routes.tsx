import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { IAppState, IConfig, IUserState } from "../../core/interfaces";
import { GetFrontendConfig } from "../../core/services/app.services";
import { RootState } from "../../core/stores";
import { setAppLoading, setFrontendConfig } from "../../core/stores/slices/app_slice";
import { setChurchId } from "../../core/utility";
import Dashboard from "./dashboard/_page";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "../Assets";
import { DotLoader } from "../layout/Loader/_dot_loader";
import { PageLayout } from "./_layout/_component";
import { MemberList } from "./members/_page";
import { CountryList } from "./nationalities/_page";
import { CountryEdit } from "./nationalities/countryedit";
import { CountryCreate } from "./nationalities/countrycreate";
import { SocietyList } from "./socities/_page";
import { SocietyEdit } from "./socities/societyedit";
import { SocietyCreate } from "./socities/societycreate";
import { MarriageList } from "./marriage/_page";

import { BaptismList } from "./baptism/_page";
import { FirstCommunionList } from "./firstcommunioun/_page";

import { ConfirmationList } from "./confirmation/_page";

import { DeathList } from "./death/_page";
import { DeathEdit } from "./death/editdeath";
import { DeathCreate } from "./death/createdeath";
import Login from "./auth/login/Login";
import { ContributionList } from "./contribution/_page";
 


export const AppRoutes = () => {
	const dispatch = useDispatch();
	const [configLoaded, setConfigLoaded] = useState<boolean>(false)
	const appState = useSelector<RootState, IAppState>((state) => state.app);

	const initQuery = useQuery<IConfig>({
		retry: (count, err) => count < 3,
		staleTime: Infinity,
		queryKey: ["initQuery"],
		queryFn: () => GetFrontendConfig().then(res => res.data),
		onSuccess: (data) => onInitSuccess(data)
	});

	const onInitSuccess = (res: IConfig) => {
		document.title = res?.appName!;
	
		//setBaseApi(res?.apiBaseUrl!);
		setChurchId(res?.churchId!);
		dispatch(setFrontendConfig(res));
		setConfigLoaded(true);
	}

	const toCamel = (o: any) => {
		var newO: any, origKey, newKey, value
		if (o instanceof Array) {
			return o.map(function (value) {
				if (typeof value === "object") {
					value = toCamel(value)
				}
				return value
			})
		} else {
			newO = {}
			for (origKey in o) {
				if (o.hasOwnProperty(origKey)) {
					newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
					value = o[origKey]
					if (value instanceof Array || (value !== null && value.constructor === Object)) {
						value = toCamel(value)
					}
					newO[newKey] = value
				}
			}
		}
		return newO
	};
 
	useEffect(() => {
		document.body.style.overflow = appState.loading ? 'hidden' : 'auto';
	}, [appState.loading]);

	useEffect(() => {
		dispatch(setAppLoading(initQuery?.isLoading));

		return () => { }
	}, [initQuery.isLoading]);


	return (
		<>
			{/* <ErrorBoundary FallbackComponent={ErrorFallback}> </ErrorBoundary>*/}
			<BrowserRouter>
				{appState.loading ? (
					<div className='absolute inset-0 flex justify-center bg-gray-100 bg-opacity-70 items-center z-30'>
					<div className="w-32 h-auto shadow-lg rounded-md bg-white">
						{/* <Icons.MtnLogoSvg className="w-20 mx-auto mt-3" /> */}
						<div className="w-full text-center mb-3">
							<DotLoader className="bg-gray-200 mx-auto " />
						</div>
					</div>
				</div>
				) : null}
				{configLoaded ? (
					<Routes>
						
						<Route element={<PageLayout />}>
							
							<Route path="/" element={<Dashboard />} />
							<Route path="/member/memberlist" element={<MemberList />} />
							 
							<Route path="/country/countrylist" element={<CountryList />} />
							<Route path="/country/countryedit/:id" element={<CountryEdit />} />
							<Route path="/country/countrycreate" element={<CountryCreate />} />

							<Route path="/society/societylist" element={<SocietyList />} />
							<Route path="/society/societyedit/:id" element={<SocietyEdit />} />
							<Route path="/society/societycreate" element={<SocietyCreate />} />

							<Route path="/marriage/marriagelist" element={<MarriageList />} />
							 
							<Route path="/baptism/baptismlist" element={<BaptismList />} />
						 
							<Route path="/firstcommunion/firstcommunionlist" element={<FirstCommunionList />} />
							 
							<Route path="/confirmation/confirmationlist" element={<ConfirmationList />} />

							<Route path="/contribution/contributionlist" element={<ContributionList />} />
							 
							<Route path="/death/deathlist" element={<DeathList />} />
							<Route path="/death/deathcreate" element={<DeathCreate />} />
							<Route path="/death/deathedit/:id" element={<DeathEdit />} />
							<Route path="/login" element={<Login />} />
						</Route>
					</Routes>
				) : null}
			</BrowserRouter>
		</>

	);
};
