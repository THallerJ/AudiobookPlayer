import { useEffect } from "react";
import Login from "./components/Login.js";
import LoginPrivateRoute from "./components/LoginPrivateRoute";
import Dashboard from "./components/Dashboard";
import CircularProgress from "@mui/material/CircularProgress";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DashboardContextProvider } from "./contexts/DashboardContext";
import { GoogleContextProvider } from "./contexts/GoogleContext";
import { useApp } from "./contexts/AppContext";

const theme = createTheme({
	drawer: {
		width: 240,
	},
	palette: {
		secondary: {
			light: "#b1b1b1",
			main: "#9e9e9e",
			dark: "#6e6e6e",
			contrastText: "#000",
		},
	},
});

function App() {
	const { checkAuthentication, authentication } = useApp();

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
						<CircularProgress />
					)}
				</GoogleContextProvider>
			</DashboardContextProvider>
		</ThemeProvider>
	);
}

export default App;
