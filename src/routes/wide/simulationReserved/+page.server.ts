import { putSimulationReserve } from '$lib/client/simulationReserve.js';
import type { SimulationReserve } from '$lib/types/index.js';
import { v4 as uuidv4 } from 'uuid';
//import { unixTimestampToString } from '$lib/utils/common';
import { presetInfo } from '$lib/client';
import { JobType, SimulationStatus, SimulationType } from '$lib/utils/getName.js';
import { getUnixTimestamp } from '$lib/utils/common';

export const actions = {
	addSimulationBooking: async ({ request }) => {
		const formData = await request.formData();
		const regionName = formData.get('regionName');
		const presetName = formData.get('presetName');

		const simulationReserve: SimulationReserve = {
			id: uuidv4(),
			userId: 'us-east-1:12345678-1234-1234-1234-123456789012',
			type: SimulationType.Wide,
			regionName: regionName as string,
			paramName: presetName as string,
			status: SimulationStatus.reservation,
			createDateTime: getUnixTimestamp(Date.now())
		};

		await putSimulationReserve(simulationReserve);

		console.log('regionName:', regionName);
		console.log('presetName:', presetName);
	}
};

// 地域プリセットと地震動プリセットの読み込み
export const load = async () => {
	// ユーザーIDを指定してプリセット情報を取得

	// 地域プリセットを取得
	// 地域プリセットはjob1
	const regionPresets = await presetInfo.getByUserTypeJob(
		'us-east-1:12345678-1234-1234-1234-123456789012',
		SimulationType.Wide,
		JobType.Area
	);
	// 地震動プリセットを取得
	// 地震動プリセットはjob2
	const earthquakePresets = await presetInfo.getByUserTypeJob(
		'us-east-1:12345678-1234-1234-1234-123456789012',
		SimulationType.Wide,
		JobType.Earthquake
	);

	return {
		regionPresets: regionPresets,
		earthquakePresets: earthquakePresets
	};
};
