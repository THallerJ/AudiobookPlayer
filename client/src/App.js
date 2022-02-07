import { useEffect } from "react";
import Login from "./components/Login.js";
import LoginPrivateRoute from "./components/LoginPrivateRoute";
import GlobalStyles from "@mui/material/GlobalStyles";
import Dashboard from "./components/Dashboard";
import {
	CircularProgress,
	Box,
	CssBaseline,
	Snackbar,
	Alert,
} from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import { GoogleContextProvider } from "./contexts/GoogleContext";
import { useApp } from "./contexts/AppContext";

function App() {
	const {
		checkAuthentication,
		authentication,
		theme,
		axiosError,
		setAxiosError,
	} = useApp();

	useEffect(() => {
		checkAuthentication();
	}, [checkAuthentication]);

	function openSnackbar() {
		return axiosError;
	}

	function closeSnackbar() {
		setAxiosError(null);
	}

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles
				styles={{
					"*::-webkit-scrollbar": {
						width: 5,
					},
					"*::-webkit-scrollbar-thumb": {
						backgroundColor: theme.palette.scrollbar.thumb,
					},
				}}
			/>
			<CssBaseline>
				<DashboardContextProvider>
					<GoogleContextProvider>
						{axiosError ? (
							<Snackbar
								open={openSnackbar}
								onClose={closeSnackbar}
								autoHideDuration={5000}
								anchorOrigin={{ vertical: "top", horizontal: "center" }}
							>
								<Alert
									onClose={closeSnackbar}
									severity="error"
								>{`${axiosError.code}: ${axiosError.statusText}`}</Alert>
							</Snackbar>
						) : null}
						{!authentication.isInitializing ? (
							<Router>
								<Route exact path="/login" component={Login} />
								<Switch>
									<LoginPrivateRoute
										exact
										path="/"
										component={Dashboard}
										isAuthenticated={authentication.isAuthenticated}
									/>
								</Switch>
							</Router>
						) : (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: "100vh",
								}}
							>
								<CircularProgress />
							</Box>
						)}
					</GoogleContextProvider>
				</DashboardContextProvider>
			</CssBaseline>
		</ThemeProvider>
	);
}

export default App;
