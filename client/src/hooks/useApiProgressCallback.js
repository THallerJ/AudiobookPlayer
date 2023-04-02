import { useState, useCallback } from "react";

const useApiProgressCallback = (callback, deps) => {
	const [loading, setLoading] = useState(false);

	const callApi = useCallback(
		async (...args) => {
			setLoading(true);
			await callback(...args);
			setLoading(false);
		},
		[...deps]
	);

	return [loading, callApi];
};

export default useApiProgressCallback;
