import React, {
	useContext,
	useState,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import lightTheme from "../themes/lightTheme";
import darkTheme from "../themes/darkTheme";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";

const axios = require("axios");

const AppContext = React.createContext();

const axiosInstance = axios.create({
	withCredentials: true,
	baseURL: process.env.REACT_APP_SERVER_URL,
});

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
	const [axiosError, setAxiosError] = useState();
	const [rootUpdated, setRootUpdated] = useState(false);

	useMemo(() => {
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
					setAxiosError({
						code: error.response.status,
						statusText: error.response.statusText,
					});
					return Promise.reject(error);
				}
			}
		);
	}, []);

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

	useEffectSkipFirst(() => {
		if (!authentication.isAuthenticated) localStorage.clear();
	}, [authentication]);

	const checkAuthentication = useCallback(async () => {
		const response = await axiosInstance.get(`/auth/isLoggedIn`);

		setAuthentication({
			isInitializing: false,
			isAuthenticated: response.data.loggedIn,
		});

		if (response.data.loggedIn) axiosInstance.post("/auth/notifyClientActive");

		setGoogleDirectoryExists(response.data.rootFlag);
		setRootUpdated((prevState) => !prevState);
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
		axiosError,
		setAxiosError,
		rootUpdated,
		setRootUpdated,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
