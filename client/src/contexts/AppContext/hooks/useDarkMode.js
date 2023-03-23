import { useCallback, useState, useEffect } from "react";
import useLocalStorage from "../../../hooks/useLocalStorage";
import lightTheme from "../../../themes/lightTheme";
import darkTheme from "../../../themes/darkTheme";

const useDarkMode = () => {
	const [theme, setTheme] = useState(lightTheme);
	const [darkModeEnabled, setDarkModeEnabled] = useLocalStorage(
		"darkModeEnabled",
		"false"
	);

	const toggleDarkMode = useCallback(() => {
		setDarkModeEnabled((prevState) => {
			if (prevState === "true") {
				return "false";
			} else {
				return "true";
			}
		});
	}, [setDarkModeEnabled]);

	useEffect(() => {
		console.log(darkModeEnabled);
		darkModeEnabled === "true" ? setTheme(darkTheme) : setTheme(lightTheme);
	}, [toggleDarkMode, darkModeEnabled]);

	return { theme, darkModeEnabled, toggleDarkMode };
};

export default useDarkMode;
