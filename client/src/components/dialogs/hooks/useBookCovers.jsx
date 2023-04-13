import { useState, useEffect, useCallback } from 'react';
import useFetchProgressCallback from '../../../hooks/useFetchProgressCallback';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';
import BookCoverSelect from '../../books/components/BookCoverSelect';

const useBookCovers = () => {
  const [coverResp, setCoverResp] = useState([]);
  const { getBookCovers } = useGoogle();
  const [bookCovers, setBookCovers] = useState([]);
  const [selectedCover, setSelectedCover] = useState();

  const getCoversCallback = useCallback(async () => {
    const response = await getBookCovers(0);
    setCoverResp(response);
  }, [getBookCovers, setCoverResp]);

  const [loading, getCovers] = useFetchProgressCallback(getCoversCallback);

  useEffect(() => {
    getCovers();
  }, [getBookCovers, getCovers]);

  useEffect(() => {
    coverResp.forEach((cover, index) => {
      setBookCovers((prevState) => {
        const newBookCover = (
          <BookCoverSelect
            bookCoverUrl={cover.volumeInfo.imageLinks.thumbnail}
            selectedCover={selectedCover}
            setSelectedCover={setSelectedCover}
          />
        );

        return index === 0 ? [newBookCover] : [...prevState, newBookCover];
      });
    });
  }, [coverResp, selectedCover]);

  return [bookCovers, selectedCover, loading];
};

export default useBookCovers;
