import { useEffect, useState } from "react";
import Login from "./components/Login.js";
import LoginPrivateRoute from "./components/LoginPrivateRoute";
import Dashboard from "./components/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import { GoogleContextProvider } from "./contexts/GoogleContext";

const axios = require("axios");

const theme = createTheme({
	drawer: {
		width: 240,
	},
});

function App() {
	const [authentication, setAuthentication] = useState({
		isInitializing: true,
		isAuthenticated: false,
	});

	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_SERVER_URL}/auth/isLoggedIn`, {
				withCredentials: true,
			})
			.then((res) => {
				setAuthentication({
					isInitializing: false,
					isAuthenticated: res.data.result,
				});
			});
	}, []);

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
						<CircularProgress />
					)}
				</GoogleContextProvider>
			</DashboardContextProvider>
		</ThemeProvider>
	);
}

export default App;
