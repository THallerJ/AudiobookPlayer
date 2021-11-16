import React, { useContext } from "react";
const axios = require("axios");

const GoogleContext = React.createContext();

axios.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error) {
		if (error.response.status === 401) {
			const originalReq = error.config;

			await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/auth/refresh_token`,
				{ withCredentials: true }
			);

			return new Promise((resolve, reject) => {
				axios
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

export const GoogleContextProvider = ({ children }) => {
	async function getFolders() {
		const response = await axios.get(
			`${process.env.REACT_APP_SERVER_URL}/google/folders`,
			{
				withCredentials: true,
			}
		);

		console.log(response);
	}

	const value = {
		getFolders,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
