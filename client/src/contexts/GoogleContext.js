import React, { useContext, useCallback, useState } from "react";
import { useApp } from "../contexts/AppContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const {
		axiosInstance,
		googleDirectoryFlag,
		setGoogleDirectoryFlag,
		setAuthentication,
	} = useApp();
	const [library, setLibrary] = useLocalStorage("library", []);
	const [currentBook, setCurrentBook] = useState();
	const [playingBook, setPlayingBook] = useState();
	const [playingChapter, setPlayingChapter] = useState();

	const getLibrary = useCallback(async () => {
		if (googleDirectoryFlag.exists) {
			const response = await axiosInstance.get(`/google/library`);
			const sortedLibrary = response.data.sort((book1, book2) =>
				book1.name.localeCompare(book2.name)
			);

			setLibrary(sortedLibrary);
		}
	}, [axiosInstance, setLibrary, googleDirectoryFlag]);

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

	async function setRootDirectory(rootId) {
		const response = await axiosInstance.post(`/player/rootDirectory`, {
			data: {
				rootId: rootId,
			},
		});

		setGoogleDirectoryFlag((prevState) => ({
			exists: response.data.rootFlag,
			update: !prevState.update,
		}));
	}

	async function logout() {
		await axiosInstance.post(`/auth/logout`);
		setLibrary(null);
		setAuthentication({ isAuthenticated: false });
	}

	useEffectSkipFirst(() => {
		getLibrary();
	}, [googleDirectoryFlag, getLibrary]);

	const value = {
		getFolders,
		setRootDirectory,
		library,
		getLibrary,
		logout,
		currentBook,
		setCurrentBook,
		playingBook,
		setPlayingBook,
		setPlayingChapter,
		playingChapter,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
