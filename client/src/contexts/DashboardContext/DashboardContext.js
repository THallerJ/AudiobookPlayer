import React, { useContext, useState } from "react";

const DashboardContext = React.createContext();

export const DashboardContextProvider = ({ children }) => {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [showTrackController, setShowTrackController] = useState(false);
	const [openFolderDialog, setOpenFolderDialog] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const value = {
		openDrawer,
		setOpenDrawer,
		showTrackController,
		setShowTrackController,
		openFolderDialog,
		setOpenFolderDialog,
		anchorEl,
		setAnchorEl,
	};

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
};
export const useDashboard = () => useContext(DashboardContext);
