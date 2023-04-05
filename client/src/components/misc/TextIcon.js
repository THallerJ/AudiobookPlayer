import { Typography, Box } from "@mui/material";

const TextIcon = ({ Icon, title, children }) => {
	return (
		<Box
			sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
		>
			<Icon sx={{ fontSize: 40 }} />
			<Typography>
				<strong>{title}</strong>
			</Typography>
			<Typography variant="caption" sx={{ width: 150 }} align="center">
				{children}
			</Typography>
		</Box>
	);
};

export default TextIcon;
