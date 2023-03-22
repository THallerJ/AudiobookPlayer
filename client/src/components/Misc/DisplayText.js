import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	useMediaQuery,
	Link,
	useTheme,
	styled,
} from "@mui/material";
import BackToolBar from "./BackToolBar";
import backgroundImage from "../../assets/images/backgroundImage.jpg";
import darkBackgroundImage from "../../assets/images/darkBackgroundImage.jpg";

const DisplayText = ({ title, content }) => {
	const [isDarkTheme, setIsDarkTheme] = useState();
	const [imgUrl, setImgUrl] = useState();
	const theme = useTheme();
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

	const lightImgUrl =
		"https://www.freepik.com/free-vector/gradient-white-monochrome-background_15273829.htm#page=5&query=background%20white&position=19&from_view=search&track=sph";
	const darkImgUrl =
		"https://www.freepik.com/free-vector/dark-minimal-hexagons-background_13107749.htm#query=dark%20background&position=41&from_view=search&track=sph";

	useEffect(() => {
		if (theme.palette.mode === "light") {
			setIsDarkTheme(false);
			setImgUrl(lightImgUrl);
		} else {
			setIsDarkTheme(true);
			setImgUrl(darkImgUrl);
		}
	}, [theme]);

	const components = (
		<StyledAppInfoContainer>
			<Box className="container">
				<Box className="content">{content}</Box>
				{isLargeScreen && (
					<Typography className="footer" variant="caption">
						<Link underline="hover" href={imgUrl}>
							Image
						</Link>{" "}
						by
						{isDarkTheme && " coolvector on "}
						{" Freepik"}
					</Typography>
				)}
			</Box>
		</StyledAppInfoContainer>
	);

	return <BackToolBar title={title} content={components} />;
};

export default DisplayText;

// Styled Components
const StyledAppInfoContainer = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	backgroundColor: theme.palette.background.alt,
	alignItems: "center",
	backgroundImage:
		theme.palette.mode === "light"
			? `url(${backgroundImage})`
			: `url(${darkBackgroundImage})`,
	backgroundSize: "cover",
	backgroundAttachment: "fixed",
	height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,

	".container": {
		display: "flex",
		height: "100%",
		justifyContent: "space-between",
		flexDirection: "column",
		paddingLeft: theme.spacing(6),
		paddingRight: theme.spacing(6),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(1),
		backgroundColor: theme.palette.background.container,
		alignItems: "center",
		overflow: "auto",
		width: useMediaQuery(theme.breakpoints.up("md")) ? "55%" : "100%",
	},

	".content": {
		paddingBottom: theme.spacing(7),
	},

	".footer": {
		paddingBottom: theme.spacing(1),
	},

	".MuiTypography-h5": {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(1),
	},

	".MuiDivider-root": {
		paddingTop: theme.spacing(3),
	},

	"*::-webkit-scrollbar-thumb": {
		backgroundColor:
			theme.palette.mode === "dark" || theme.palette.scrollbar.thumbAlt,
	},
}));
