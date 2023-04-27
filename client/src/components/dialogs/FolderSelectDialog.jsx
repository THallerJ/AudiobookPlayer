/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Breadcrumbs,
  Link,
  CircularProgress,
  styled,
} from '@mui/material';
import { useGoogle } from '../../contexts/GoogleContext/GoogleContext';
import { useApp } from '../../contexts/AppContext/AppContext';
import CenterWrapper from '../styled_components/CenterWrapper';
import BaseDialog from './components/BaseDialog';
import useFetchProgressCallback from '../../hooks/useFetchProgressCallback';
import useSetRootDirectory from '../../hooks/useSetRootDirectory';
import { useMediaPlayer } from '../../contexts/MediaPlayerContext/MediaPlayerContext';

const FolderSelectDialog = ({ open, setOpen }) => {
  const { getFolders, setCurrentBook, setPlayingBook, setPlayingChapter } =
    useGoogle();
  const { axiosError, setGoogleDirectoryExists, setRootUpdatedAt } = useApp();
  const { setSound, setProgress } = useMediaPlayer();
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [folders, setFolders] = useState([]);

  const setRootDirectory = useSetRootDirectory(
    setSound,
    setPlayingBook,
    setCurrentBook,
    setPlayingChapter,
    setProgress,
    setGoogleDirectoryExists,
    setRootUpdatedAt
  );

  useEffect(() => {
    if (axiosError && axiosError.code === 401) setOpen(false);
  }, [axiosError, setOpen]);

  const updateFoldersCallback = useCallback(
    async (rootId) => {
      const fetchedFolders = await getFolders(rootId);
      setFolders(fetchedFolders);
    },
    [setFolders, getFolders]
  );

  const [loading, updateFolders] = useFetchProgressCallback(
    updateFoldersCallback
  );

  const updateBreadCrumbs = (rootId, index) => {
    setSelectedFolders((state) => state.slice(0, index));
    updateFolders(rootId);
  };

  useEffect(() => {
    const fetchData = async () => {
      updateFolders('root');
    };

    if (open) {
      fetchData();
    } else {
      setFolders([]);
      setSelectedFolders([]);
    }
  }, [updateFolders, open]);

  const handleOk = () => {
    setRootDirectory(
      selectedFolders.length > 0
        ? selectedFolders[selectedFolders.length - 1].id
        : 'root'
    );
    setOpen(false);
  };

  const renderFolders = () => {
    if (loading)
      return (
        <CenterWrapper>
          <CircularProgress />
        </CenterWrapper>
      );

    if (folders.length === 0)
      return (
        <CenterWrapper>
          <Typography variant="subtitle2">There are no folders here</Typography>
        </CenterWrapper>
      );

    return (
      <List>
        {folders.map((data, index) => {
          return (
            <ListItemButton
              key={data.id}
              onClick={() => {
                updateFolders(data.id);
                setSelectedFolders((state) => [
                  ...state,
                  { id: data.id, name: data.name },
                ]);
              }}
              dense
              divider={index !== folders.length - 1}
            >
              <ListItemText primary={data.name} />
            </ListItemButton>
          );
        })}
      </List>
    );
  };

  const StyledLinkButton = styled(Button)({
    textTransform: 'none',
  });

  const renderBreadCrumbs = () => {
    return (
      <Breadcrumbs>
        <Link
          component={StyledLinkButton}
          onClick={() => updateBreadCrumbs('root', 0)}
          underline="none"
          variant="caption"
        >
          root
        </Link>
        {selectedFolders.length > 0 &&
          selectedFolders.map((data, index) => {
            return (
              <Link
                key={data.id}
                component={StyledLinkButton}
                onClick={() => updateBreadCrumbs(data.id, index + 1)}
                underline="none"
                variant="caption"
              >
                {data.name}
              </Link>
            );
          })}
        <Link />
      </Breadcrumbs>
    );
  };

  return (
    <BaseDialog
      title="Set Audiobook Directory"
      open={open}
      setOpen={setOpen}
      content={renderFolders()}
      headerContent={renderBreadCrumbs()}
      ok={handleOk}
      cancel={() => setOpen(false)}
      fixed
      height="80%"
      width="20%"
    />
  );
};

export default FolderSelectDialog;
