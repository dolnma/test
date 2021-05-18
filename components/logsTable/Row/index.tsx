import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import React, { FC } from "react";

interface IRow {
	row: {
		time: string;
		key: string;
		deviceName: string;
		direction: string;
		id: string;
		content: string;
	};
}

const Row: FC<IRow> = ({ row }) => {
	const date = String(new Date(row.time).getMilliseconds()).padStart(
		3,
		"0"
	);

	return (
		<>
			<TableRow>
				<TableCell component="th" scope="row">
					{row.time &&
						new Date(row.time).toLocaleTimeString() + ":" + date}
				</TableCell>
				<TableCell>{row.deviceName}</TableCell>
				<TableCell>{row.key}</TableCell>
				<TableCell>{row.direction}</TableCell>
				<TableCell>{row.id}</TableCell>
				<TableCell>{row.content}</TableCell>
			</TableRow>
		</>
	);
};

export default Row;
