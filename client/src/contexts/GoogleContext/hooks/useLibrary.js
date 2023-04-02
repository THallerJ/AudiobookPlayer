import { useCallback } from "react";
import { useApp } from "../../AppContext/AppContext";

const useLibrary = (library, libraryRef) => {
	const { axiosInstance } = useApp();

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

	return { getFolders, getBookAndChapter };
};

export default useLibrary;
