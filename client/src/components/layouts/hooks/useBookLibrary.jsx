import { useState, useEffect } from 'react';
import { useGoogle } from '../../../contexts/GoogleContext/GoogleContext';
import Book from '../../books/Book';

const useBookLibrary = () => {
  const [bookCovers, setBookCovers] = useState([]);
  const { library, isLoadingLibrary } = useGoogle();

  useEffect(() => {
    const temp = [];

    library.forEach((book) => {
      const newBookCover = { image: <Book book={book} />, key: book.id };
      temp.push(newBookCover);
    });

    setBookCovers(temp);
  }, [library]);

  return [bookCovers, isLoadingLibrary];
};

export default useBookLibrary;
