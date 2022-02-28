import React, { useContext, useCallback, useState } from "react";
import { useApp } from "../contexts/AppContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";
import useStateRef from "react-usestateref";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const {
		axiosInstance,
		googleDirectoryExists,
		setGoogleDirectoryExists,
		setAuthentication,
		rootUpdated,
		setRootUpdated,
	} = useApp();
	const [library, setLibrary] = useLocalStorage("library", []);
	const [loadingLibrary, setLoadingLibrary] = useState(false);
	const [currentBook, setCurrentBook] = useState();
	const [playingBook, setPlayingBook] = useState();
	const [playingChapter, setPlayingChapter] = useState();
	// eslint-disable-next-line
	const [initFlag, setInitFlag, initFlagRef] = useStateRef(false);

	const getLibrary = useCallback(async () => {
		var queryLibraryFlag;
		if (!initFlagRef.current) {
			queryLibraryFlag = !library || !library.length ? true : false;
		} else {
			queryLibraryFlag = true;
		}

		setInitFlag(true);

		if (googleDirectoryExists && queryLibraryFlag) {
			setLoadingLibrary(true);
			const response = await axiosInstance.get(`/google/library`);
			const sortedLibrary = response.data.sort((book1, book2) =>
				book1.name.localeCompare(book2.name)
			);

			setLoadingLibrary(false);
			setLibrary(sortedLibrary);
		}
	}, [
		axiosInstance,
		setLibrary,
		googleDirectoryExists,
		library,
		initFlagRef,
		setInitFlag,
	]);

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

	const getBookAndChapter = useCallback(
		(bookId, chapterId) => {
			if (library && library.length) {
				const book = library.find((element) => element.id === bookId);
				const chapterIndex = book.chapters.findIndex(
					(element) => element.id === chapterId
				);

				return {
					book: book,
					chapter: { data: book.chapters[chapterIndex], index: chapterIndex },
				};
			}

			return null;
		},

		[library]
	);

	function resetMediaPlayer() {
		setPlayingBook(null);
		setCurrentBook(null);
		setPlayingChapter(null);
	}

	async function setRootDirectory(rootId) {
		resetMediaPlayer();

		const response = await axiosInstance.post(`/player/setRootDirectory`, {
			data: {
				rootId: rootId,
			},
		});

		setGoogleDirectoryExists(response.data.rootFlag);
		setRootUpdated((prevState) => !prevState);
	}

	async function logout() {
		resetMediaPlayer();

		await axiosInstance.post(`/auth/logout`);
		setAuthentication({ isAuthenticated: false });
	}

	useEffectSkipFirst(() => {
		getLibrary();
	}, [rootUpdated]);

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
		getBookAndChapter,
		loadingLibrary,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
