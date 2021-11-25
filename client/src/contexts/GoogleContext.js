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

	function setRootDirectory(rootId) {
		axiosInstance.post(`/player/rootDirectory`, {
			data: {
				rootId: rootId,
			},
		});
	}

	const value = {
		getFolders,
		setRootDirectory,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
