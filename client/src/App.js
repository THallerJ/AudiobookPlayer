import { useEffect, useState } from "react";
import Login from "./components/Login.js";
import LoginPrivateRoute from "./components/LoginPrivateRoute";
import Dashboard from "./components/Dashboard";
import { CircularProgress, Box } from "@mui/material";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import lightTheme from "./themes/lightTheme";
import darkTheme from "./themes/darkTheme";
import { GoogleContextProvider } from "./contexts/GoogleContext";
import { useApp } from "./contexts/AppContext";

function App() {
	const { checkAuthentication, authentication } = useApp();
	const [theme, setTheme] = useState(lightTheme);

	useEffect(() => {
		checkAuthentication();
	}, [checkAuthentication]);

	return (
		<ThemeProvider theme={theme}>
			<DashboardContextProvider>
				<GoogleContextProvider>
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
		</ThemeProvider>
	);
}

export default App;
