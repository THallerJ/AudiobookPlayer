import { Typography, Divider, useTheme, Link } from '@mui/material';
import DisplayText from '../layouts/DisplayText';

const PrivacyPolicy = () => {
  const theme = useTheme();

  const content = (
    <div>
      <Typography variant="h5">APIs</Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The app uses the Google Drive API for accessing the user&apos;s DRM free
        audiobook library that is stored on their Google Drive.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The Google Books API is used for retrieving book cover images that can
        be displayed to the user.
      </Typography>
      <Divider />
      <Typography variant="h5">User Data</Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The user&apos;s Google ID, access token, and refresh token are saved
        upon authentication. The user&apos;s Google ID maps the tokens to the
        user, and the tokens are used for making API calls to the Google Drive
        API and Google Books API.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The ID of the Google Drive file that represents the root directory of
        the user&apos;s audiobook library is saved in the database so the
        audiobook library can be retrieved across clients.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        Within the user&apos;s audiobook library, each file that represents an
        audiobook is stored in the browser via its ID, title, and an image url
        corresponding to a book cover that is retrieved from the Books API so
        the audiobooks can be displayed to the user. Similarily, the ID and
        title of each chapter of each book is stored in the browser so the
        chapters can be displayed to the user and streamed.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The user&apos;s progress in each audiobook is saved in a database so
        that progress can be synced across clients.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        A timestamp is saved both in the browser and the database that is
        updated when the user changes the root directory of their audiobook
        library. This timestamp ensures that the audiobook library that is
        displayed to the user will be contained within the same root directory
        across all clients. In simpler terms, if the user changes the root
        directory of their library on one client, all other clients will be
        updated as well.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        Once per week, user data is deleted from the database for users who have
        not used the app for 90 days or longer. To aid in accomplishing this, a
        timestamp is saved in the database that is updated each time the user
        accesses the app.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        All user data is deleted when the user logs out, and both the access and
        refresh token are revoked.
      </Typography>
      <Divider />
      <Typography variant="h5">Security</Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The credentials provided to the app upon authentication are restricted
        to only allow access to basic Google profile information, the Google
        Books API, and the read-only portion of the Google Drive API.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        A cookie is saved in the brower and a session is saved in the database
        on the server to enable session-based authentication, which allows the
        server to verify the user&apos;s credentials in a secure manner.
      </Typography>
      <Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
        The user&apos;s access token and refresh token are encrypted before
        being saved in the database on the server.
      </Typography>
      <Divider />
      <Typography variant="h5">Contact Information</Typography>
      <Typography variant="body1">
        If you have any questions or suggestions regarding the privacy policy,
        then contact me at:{' '}
        <Link href="mailto:hallert60@gmail.com" sx={{}}>
          hallert60@gmail.com
        </Link>
      </Typography>
    </div>
  );

  return <DisplayText title="Privacy Policy" content={content} />;
};

export default PrivacyPolicy;
