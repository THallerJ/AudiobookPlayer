import { useRef, useEffect } from "react";

const useEffectSkipFirst = (callback, dependencies) => {
	const firstRenderRef = useRef(true);

	useEffect(() => {
		if (firstRenderRef.current) {
			firstRenderRef.current = false;
			return;
		}
		callback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
};

export default useEffectSkipFirst;
