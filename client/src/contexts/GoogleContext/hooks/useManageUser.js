import { useApp } from '../../AppContext/AppContext';

const useManageUser = (setPlayingBook, setCurrentBook, setPlayingChapter) => {
  const { axiosInstance, setGoogleDirectoryExists, setRootUpdatedAt } =
    useApp();

  const setRootDirectory = async (rootId) => {
    setPlayingBook(null);
    setCurrentBook(null);
    setPlayingChapter(null);
    const response = await axiosInstance.post(`/user/setRootDirectory`, {
      data: {
        rootId,
      },
    });

    setGoogleDirectoryExists(response.data.rootUpdatedAt !== null);
    setRootUpdatedAt(response.data.rootUpdatedAt);
  };

  return { setRootDirectory };
};

export default useManageUser;
