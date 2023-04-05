import { createContext, useContext, useState, useMemo } from 'react';

const DashboardContext = createContext();

export const DashboardContextProvider = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showTrackController, setShowTrackController] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const value = useMemo(
    () => ({
      openDrawer,
      setOpenDrawer,
      showTrackController,
      setShowTrackController,
      openFolderDialog,
      setOpenFolderDialog,
      anchorEl,
      setAnchorEl,
    }),
    [
      openDrawer,
      setOpenDrawer,
      showTrackController,
      setShowTrackController,
      openFolderDialog,
      setOpenFolderDialog,
      anchorEl,
      setAnchorEl,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
export const useDashboard = () => useContext(DashboardContext);
