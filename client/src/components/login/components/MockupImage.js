import React from "react";
import MockupImg from "../../../assets/images/mockup.png";
import MockupMobileImg from "../../../assets/images/mockup-mobile.png";
import useIsLargeScreen from "../../../hooks/useIsLargeScreen";

const MockupImage = () => {
	const isLargeScreen = useIsLargeScreen();

	const renderImages = () => {
		if (isLargeScreen) return <img src={MockupImg} width="95%" />;
		else return <img src={MockupMobileImg} width="100%" />;
	};
	return renderImages();
};

export default MockupImage;
