import React, { FC, useContext, useEffect } from "react";
import LocalizationContext from "../contexts/LocalizationContext";
import { TitleContext } from "../components/Layout";
import { useTranslated } from "../hooks/useTranslated";
import Layout from "../components/LayoutSimple";
import Toggle from "../components/Form/Toggle";
import { usePersistedState } from "../utils";
import SysApiLogTable from "../components/logsTable";
import styledTemplate from "../components/Templates/style";
import Trigger from "../components/Link/Trigger";
import { styledButton } from "../components/Link/style";
import LogsContext, {
	LogsProvider
} from "../contexts/logs";
import StyledTable, {
	StyledControllers,
	StyledControllersItem,
} from "./logs.styled";

const Logs: FC = () => {
	const [toggle, setToggle] = usePersistedState(
		"sysapiToggle",
		true
	);

	const { currentLanguage } = useContext(LocalizationContext);
	const { setTitle } = useContext(TitleContext);

	const text = useTranslated([
		"user_visible_events",
		"live_view",
		"sysapi_log",
		"reset_filters",
		"sysapi_log_on",
	]);

	useEffect(() => {
		setTitle(text.sysapi_log);
	}, [currentLanguage]);

	return (
		<LogsProvider>
			<Layout>
				<div className={styledTemplate}>
					<StyledTable>
						<StyledControllers>
							<LogsContext.Consumer>
								{(filterContext) =>
									filterContext.logsActiveFiltersContext.length > 0 && (
										<StyledControllersItem>
											<Trigger
												className={styledButton}
												type="button"
												onClick={() =>
													filterContext.setLogsActiveFiltersContext([])
												}
											>
												{text.reset_filters}
											</Trigger>
										</StyledControllersItem>
									)
								}
							</LogsContext.Consumer>

							<StyledControllersItem>
								<Toggle
									name={"ActiveUnchecked"}
									value={toggle}
									onChange={() => {
										setToggle((prevToggleState) => !prevToggleState);
									}}
								>
									{text.sysapi_log_on}
								</Toggle>
							</StyledControllersItem>
						</StyledControllers>
						<SysApiLogTable fetchData={toggle} />
					</StyledTable>
				</div>
			</Layout>
		</LogsProvider>
	);
};

export default Logs;
