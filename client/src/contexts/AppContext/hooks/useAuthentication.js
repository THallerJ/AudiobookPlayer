import { useState } from "react";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";

const useAuthentication = () => {
	const [authentication, setAuthentication] = useState({
		isInitializing: true,
		isAuthenticated: false,
	});
	const [googleDirectoryExists, setGoogleDirectoryExists] = useState(null);

	useEffectSkipFirst(() => {
		if (!authentication.isAuthenticated) localStorage.clear();
	}, [authentication]);

	return {
		authentication,
		setAuthentication,
		googleDirectoryExists,
		setGoogleDirectoryExists,
	};
};

export default useAuthentication;
