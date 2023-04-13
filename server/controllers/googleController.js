require('dotenv').config();
const axios = require('axios');
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');
const { extractLastNumber } = require('../utils/string-utils');
const { getImageColors } = require('../utils/color-utils');

const streamProxy = createProxyMiddleware({
  target: 'https://www.googleapis.com',
  changeOrigin: true,
  pathRewrite: (path, req) => {
    const fileId = req.params.id;
    return path.replace(
      `/google/stream/${fileId}`,
      `/drive/v3/files/${fileId}/?key=${process.env.GOOGLE_API_KEY}&alt=media`
    );
  },
});

const fetchBooks = async (accessToken, directory) => {
  const resp = await axios.get('https://www.googleapis.com/drive/v3/files', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q: `"${directory}" in parents and mimeType="application/vnd.google-apps.folder" and trashed = false`,
    },
  });

  return resp;
};

const fetchChapters = async (accessToken, bookId) => {
  const resp = await axios.get('https://www.googleapis.com/drive/v3/files', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      q: `"${bookId}" in parents and trashed = false`,
      fields: 'files(id, name)',
    },
  });

  return resp;
};

const fetchFolders = async (req, res) => {
  const user = req.authUser;
  const directory = req.query.directory ? req.query.directory : 'root';

  try {
    const response = await axios.get(
      'https://www.googleapis.com/drive/v3/files',
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        params: {
          q: `"${directory}" in parents and mimeType="application/vnd.google-apps.folder" and trashed = false`,
        },
      }
    );

    res.send(response.data.files);
  } catch (error) {
    res
      .status(error.response.status)
      .send({ error: 'There was a problem loading the folders' });
  }
};

const fetchBookCovers = async (
  accessToken,
  bookTitle,
  startIndex,
  maxResults
) => {
  const resp = await axios.get('https://www.googleapis.com/books/v1/volumes', {
    params: {
      q: `title:${bookTitle}`,
      orderBy: 'relevance',
      fields: 'items(volumeInfo(imageLinks/thumbnail))',
      startIndex,
      maxResults,
      accessToken,
    },
  });

  return resp;
};

// return an array of book covers
const getBookCovers = async (req, res) => {
  try {
    const accessToken = req.authUser.accessToken;
    const title = req.query.title;
    const page = req.query.page;
    const maxResults = 15;
    const startIndex = page * maxResults;

    const response = await fetchBookCovers(
      accessToken,
      title,
      startIndex,
      maxResults
    );

    const didFindCovers = response.data && response.data.items;

    if (didFindCovers) {
      response.data.items.forEach((item) => {
        const thumbnail = item.volumeInfo.imageLinks.thumbnail;
        // eslint-disable-next-line no-param-reassign
        item.volumeInfo.imageLinks.thumbnail = thumbnail.replace(
          'http',
          'https'
        );
      });
    }

    res.status(200).send(didFindCovers ? response.data.items : []);
  } catch (error) {
    res
      .status(error.response.status)
      .send({ error: 'There was a problem retrieving the book covers' });
  }
};

// returns one book cover
const getBookCover = async (bookTitle, accessToken) => {
  const imageResp = await fetchBookCovers(accessToken, bookTitle, 0, 1);

  if (imageResp.data && imageResp.data.items && imageResp.data.items.length) {
    const links = imageResp.data.items[0].volumeInfo.imageLinks;
    return links.thumbnail.replace('http', 'https');
  }

  return null;
};

const sortChapters = (chaps) => {
  return chaps.sort((chap1, chap2) => {
    const num1 = extractLastNumber(chap1.name);
    const num2 = extractLastNumber(chap2.name);

    return num1 && num2 ? num1 - num2 : 0;
  });
};

const getLibrary = async (req, res) => {
  const user = req.authUser;
  const directory = user.rootId;

  if (directory) {
    try {
      const bookResp = await fetchBooks(user.accessToken, directory);
      const library = [];

      await Promise.all(
        bookResp.data.files.map(async (book) => {
          const chapResp = await fetchChapters(user.accessToken, book.id);
          const chapters = [];

          const sortedChaps = sortChapters(chapResp.data.files);

          sortedChaps.forEach((chap) => {
            const chapter = {
              name: chap.name,
              id: chap.id,
            };

            chapters.push(chapter);
          });

          const coverImageUrl = await getBookCover(book.name, user.accessToken);

          const hexColors = await getImageColors(coverImageUrl);

          const tempBook = {
            name: book.name,
            id: book.id,
            chapters,
            coverImageUrl,
            imageColors: hexColors,
          };

          library.push(tempBook);
        })
      );
      res.status(200).send(library);
    } catch (error) {
      res
        .status(error.response.status)
        .send({ error: 'There was a problem loading the library' });
    }
  } else {
    res.status(200).send([]);
  }
};

module.exports = {
  fetchFolders,
  getLibrary,
  streamProxy,
  getBookCovers,
};
