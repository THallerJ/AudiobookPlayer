# Stream Audiobook Player

## Description

[Stream Audiobook Player](https://stream-audiobook-player.onrender.com/) is a web app that allows users to stream audiobooks that are stored on their Google Drive.

(_Note: the app has not yet been verified by Google_).

![capture](https://user-images.githubusercontent.com/26337084/231924976-20436769-2ab9-4d1f-bc56-7d91072e2667.png)

## Freatures

- Adjustable playback speed (_0.5x to 4x speed_)
- Light/dark mode
- Progress syncs across devices
- Book covers are automatically found and displayed
- Mobile and desktop friendly UI (_built with [Material UI](https://mui.com/material-ui/getting-started/overview/)_)
- Supports MP3, MPEG, OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA, WEBM, DOLBY, and FLAC file types. (_M4B files can be converted to M4A files by renaming the file with the .m4a file extension_)

## Google Drive Folder Structure

The user's Google Drive must be structured properly for the app to access their audiobooks.

The Google Drive must have a single folder containing all the audiobooks. Within that folder, another folder should be created for each book containing the audio files belonging to the book. The folder for each book should be named the title of the book.

The proper folder structure is depicted below:

- Audiobook library folder
  - Book 1 Title
    - Chapter 1
    - Chapter 2
    - Chapter 3
  - Book 2 Title
    - Chapter 1
    - Chapter 2
    - Chapter 3
  - Book 3 Title
    - Chapter 1
    - Chapter 2
    - Chapter 3

The Google Drive folder containing your audiobook library must also be accessible to "Anyone with the link".

## Development

### Build

The app uses a React client and an Express server. On the client, code-splitting is used to reduce the bundle size and improve app peformance. A custom webpack configuration is also used to enable static file compression and further reduce the bundle size. The static files that are generated in the client's build are served by the Express server.

### Authentication

The user must authenticate with Google in order for the app to access their Google Drive. [Passport.js](https://github.com/jaredhanson/passport) handles authentication on the Express server, where the access token and refresh token are encrypted and stored in a MongoDB database. An express session is also created for each user that maps to that user's Google credentials in the database. The session ID is sent to the client and stored as a cookie. The client can than make requests to the server, sending the session ID with each request, which the server can use to retrieve the user's Google credentials and access the Google API. Thus, the Express server acts as a proxy between the client and the Google API.

### Audio Playback

The [Howler.js](https://github.com/goldfire/howler.js#documentation) audio library is used for streaming audio files from Google Drive. Normally, providing Howler.js with the download URL of an audio file is sufficient for Howler.js to stream that file. However, in order for Howler.js to stream a large audio file from Google Drive (audiobook files tend to be large), a Google API key must be appended to the download URL. So, rather than use the download URL from Google Drive, the client uses a proxy URL from the server that proxies the Google Drive download URL with the appended API key. This allows the user to stream an audio file from Google Drive without exposing the Google API key to the client.

### Cross-Device Sync

The app allows the user to resume any book where they left off, even across different devices. When a user is listening to a book and either switches books or closes the app, the client saves the chapter ID and the number of seconds that have elapsed in the chapter locally and sends this information to server where it is stored in the MongoDB database. Each time the user opens the app, the client retrieves the most recent chapter progress information from the server.

## Running the App Locally

The app can either be built manually or with Docker.

In order to run the app locally, one must first create a project on the [Google Developer Console](https://console.cloud.google.com/apis/dashboard) and enable the Google Drive API and Google Books API. One must also [create a MongoDB database](https://www.mongodb.com/basics/create-database), unless the app is run with Docker.

### Environment Variables

If building the app manually, the environment variables listed below must be provided to the app:

| Variable             | Value                                                                            |
| -------------------- | -------------------------------------------------------------------------------- |
| GOOGLE_API_KEY       | from [Google Developer Console](https://console.cloud.google.com/apis/dashboard) |
| GOOGLE_CLIENT_ID     | from [Google Developer Console](https://console.cloud.google.com/apis/dashboard) |
| GOOGLE_CLIENT_SECRET | from [Google Developer Console](https://console.cloud.google.com/apis/dashboard) |
| MONGO_URI            | URI of the MongoDB database                                                      |
| SESSION_SECRET       | Key used for hashing the session cookie                                          |
| ENCRYPTION_KEY       | Key used for encrypting user credentials                                         |
| SERVER_URL           | URL of the server (_When run locally, the server uses port 5000_)                |

If using Docker, only the following environmental variables need to be provided:

| Variable             | Value                                                                            |
| -------------------- | -------------------------------------------------------------------------------- |
| GOOGLE_API_KEY       | from [Google Developer Console](https://console.cloud.google.com/apis/dashboard) |
| GOOGLE_CLIENT_ID     | from [Google Developer Console](https://console.cloud.google.com/apis/dashboard) |
| GOOGLE_CLIENT_SECRET | from [Google Developer Console](https://console.cloud.google.com/apis/dashboard) |

All environment variables should be provided at the root level of the app.

### Commands

To build and run the app manually, execute the `npm run build-run-app` command from the root directory of the app.

To run the app for development purposes, execute the following commands from the root directory:

1. `npm run install-deps`
2. `npm run dev`
3. `npm run watch`

Once running, the app can be accessed at the server URL.

Alternatively, if using docker, one can build the necessary docker images and run the app using the command
`docker compose up`. Otherwise, the prebuilt images can be retrieved [here](https://hub.docker.com/u/hallert60).

## License

Released under the [MIT License](https://github.com/THallerJ/stream-audiobook-player/blob/main/License.md).
