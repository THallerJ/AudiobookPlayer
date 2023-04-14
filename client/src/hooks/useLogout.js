import axios from 'axios';

const useLogout = (
  setAuthentication,
  setSound,
  setPlayingChapter,
  setPlayingBook,
  setCurrentBook
) => {
  const logout = async () => {
    setPlayingChapter(null);
    setPlayingBook(null);
    setCurrentBook(null);

    setSound((prev) => {
      if (prev) prev.unload();
      return null;
    });

    localStorage.clear();
    await axios.post(`/auth/logout`);
    setAuthentication({ isAuthenticated: false });
  };

  return logout;
};

export default useLogout;
