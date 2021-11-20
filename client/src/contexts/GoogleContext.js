import React, { useContext } from "react";
import { useAuth } from "../contexts/AuthContext";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const { axiosInstance } = useAuth();

	async function getFolders(directory) {
		const response = await axiosInstance.get(`/google/folders`, {
			params: {
				directory: directory ? directory : null,
			},
		});

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
