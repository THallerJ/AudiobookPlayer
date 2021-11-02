import { Box } from "@mui/system";
import React from "react";
import Chapter from "./Chapter";

const ChapterList = () => {
	const chapterArray = [];
	for (var i = 0; i < 30; i++) {
		chapterArray.push(`Chapter ${i + 1}`);
	}

	return (
		<Box sx={{ width: "100%" }}>
			{chapterArray.map((chapter) => (
				<Chapter title={chapter} />
			))}
		</Box>
	);
};

export default ChapterList;
