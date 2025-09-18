import { forwardRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Card, CardContent, Typography, Grid, Button, Box, Badge, ListItemAvatar, Avatar } from "@mui/material";
import { services } from "../../../data/services_data";
import ServiceLineChart from "./ServiceLineChart";
import { IToastHandler, Toast } from "../../layout/Toast";
import { Member, MemberBirthdays } from "../../../core/interfaces";
import "react-datepicker/dist/react-datepicker.css";
import useRedirectToAdminPage from "../auth/login/AuthRedirect";
import MailIcon from '@mui/icons-material/Mail';
import CakeIcon from '@mui/icons-material/Cake';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';


import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	List,
	ListItem,
	ListItemText,
  } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useQuery } from "@tanstack/react-query";
import { GetMemberBirthdayList } from "../../../core/services/member.services";
import { setAppLoading } from "../../../core/stores/slices/app_slice";
import { useDispatch } from "react-redux";

const Dashboard = () => {
	useRedirectToAdminPage("");
	const navigate = useNavigate();
	let toast: IToastHandler;
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);
	const [serviceData, setServiceData] = useState<{ [key: string]: { total: number; active: number; recentMembers?: Member[]; monthlyAdditions?: any[] } }>({});
	const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
	const [rows, setRows] = useState<MemberBirthdays[]>([]);
	const [birthdayRowsTotal, setBirthdayRowsTotal] = useState(0);

	const handleClickOpen = () => {
		setOpen(true);
	  };

	const handleClose = () => {
		setOpen(false);
	  };

	   
	const memberBithdayListQuery = useQuery({
			retry: (count) => count < 1,
			staleTime: Infinity,
			queryKey: ["GetMemberBirthdayList"],
			queryFn: () => GetMemberBirthdayList().then((res) => res.data),
			onSuccess: (birthData) => {
				 
				setRows(birthData);
				setBirthdayRowsTotal(birthData.length);
			},
		});

	useEffect(() => {
		dispatch(setAppLoading(memberBithdayListQuery?.isFetching));
	}, [memberBithdayListQuery.isFetching]);

	useEffect(() => {
		const getData = async () => {
			const loadingState: { [key: string]: boolean } = {};
			const serviceState: { [key: string]: any } = {};

			for (const service of services) {
				loadingState[service.title] = true;
				try {
					const data = await service.fetchData();
					const monthlyAdditions = service.getMonthlyAdditions(data);
					serviceState[service.title] = {
						...service.getCounts(data),
						recentMembers: service.getRecent ? service.getRecent(data) : [],
						monthlyAdditions: Object.keys(monthlyAdditions).map((month) => ({ month, count: monthlyAdditions[month] })),
					};
				} catch (error) {
					console.error(`Error fetching data for ${service.title}:`, error);
				} finally {
					loadingState[service.title] = false;
				}
			}

			setLoading(loadingState);
			setServiceData(serviceState);
		};

		getData();
	}, []);

	const renderLoading = () => (
		<Box display="flex" justifyContent="center" alignItems="center" height="100px">
			<CircularProgress />
		</Box>
	);


	 

	return (
		<>
			<Box sx={{ padding: "16px" }}>
				<Typography variant="h4" gutterBottom>
					Welcome to Achimota Senior High School Portal
				</Typography>
				<Typography variant="body1" color="textSecondary" paragraph>
					You can view and manage all services available.
				</Typography>
				<Typography variant="h5" gutterBottom>
					Available Services
					<span style={{ marginLeft: '8px' }}></span>
					  
				</Typography>
				<Box display="flex" justifyContent="flex-end">
				<Button variant="outlined" onClick={handleClickOpen}>
		 Upcoming Birthdays
		 <span style={{ marginLeft: '8px' }}></span>
	     <Badge badgeContent={birthdayRowsTotal} color="primary">
         <MailIcon color="action" />
         </Badge>
      </Button>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
         aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Upcoming Birthday Celebrants"}</DialogTitle>
        <DialogContent>
		<List>
          {rows.map((birthday, index) => (
            <ListItem key={index}>
				<CakeIcon color="action" />
				<span style={{ marginLeft: '8px' }}></span>
				<ListItemAvatar> <Avatar src={birthday.imageUrl}/></ListItemAvatar>
              <ListItemText
                primary={birthday.firstName + ' ' + birthday.lastName}
                secondary={new Date(birthday.dateOfBirth).toLocaleDateString()}
              > </ListItemText>
            </ListItem>
          ))}
        </List>
		</DialogContent>
		<DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog> 
	  </Box>
	<br></br>
	<br></br>
				<Grid container spacing={3}>
					{services.map(({ title, description, url }, index) => (
						<Grid item xs={12} sm={6} md={4} key={index}>
							<Card
								sx={{
									borderRadius: "30px",
									transition: "transform 0.3s ease, box-shadow 0.3s ease",
									backgroundColor: "#6098ca",
									"&:hover": {
										transform: "scale(1.05)",
										boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
										backgroundColor: "#008aaf"
									},
								}}
							>
								<Box
									sx={{
										backgroundColor: "#0054a0",
										color: "white",
										padding: "16px",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Typography
										variant="h5"
										sx={{
											textAlign: "center",
											width: "100%",
										}}
										className="font-semibold"
									>
										{title}
									</Typography>
								</Box>
								{loading[title] ? (
									renderLoading()
								) : (
									<CardContent>
										<Typography
											variant="body2"
											color="textSecondary"
											sx={{
												color: "whiteSmoke",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											{description}
										</Typography>
										<Box mt={2} className="flex flex-row justify-between mx-10">
											<Typography
												variant="body5"
												className="text-white text-2xl">
												<strong>Total:</strong> {serviceData[title]?.total || 0}
											</Typography>
											<Typography
												variant="body5"
												className="text-white text-2xl">
												<strong>Active:</strong> {serviceData[title]?.active || 0}
											</Typography>
										</Box>
										<Box mt={2}>
											<Typography
												variant="subtitle2"
												className="text-white text-2xl">Monthly Additions</Typography>
											<ServiceLineChart data={serviceData[title]?.monthlyAdditions || []} />
										</Box>
										<Box mt={2}>
											<Button
												variant="contained"
												sx={{
													backgroundColor: "#dbb800",
													color: "#fff",
													borderRadius: "30px",
													"&:hover": {
														backgroundColor: "#FFC107",
													},
												}}
												onClick={() => navigate(url)}
												fullWidth
											>
												Go to Service
											</Button>
										</Box>
									</CardContent>
								)}
							</Card>
						</Grid>
					))}
				</Grid>
				
			</Box>
			<Toast position="top-right" onInit={(e) => (toast = e)} />
		</>
	);
};

export default Dashboard;