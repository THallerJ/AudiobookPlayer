import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
	drawer: {
		width: 240,
	},
	palette: {
		scrollbar: {
			thumb: "#c3c3c3",
			track: "#f4f4f4",
		},
		secondary: {
			light: "#b1b1b1",
			main: "#9e9e9e",
			dark: "#6e6e6e",
			contrastText: "#000",
		},
		background: {
			alt: "#e1e1e1",
			container: "white",
		},
	},
});

export default lightTheme;
