import React, { useContext, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import useLocalStorage from "../hooks/useLocalStorage";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const { axiosInstance, setGoogleDirectoryFlag } = useAuth();
	const [library, setLibrary] = useLocalStorage("library", []);

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

	const getLibrary = useCallback(async () => {
		const response = await axiosInstance.get(`/google/library`);
		setLibrary(response.data);
	}, [axiosInstance, setLibrary]);

	async function setRootDirectory(rootId) {
		const response = await axiosInstance.post(`/player/rootDirectory`, {
			data: {
				rootId: rootId,
			},
		});

		setGoogleDirectoryFlag((prevState) => ({
			existsFlag: response.data.rootFlag,
			updateFlag: !prevState.updateFlag,
		}));
	}

	const value = {
		getFolders,
		setRootDirectory,
		library,
		getLibrary,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
