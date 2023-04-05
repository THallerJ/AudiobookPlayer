import { useMediaQuery, useTheme } from "@mui/material";

const useIsLargeScreen = () => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.up("md"));
};

export default useIsLargeScreen;
