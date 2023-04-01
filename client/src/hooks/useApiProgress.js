import { useState } from "react";

const useApiProgress = (callback) => {
	const [loading, setLoading] = useState(false);

	const callApi = async (...args) => {
		setLoading(true);
		await callback(...args);
		setLoading(false);
	};

	return [loading, callApi];
};

export default useApiProgress;
