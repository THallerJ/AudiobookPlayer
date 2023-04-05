import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
	drawer: {
		width: 240,
	},
	scrollbar: {
		width: 12,
		smallWidth: 4,
	},
	palette: {
		mode: "dark",
		scrollbar: {
			thumb: "#6b6b6b",
		},
		primary: {
			main: "#A6B1E1",
		},
		secondary: {
			dark: "#2d2d2d",
			main: "#41414",
			light: "#5d5d5d",
		},
		background: {
			default: "#1C1C1EFF",
			paper: "#000000FF",
			alt: "#1C1C1EFF",
			container: "#2C2C2EFF",
		},
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				colorPrimary: {
					backgroundImage: "unset",
				},
			},
		},
	},
});

export default darkTheme;
