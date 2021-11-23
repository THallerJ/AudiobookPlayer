import React, { useContext, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const { axiosInstance } = useAuth();

	const getFolders = useCallback(
		async (directory) => {
			const response = await axiosInstance.get(`/google/folders`, {
				params: {
					directory: directory ? directory : null,
				},
			});

			return response.data;
		},
		[axiosInstance]
	);

	const value = {
		getFolders,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
