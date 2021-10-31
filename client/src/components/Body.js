import React from "react";
import MediaPlayer from "./MediaPlayer";
import { styled } from "@mui/material/styles";
import BodyContent from "./BodyContent";

const Body = () => {
	return (
		<div>
			<BodyContent />
			<StyledMediaPlayerContainer>
				<MediaPlayer />
			</StyledMediaPlayerContainer>
		</div>
	);
};

export default Body;

const StyledMediaPlayerContainer = styled("div")(({ theme }) => ({
	position: "fixed",
	bottom: 0,
	width: "100%",
}));
