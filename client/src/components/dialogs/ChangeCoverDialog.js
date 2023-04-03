import { useEffect, useState } from "react";
import BaseDialog from "./BaseDialog";
import { useGoogle } from "../../contexts/GoogleContext/GoogleContext";
import { CircularProgress, Typography, useTheme } from "@mui/material";
import BookCoverList from "../books/BookCoverList";
import BookCoverSelect from "../books/BookCoverSelect";
import CenterWrapper from "../styled_components/CenterWrapper";
import useApiProgressCallback from "../../hooks/useApiProgressCallback";

const ChangeCoverDialog = ({ open, setOpen }) => {
	const theme = useTheme();
	const { getBookCovers, currentBook, updateBookCover, setOverridedCovers } =
		useGoogle();
	const [coverResp, setCoverResp] = useState([]);
	const [bookCovers, setBookCovers] = useState([]);
	const [selectedCover, setSelectedCover] = useState();

	const [loading, getCovers] = useApiProgressCallback(async () => {
		const response = await getBookCovers(0);
		setCoverResp(response);
	}, [getBookCovers, setCoverResp]);

	useEffect(() => {
		getCovers();
	}, [getBookCovers, getCovers]);

	useEffect(() => {
		coverResp.forEach((cover, index) => {
			setBookCovers((prevState) => {
				const newBookCover = (
					<BookCoverSelect
						bookCoverUrl={cover.volumeInfo.imageLinks.thumbnail}
						selectedCover={selectedCover}
						setSelectedCover={setSelectedCover}
					/>
				);

				return index === 0 ? [newBookCover] : [...prevState, newBookCover];
			});
		});
	}, [coverResp, selectedCover]);

	const renderContent = () => {
		if (loading) {
			return (
				<CenterWrapper>
					<CircularProgress />
				</CenterWrapper>
			);
		} else {
			return bookCovers.length ? (
				<BookCoverList
					padding={theme.spacing(1)}
					spacing={theme.spacing(1)}
					bookCovers={bookCovers}
				/>
			) : (
				<CenterWrapper>
					<Typography>No covers found</Typography>
				</CenterWrapper>
			);
		}
	};

	const handleOk = () => {
		updateBookCover(selectedCover);

		setOverridedCovers((prevState) => {
			let matchFound = false;

			const newState = prevState.map((obj) => {
				if (obj.id === currentBook.id) {
					matchFound = true;
					return { ...obj, coverImageUrl: selectedCover };
				} else return obj;
			});

			if (matchFound) return newState;

			return [
				...newState,
				{ id: currentBook.id, coverImageUrl: selectedCover },
			];
		});

		setOpen(false);
	};

	return (
		<BaseDialog
			title={currentBook.name}
			content={renderContent()}
			open={open}
			setOpen={setOpen}
			ok={handleOk}
			cancel={() => setOpen(false)}
			height="80%"
			width="30%"
		/>
	);
};

export default ChangeCoverDialog;
