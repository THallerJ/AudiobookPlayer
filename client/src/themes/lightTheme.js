import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
	drawer: {
		width: 240,
	},
	palette: {
		secondary: {
			light: "#b1b1b1",
			main: "#9e9e9e",
			dark: "#6e6e6e",
			contrastText: "#000",
		},
	},
});

export default lightTheme;
