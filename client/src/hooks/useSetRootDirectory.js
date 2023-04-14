import axios from 'axios';

const useSetRootDirectory = (
  setSound,
  setPlayingBook,
  setCurrentBook,
  setPlayingChapter,
  setGoogleDirectoryExists,
  setRootUpdatedAt
) => {
  const setRootDirectory = async (rootId) => {
    setPlayingChapter(null);
    setPlayingBook(null);
    setCurrentBook(null);

    setSound((prevState) => {
      if (prevState) prevState.unload();
      return null;
    });

    localStorage.clear();

    const response = await axios.post(`/user/setRootDirectory`, {
      data: {
        rootId,
      },
    });

    setGoogleDirectoryExists(response.data.rootUpdatedAt !== null);
    setRootUpdatedAt(response.data.rootUpdatedAt);
  };

  return setRootDirectory;
};

export default useSetRootDirectory;
