import { useEffect, useState } from "react";
import Login from "./components/Login.js";
import LoginPrivateRoute from "./components/LoginPrivateRoute";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
const axios = require("axios");

function App() {
	const [authentication, setAuthentication] = useState({
		isInitializing: true,
		isAuthenticated: false,
	});

	useEffect(() => {
		axios
			.get("http://localhost:5000/auth/isLoggedIn", {
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
		<div className="App">
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
				<h1>Loading</h1>
			)}
		</div>
	);
}

export default App;
