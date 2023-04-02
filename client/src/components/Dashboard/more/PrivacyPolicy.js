import { Typography, Divider, useTheme } from "@mui/material";
import DisplayText from "../../misc/DisplayText";

const PrivacyPolicy = () => {
	const theme = useTheme();

	const content = (
		<div>
			<Typography variant="h5">APIs</Typography>
			<Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
				The app uses the Google Drive API for accessing files stored on the
				user's Google Drive whenand for accessing the audiobook files
				themselves.
			</Typography>
			<Typography variant="body1">
				The Google Books API is used for retrieving book cover images.
			</Typography>
			<Divider />
			<Typography variant="h5">User Data</Typography>
			<Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
				The user's Google ID, access token, and refresh token are saved upon
				authentication. The google ID is used to map the access and refresh
				tokens to each user, and the tokens are used for making API calls to the
				Google Drive API and Google Books API.
			</Typography>
			<Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
				Using the Google Drive API, the ID of the Google Drive file
				respresenting the root directory of the user's audiobook library is
				saved in the database on the server so that the user's audiobook library
				can be retrieved. The ID and title of the Google Drive files within the
				user's audiobook library are saved in the browser so the books can be
				displayed and streamed.
			</Typography>
			<Typography variant="body1" sx={{ pb: theme.spacing(1) }}>
				The user's progress in each audiobook is saved in the database so that
				progress can be synced across devices.
			</Typography>
			<Typography variant="body1">
				Once per week, user data is deleted from the database for users who have
				not used the app for 90 days or longer. To aid in accomplishing this, a
				timestamp is saved in the database that is updated each time the user
				accesses the app. User data is also deleted when the user logs out.
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
				server to find a user's credentials on their behalf in a secure manner.
			</Typography>
			<Typography variant="body1">
				The user's access token and refresh token are encrypted before being
				saved in the database on the server.
			</Typography>

			<Divider />
			<Typography variant="h5">Contact Information</Typography>
			<Typography variant="body1">
				If you have any questions or suggestions regarding the privacy policy,
				then contact me at: streamaudiobookplayer@gmail.com
			</Typography>
		</div>
	);
	return <DisplayText title="Privacy Policy" content={content} />;
};

export default PrivacyPolicy;
