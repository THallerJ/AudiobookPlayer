import React, { useContext, useState } from "react";

const DashboardContext = React.createContext();

export const DashboardContextProvider = ({ children }) => {
	const [openDrawer, setOpenDrawer] = useState(false);
	const [showTrackInfo, setShowTrackInfo] = useState(false);
	const [openRootDialog, setOpenRootDialog] = useState(false);
	const [isFolderSelected, setIsFolderSelected] = useState(false);

	const value = {
		openDrawer,
		setOpenDrawer,
		showTrackInfo,
		setShowTrackInfo,
		openRootDialog,
		setOpenRootDialog,
		isFolderSelected,
		setIsFolderSelected,
	};

	return (
		<DashboardContext.Provider value={value}>
			{children}
		</DashboardContext.Provider>
	);
};
export const useDashboard = () => useContext(DashboardContext);
