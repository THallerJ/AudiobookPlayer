import React, { useContext, useState, useCallback } from "react";
const axios = require("axios");

const AuthContext = React.createContext();

const axiosInstance = axios.create({
	withCredentials: true,
	baseURL: process.env.REACT_APP_SERVER_URL,
});

axiosInstance.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error) {
		// refresh access token
		if (error.response.status === 401) {
			const originalReq = error.config;

			await axiosInstance.post(`/auth/refresh_token`);

			return new Promise((resolve, reject) => {
				axiosInstance
					.request(originalReq)
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		} else {
			return Promise.reject(error);
		}
	}
);

export const AuthContextProvider = ({ children }) => {
	const [authentication, setAuthentication] = useState({
		isInitializing: true,
		isAuthenticated: false,
	});
	const [googleDirectoryFlag, setGoogleDirectoryFlag] = useState({
		existsFlag: null,
		updateFlag: false,
	});

	const checkAuthentication = useCallback(async () => {
		const response = await axiosInstance.get(`/auth/isLoggedIn`);

		setAuthentication({
			isInitializing: false,
			isAuthenticated: response.data.loggedIn,
		});

		setGoogleDirectoryFlag((prevState) => ({
			existsFlag: response.data.rootFlag,
			updateFlag: !prevState.updateFlag,
		}));
	}, [setGoogleDirectoryFlag]);

	async function logout() {
		await axiosInstance.post(`/auth/logout`);
	}

	const value = {
		authentication,
		checkAuthentication,
		googleDirectoryFlag,
		setGoogleDirectoryFlag,
		logout,
		axiosInstance,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
