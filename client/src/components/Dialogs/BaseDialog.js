import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Typography,
	Divider,
	useTheme,
	useMediaQuery,
} from "@mui/material";

const BaseDialog = ({
	title,
	content,
	height: dialogHeight,
	width: dialogWidth,
	headerContent,
	open,
	setOpen,
	ok,
	cancel,
}) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

	const renderButtons = (
		<DialogActions>
			{ok && (
				<Button aria-label="Ok" onClick={ok}>
					Ok
				</Button>
			)}
			{cancel && (
				<Button aria-label="Ok" onClick={cancel}>
					Cancel
				</Button>
			)}
		</DialogActions>
	);

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			PaperProps={{
				sx: {
					height: dialogHeight ? dialogHeight : null,
					width: () => {
						if (isSmallScreen) return "90%";
						else if (dialogWidth) return dialogWidth;
						else return null;
					},
				},
			}}
			sx={{ "*::-webkit-scrollbar": { width: 4 } }}
		>
			<DialogTitle>
				<div>
					<Typography align="center" variant="h6">
						{title}
					</Typography>
				</div>
				<Divider />
				{headerContent}
			</DialogTitle>
			<DialogContent>{content}</DialogContent>
			{renderButtons}
		</Dialog>
	);
};

export default BaseDialog;
