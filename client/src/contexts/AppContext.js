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
import axios from "axios";

const AppContext = React.createContext();

const axiosInstance = axios.create({
	withCredentials: true,
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
	const [rootUpdatedAt, setRootUpdatedAt] = useLocalStorage(
		"rootUpdatedAt",
		null
	);
	const [serverUrl, setServerUrl] = useState();

	useMemo(() => {
		axiosInstance.interceptors.response.use(
			(response) => {
				return response;
			},
			async (error) => {
				const originalConfig = error.config;
				const refreshUrl = "/auth/refresh_token";

				// we previously called the refresh token api
				if (originalConfig.url === refreshUrl) {
					return;
					// we made an api call that failed due to an expired access token. This was also the first time making the api call
				} else if (error.response.status === 401 && !originalConfig.done) {
					originalConfig.done = true;

					await axiosInstance.post(refreshUrl);

					return axiosInstance(originalConfig);
				} else {
					setAxiosError({
						code: error.response.status,
						statusText: error.response.data.error,
					});
				}

				return Promise.reject(error);
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

	useEffect(() => {
		getServerUrl();
	}, []);

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

	const getServerUrl = async () => {
		const url = await axiosInstance.get("/general/serverUrl");
		setServerUrl(url.data);
	};

	const value = {
		authentication,
		setAuthentication,
		checkAuthentication,
		googleDirectoryExists,
		setGoogleDirectoryExists,
		axiosInstance,
		toggleDarkMode,
		theme,
		setDarkModeEnabled,
		axiosError,
		setAxiosError,
		serverUrl,
		rootUpdatedAt,
		setRootUpdatedAt,
	};

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
