import { useState, useEffect } from "react";

const useServerUrl = (axiosInstance) => {
	const [serverUrl, setServerUrl] = useState();

	const getServerUrl = async () => {
		const url = await axiosInstance.get("/general/serverUrl");
		setServerUrl(url.data);
	};

	useEffect(() => {
		getServerUrl();
	}, []);

	return serverUrl;
};

export default useServerUrl;
