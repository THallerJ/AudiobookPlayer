import { useState } from "react";

const useApiProgress = (callback) => {
	const [loading, setLoading] = useState(false);

	const callApi = async () => {
		setLoading(true);
		await callback();
		setLoading(false);
	};

	return [loading, callApi];
};

export default useApiProgress;
