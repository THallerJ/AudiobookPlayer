import React, { useContext, useCallback, useState } from "react";
import { useApp } from "../AppContext/AppContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import useEffectSkipFirst from "../../hooks/useEffectSkipFirst";
import useLocalStorageRef from "../../hooks/useLocalStorageRef";

const GoogleContext = React.createContext();

export const GoogleContextProvider = ({ children }) => {
	const {
		axiosInstance,
		googleDirectoryExists,
		setGoogleDirectoryExists,
		setAuthentication,
		setRootUpdatedAt,
		rootUpdatedAt,
	} = useApp();
	const [library, setLibrary, libraryRef] = useLocalStorageRef("library", []);
	const [overridedCovers, setOverridedCovers] = useLocalStorage(
		"overridedCovers",
		[]
	);
	const [currentBook, setCurrentBook] = useState();
	const [playingBook, setPlayingBook] = useState();
	const [playingChapter, setPlayingChapter] = useState();
	const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
	const [isRefreshingLibrary, setIsRefreshingLibrary] = useState(false);

	const fetchLibrary = useCallback(async () => {
		if (googleDirectoryExists) {
			const response = await axiosInstance.get(`/google/library`);
			const sortedLibrary = response.data.sort((book1, book2) => {
				overridedCovers.forEach((cover) => {
					if (cover.id === book1.id) {
						book1.coverImageUrl = cover.coverImageUrl;
					} else if (cover.id === book2.id) {
						book2.coverImageUrl = cover.coverImageUrl;
					}
				});

				return book1.name.localeCompare(book2.name);
			});

			setLibrary(sortedLibrary);
		}
	}, [axiosInstance, setLibrary, googleDirectoryExists, library]);

	const refreshLibrary = async () => {
		setIsRefreshingLibrary(true);
		await fetchLibrary();
		setIsRefreshingLibrary(false);
	};

	const loadLibrary = async () => {
		setIsLoadingLibrary(true);
		await fetchLibrary();
		setIsLoadingLibrary(false);
	};

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
		[libraryRef]
	);

	const getBookCovers = async (page) => {
		if (currentBook) {
			const response = await axiosInstance.get("/google/getBookCovers", {
				params: { title: currentBook.name, page: page },
			});

			return response.data;
		}
	};

	const updateBookCover = (newCoverUrl) => {
		setLibrary((prevState) => {
			return prevState.map((obj) => {
				if (obj.id === currentBook.id)
					return { ...obj, coverImageUrl: newCoverUrl };
				else return obj;
			});
		});
	};

	const resetMediaPlayer = () => {
		setPlayingBook(null);
		setCurrentBook(null);
		setPlayingChapter(null);
	};

	const setRootDirectory = async (rootId) => {
		resetMediaPlayer();

		const response = await axiosInstance.post(`/user/setRootDirectory`, {
			data: {
				rootId: rootId,
			},
		});

		setGoogleDirectoryExists(response.data.rootUpdatedAt !== null);
		setRootUpdatedAt(response.data.rootUpdatedAt);
	};

	const logout = async () => {
		resetMediaPlayer();
		await axiosInstance.post(`/auth/logout`);
		setAuthentication({ isAuthenticated: false });
	};

	useEffectSkipFirst(() => {
		loadLibrary();
	}, [rootUpdatedAt]);

	const value = {
		getFolders,
		setRootDirectory,
		library,
		refreshLibrary,
		logout,
		currentBook,
		setCurrentBook,
		playingBook,
		setPlayingBook,
		setPlayingChapter,
		playingChapter,
		getBookAndChapter,
		getBookCovers,
		updateBookCover,
		setOverridedCovers,
		isLoadingLibrary,
		setIsLoadingLibrary,
		isRefreshingLibrary,
	};

	return (
		<GoogleContext.Provider value={value}>{children}</GoogleContext.Provider>
	);
};

export const useGoogle = () => useContext(GoogleContext);
