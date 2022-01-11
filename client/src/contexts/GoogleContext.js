import React, { useContext, useCallback, useState } from "react";
import { useApp } from "../contexts/AppContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useEffectSkipFirst from "../hooks/useEffectSkipFirst";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const {
		axiosInstance,
		googleDirectoryExists,
		setGoogleDirectoryExists,
		setAuthentication,
	} = useApp();
	const [library, setLibrary] = useLocalStorage("library", []);
	const [currentBook, setCurrentBook] = useState();
	const [playingBook, setPlayingBook] = useState();
	const [playingChapter, setPlayingChapter] = useState();
	const [rootUpdated, setRootUpdated] = useState(false);

	const getLibrary = useCallback(async () => {
		if (googleDirectoryExists) {
			const response = await axiosInstance.get(`/google/library`);
			const sortedLibrary = response.data.sort((book1, book2) =>
				book1.name.localeCompare(book2.name)
			);

			setLibrary(sortedLibrary);
		}
	}, [axiosInstance, setLibrary, googleDirectoryExists]);

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

	function getBookAndChapter(bookId, chapterId) {
		const book = library.find((element) => element.id === bookId);
		const chapterIndex = book.chapters.findIndex(
			(element) => element.id === chapterId
		);

		return {
			book: book,
			chapter: { data: book.chapters[chapterIndex], index: chapterIndex },
		};
	}

	async function setRootDirectory(rootId) {
		setPlayingBook(null);
		setCurrentBook(null);
		setPlayingChapter(null);

		const response = await axiosInstance.post(`/player/rootDirectory`, {
			data: {
				rootId: rootId,
			},
		});

		setGoogleDirectoryExists(response.data.rootFlag);
		setRootUpdated((prevState) => !prevState);
	}

	async function logout() {
		await axiosInstance.post("/player/deleteAllChapterProgress");
		await axiosInstance.post(`/auth/logout`);
		setLibrary(null);
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
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
