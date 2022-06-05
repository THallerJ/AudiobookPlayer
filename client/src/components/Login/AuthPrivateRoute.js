import React from "react";
import { Route, Redirect } from "react-router-dom";

const AuthPrivateRoute = ({
	component: Component,
	doRedirect,
	redirect,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				return doRedirect ? (
					<Redirect to={redirect} />
				) : (
					<Component {...props} />
				);
			}}
		/>
	);
};

export default AuthPrivateRoute;
