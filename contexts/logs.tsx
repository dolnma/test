import React, { createContext, useState } from "react";
import Device from "../interfaces/Device";

const LogsContext = createContext(undefined);

export const LogsProvider = ({ children }) => {
	const [logsContext, setLogsContext] = useState([]);
	const [logsFiltersContext, setLogsFiltersContext] = useState([]);
	const [logsActiveFiltersContext, setLogsActiveFiltersContext] = useState([]);
	const [devicesContext, setDevicesContext] = useState<Device[]>();

	return (
		<LogsContext.Provider
			value={{
				logsContext,
				setLogsContext,
				logsFiltersContext,
				setLogsFiltersContext,
				logsActiveFiltersContext,
				setLogsActiveFiltersContext,
				devicesContext,
				setDevicesContext,
			}}
		>
			{children}
		</LogsContext.Provider>
	);
};

export default LogsContext;
