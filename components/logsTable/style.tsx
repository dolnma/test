import { styled } from "linaria/react";
import { color } from "../style";

export default styled.div`
	width: 100%;
	table {
		overflow: auto;
		max-height: 160px;
	}
	thead tr th {
		background: ${color.white};
	}
	table tr:nth-child(odd) {
		background: ${color.light};
	}
`;

export const StyledFilters = styled.div`
	display: inline-flex;
	flex-wrap: wrap;
	column-gap: 15px;
`;

export const StyledTitle = styled.div`
	font-size: 14px;
	line-height: 17px;
	margin-bottom: 8px;
	padding-bottom: 10px;
	font-weight: bold;
`;

export const StyledColumn = styled.div`
	min-width: 230px;
	display: flex;
	flex-direction: column;
	padding-bottom: 20px;
`;
