type PresetInfo = {
	id: string;
	userId: string;
	type: string;
	job: string;
	regionName: string;
	presetName: string;
	meshCode: string[];
	gmlFilePath: string;
	wideLongPeriodParamFilePath: string;
	wideNormalParamFilePath: string;
	wideDirectlyParamFilePath: string;
	narrowAnalysisModelFilePath: string;
	narrowParamFilePath: string;
	narrowForceParamFilePath: string;
	narrowCalcParamFilePath: string;
	additionalInfo: string;
	createDateTime: number;
};

type SimulationReserve = {
	id: string;
	userId: string;
	type: string;
	regionName: string;
	paramName: string;
	status: string;
	createDateTime: number;
};

type AnyRecord<T> = Record<string, T>;

export type { PresetInfo, SimulationReserve, AnyRecord };
