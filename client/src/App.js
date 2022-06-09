import React, { Suspense, useEffect } from "react";
import Login from "./components/Login/Login.js";
import AuthPrivateRoute from "./components/Login/AuthPrivateRoute";
import GlobalStyles from "@mui/material/GlobalStyles";
import Dashboard from "./components/Dashboard/Dashboard";
import {
	CircularProgress,
	Box,
	CssBaseline,
	Snackbar,
	Alert,
} from "@mui/material";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import { GoogleContextProvider } from "./contexts/GoogleContext";
import { useApp } from "./contexts/AppContext";

const About = React.lazy(() => import("./components/Dashboard/About"));

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
								<Route
									exact
									path="/about"
									render={() => (
										<Suspense fallback={null}>
											<About />
										</Suspense>
									)}
								/>
								<AuthPrivateRoute
									exact
									path="/login"
									redirect="/"
									doRedirect={authentication.isAuthenticated}
									component={() => (
										<Suspense fallback={null}>
											<Login />
										</Suspense>
									)}
								/>
								<AuthPrivateRoute
									exact
									path="/"
									redirect="/login"
									doRedirect={!authentication.isAuthenticated}
									component={() => (
										<Suspense fallback={null}>
											<Dashboard />
										</Suspense>
									)}
								/>
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
