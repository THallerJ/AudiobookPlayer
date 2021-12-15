import React from "react";
import { useDashboard } from "../contexts/DashboardContext";

const TrackInfo = () => {
	const { setShowTrackInfo } = useDashboard();
	return (
		<div onClick={() => setShowTrackInfo((prevState) => !prevState)}>
			<h2>Track Info</h2>
		</div>
	);
};

export default TrackInfo;
