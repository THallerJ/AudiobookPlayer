import { useApp } from "../../AppContext/AppContext";

const useManageUser = (
	setPlayingBook,
	setCurrentBook,
	setPlayingChapter,
	setGoogleDirectoryExists,
	setRootUpdatedAt,
	setAuthentication
) => {
	const { axiosInstance } = useApp();

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

	return { setRootDirectory, logout };
};

export default useManageUser;
