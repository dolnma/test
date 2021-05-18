import React, { FC, useContext, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Row from "./Row";
import { useBatchTranslated } from "../../hooks/useTranslated";
import StyledLiveTable, {
	StyledColumn,
	StyledFilters,
	StyledTitle,
} from "./style";
import { v4 as uuidv4 } from "uuid";
import API from "../../implementations/SendRequestRemote";
import useURL from "../../hooks/useURL";
import LogsContext from "../../contexts/logs";
import { splitArrayIntoChunks } from "../../utils";
import CheckboxItem from "../Form/Checkbox";

interface ITable {
	fetchData: boolean;
}


const LogsTable: FC<ITable> = ({ fetchData }) => {
	const {
		logsContext,
		setLogsContext,
		logsFiltersContext,
		setLogsFiltersContext,
		logsActiveFiltersContext,
		setLogsActiveFiltersContext,
		devicesContext,
		setDevicesContext,
	} = useContext(LogsContext);

	const text = useBatchTranslated([
		"address",
		"content",
		"name",
		"direction",
		"key",
		"id",
		"time",
		"filters",
	]);

	const api = new API();
	const { url } = useURL();

	function handleChangeFilter(event, value) {
		const checked = event.target.checked;
		let filtered = [];

		if (checked) {
			setLogsActiveFiltersContext((prevFilters) => {
				if (prevFilters.includes(value)) {
					return [...prevFilters];
				} else {
					return [value, ...prevFilters];
				}
			});
		} else {
			setLogsActiveFiltersContext((prevFilters) => {
				filtered = prevFilters.filter((filter) => {
					if (filter === value) {
						return false;
					} else {
						return true;
					}
				});
				return filtered;
			});
		}
	}

	function createIdenticalFilters(logs, devices) {
		const titles = logs.map((log) => {
			return {
				deviceName: log.dbix
					? devices.find((device) => device.idDevice === log.dbix).name
					: undefined,
				deviceId: log.dbix,
				address: log.address,
			};
		});
		const notEmptyFilters = titles.filter(
			(title) => title.deviceId !== undefined
		);
		// Due duplicate filters
		const filteredTitles = notEmptyFilters.reduce((filtered, item) => {
			if (
				!filtered.some(
					(filteredItem) => JSON.stringify(filteredItem) == JSON.stringify(item)
				)
			)
				filtered.push(item);
			return filtered;
		}, []);
		setLogsFiltersContext(filteredTitles);
	}

	// Naplnění devices pro další potřeby
	useEffect(() => {
		(async () => {
			const getAllDevices = await api.DevicesRequest(url);
			setDevicesContext(getAllDevices.result);
		})();
	}, []);

	// Nový request každou sekundu a v případě nového se přidá do stavu
	useEffect(() => {
		const interval = setInterval(async () => {
			const newLogs = await api.LogsRequest(url);

			if (newLogs.result.length > 0) {
				setLogsContext((prevLogs) => prevLogs.concat(newLogs.result));
			}
		}, 1000);
		if (!fetchData) {
			return clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [fetchData]);

	useEffect(() => {
		if (devicesContext) {
			const isDeviceFetched = logsContext.every((log) => {
				return devicesContext.some((device) => device.deviceId == log.dbix);
			});

			if (isDeviceFetched === true) {
				createIdenticalFilters(logsContext, devicesContext);
			} else {
				(async () => {
					// Pro přidání nového zařízení
					const getAllDevices = await api.DevicesRequest(url);
					setDevicesContext(getAllDevices.result);
					createIdenticalFilters(logsContext, getAllDevices.result);
				})();
			}
		}
	}, [logsContext]);

	// Vyfiltrované logs podle aktivních filtrů
	const filteredLogs =
		logsActiveFiltersContext.length > 0
			? logsContext.filter((log) =>
				logsActiveFiltersContext.includes(log.address)
			  )
			: logsContext;

	// Filtry vygenerované ve skupinách
	const chunksOfFilters = splitArrayIntoChunks(logsFiltersContext, 6);

	return (
		<>
			{chunksOfFilters.length > 0 && (
				<>
					<StyledTitle>{text.filters}:</StyledTitle>

					<StyledFilters>
						{chunksOfFilters.map((filters) => (
							<StyledColumn>
								{filters.map((filter) => (
									<CheckboxItem
										value={logsActiveFiltersContext.includes(filter.address)}
										onChange={(e) => handleChangeFilter(e, filter.address)}
									>
										{filter.deviceName} ({filter.deviceId} : {filter.address})
									</CheckboxItem>
								))}
							</StyledColumn>
						))}
					</StyledFilters>
				</>
			)}

			<StyledLiveTable>
				<TableContainer style={{ maxHeight: "90vh" }} component={Paper}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								<TableCell>{text.time}</TableCell>
								<TableCell>{text.name}</TableCell>
								<TableCell>{text.key}</TableCell>
								<TableCell>{text.direction}</TableCell>
								<TableCell>{text.id}</TableCell>
								<TableCell>{text.content}</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{filteredLogs.length > 0 ? (
								filteredLogs.map((row) => <Row key={uuidv4()} row={row} />)
							) : (
								<>
									<TableRow>
										<TableCell colSpan={6} align="center">
											{text.empty}
										</TableCell>
									</TableRow>
								</>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</StyledLiveTable>
		</>
	);
};

export default LogsTable;
