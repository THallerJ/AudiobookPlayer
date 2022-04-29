# Stream Audiobook Player

## Description

[Stream Audiobook Player](https://stream-audiobook-player.herokuapp.com/) is a web app that allows users to stream audiobooks that are stored on their Google Drive.

## Freatures

- Adjustable playback speed (_0.5x to 4x speed_)
- Light/dark mode
- Progress syncs across devices
- Book covers automatically download from the internet
- Mobile and desktop friendly UI
- Supports MP3, MPEG, OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA, WEBM, DOLBY, FLAC file types. (_M4B files can be converted ti M4A files by renaming the file with the .m4a file extension_)

## Google Drive Folder Structure

The user's Google Drive must be structured properly for the app to access their audiobooks.

The Google Drive must have a single folder containing all the audiobooks. Within that folder, another folder should be created for each book that contains the audio files belonging to the book. The folder for each book should be named the title of the book.

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
