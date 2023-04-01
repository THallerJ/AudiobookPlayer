import { Suspense, useEffect, useCallback, lazy } from "react";
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
import { DashboardContextProvider } from "../../contexts/DashboardContext/DashboardContext";
import { GoogleContextProvider } from "../../contexts/GoogleContext/GoogleContext";
import { useApp } from "../../contexts/AppContext/AppContext";
import CenterWrapper from "../styled_components/CenterWrapper";

const Login = lazy(() => import("../login/Login"));
const LoginFailed = lazy(() => import("../login/LoginFailed"));
const Dashboard = lazy(() => import("../dashboard/Dashboard"));
const AppInfo = lazy(() => import("../dashboard/more/AppInfo"));
const PrivacyPolicy = lazy(() => import("../dashboard/more/PrivacyPolicy"));

const App = () => {
	const {
		authentication,
		theme,
		axiosError,
		setAxiosError,
		setGoogleDirectoryExists,
		rootUpdatedAt,
		setRootUpdatedAt,
		setAuthentication,
		axiosInstance,
	} = useApp();

	const checkAuthentication = useCallback(async () => {
		const response = await axiosInstance.get(`/auth/isLoggedIn`);

		setAuthentication({
			isInitializing: false,
			isAuthenticated: response.data.loggedIn,
		});

		if (response.data.loggedIn) axiosInstance.post("/auth/notifyClientActive");
		const rua = response.data.rootUpdatedAt;

		setGoogleDirectoryExists(rua !== null);

		if (rua && rua !== rootUpdatedAt)
			setRootUpdatedAt(response.data.rootUpdatedAt);
	}, [setGoogleDirectoryExists]);

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
