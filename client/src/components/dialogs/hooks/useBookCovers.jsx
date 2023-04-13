import { useState, useEffect } from 'react';
import useApiProgressCallback from '../../../hooks/useApiProgressCallback';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';
import BookCoverSelect from '../../books/components/BookCoverSelect';

const useBookCovers = () => {
  const [coverResp, setCoverResp] = useState([]);
  const { getBookCovers } = useGoogle();
  const [bookCovers, setBookCovers] = useState([]);
  const [selectedCover, setSelectedCover] = useState();

  const [loading, getCovers] = useApiProgressCallback(async () => {
    const response = await getBookCovers(0);
    setCoverResp(response);
  }, [getBookCovers, setCoverResp]);

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
