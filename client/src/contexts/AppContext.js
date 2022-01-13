import React, { useContext, useState, useCallback, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import lightTheme from "../themes/lightTheme";
import darkTheme from "../themes/darkTheme";

const axios = require("axios");

const AppContext = React.createContext();

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

export const AppContextProvider = ({ children }) => {
	const [authentication, setAuthentication] = useState({
		isInitializing: true,
		isAuthenticated: false,
	});
	const [googleDirectoryExists, setGoogleDirectoryExists] = useState(null);
	const [darkModeEnabled, setDarkModeEnabled] = useLocalStorage(
		"darkModeEnabled",
		"false"
	);
	const [theme, setTheme] = useState(lightTheme);

	const toggleDarkMode = useCallback(() => {
		setDarkModeEnabled((prevState) => {
			if (prevState === "true") {
				return "false";
			} else {
				return "true";
			}
		});
	}, [setDarkModeEnabled]);

	useEffect(() => {
		darkModeEnabled === "true" ? setTheme(darkTheme) : setTheme(lightTheme);
	}, [toggleDarkMode, darkModeEnabled]);

	const checkAuthentication = useCallback(async () => {
		const response = await axiosInstance.get(`/auth/isLoggedIn`);

		setAuthentication({
			isInitializing: false,
			isAuthenticated: response.data.loggedIn,
		});

		setGoogleDirectoryExists(response.data.rootFlag);
	}, [setGoogleDirectoryExists]);

	const value = {
		authentication,
		setAuthentication,
		checkAuthentication,
		googleDirectoryExists,
		setGoogleDirectoryExists,
		axiosInstance,
		theme,
		toggleDarkMode,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
