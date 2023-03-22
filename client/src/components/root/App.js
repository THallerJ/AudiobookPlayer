import React, { Suspense, useEffect } from "react";
import ProtectedRoute from "../login/ProtectedRoute";
import GlobalStyles from "@mui/material/GlobalStyles";
import {
	CircularProgress,
	CssBaseline,
	Snackbar,
	Alert,
	ThemeProvider,
} from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardContextProvider } from "../../contexts/DashboardContext";
import { GoogleContextProvider } from "../../contexts/GoogleContext";
import { useApp } from "../../contexts/AppContext";
import CenterWrapper from "../styled_components/CenterWrapper";

const Login = React.lazy(() => import("../login/Login"));
const LoginFailed = React.lazy(() => import("../login/LoginFailed"));
const Dashboard = React.lazy(() => import("../dashboard/Dashboard"));
const AppInfo = React.lazy(() => import("../dashboard/more/AppInfo"));
const PrivacyPolicy = React.lazy(() =>
	import("../dashboard/more/PrivacyPolicy")
);

const App = () => {
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

	const openSnackbar = () => {
		return axiosError;
	};

	const closeSnackbar = () => {
		setAxiosError(null);
	};

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles
				styles={{
					"*::-webkit-scrollbar": { width: theme.scrollbar.width },
					"*::-webkit-scrollbar-thumb": {
						backgroundColor: theme.palette.scrollbar.thumb,
						borderRadius: 4,
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
							<BrowserRouter>
								<Routes>
									<Route
										exact
										path="/appinfo"
										element={
											<Suspense fallback={null}>
												<AppInfo />
											</Suspense>
										}
									/>
									<Route
										exact
										path="/privacypolicy"
										element={
											<Suspense fallback={null}>
												<PrivacyPolicy />
											</Suspense>
										}
									/>
									<Route
										exact
										path="/failed"
										element={
											<Suspense fallback={null}>
												<LoginFailed />
											</Suspense>
										}
									/>
									<Route
										exact
										path="/login"
										element={
											<ProtectedRoute
												doRedirect={authentication.isAuthenticated}
												redirect="/"
											>
												<Suspense fallback={null}>
													<Login />
												</Suspense>
											</ProtectedRoute>
										}
									/>
									<Route
										exact
										path="/"
										element={
											<ProtectedRoute
												doRedirect={!authentication.isAuthenticated}
												redirect="/login"
											>
												<Suspense fallback={null}>
													<Dashboard />
												</Suspense>
											</ProtectedRoute>
										}
									/>
								</Routes>
							</BrowserRouter>
						) : (
							<CenterWrapper fullsize={true}>
								<CircularProgress />
							</CenterWrapper>
						)}
					</GoogleContextProvider>
				</DashboardContextProvider>
			</CssBaseline>
		</ThemeProvider>
	);
};

export default App;
