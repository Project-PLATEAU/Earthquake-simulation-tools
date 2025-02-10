import { putSimulationReserve } from '$lib/client/simulationReserve.js';
import type { SimulationReserve } from '$lib/types/index.js';
import { v4 as uuidv4 } from 'uuid';
//import { unixTimestampToString } from '$lib/utils/common';
import { presetInfo } from '$lib/client';
import { submitJob } from '$lib/client/awsBatch';
import { JobType, SimulationStatus, SimulationType } from '$lib/utils/getName.js';
import { getUnixTimestamp } from '$lib/utils/common';

export const actions = {
	addSimulationBooking: async ({ request }) => {
		console.log('addSimulationBooking.......');

		const formData = await request.formData();
		const buildingName = formData.get('buildingName');
		const simModelName = formData.get('simModelName');

		const simulationReserve: SimulationReserve = {
			id: uuidv4(),
			userId: 'us-east-1:12345678-1234-1234-1234-123456789012',
			type: SimulationType.Narrow,
			regionName: buildingName as string,
			paramName: simModelName as string,
			status: SimulationStatus.reservation,
			createDateTime: getUnixTimestamp(Date.now())
		};

		// シミュレーション予約情報を登録
		await putSimulationReserve(simulationReserve);

		console.log('simulationReserve.id:', simulationReserve.id);

		// ジョブ送信
		await submitJob(simulationReserve.id);

		console.log('buildingName:', buildingName);
		console.log('simModelName:', simModelName);
	}
};

// 地域プリセットと地震動プリセットの読み込み
export const load = async () => {
	// ユーザーIDを指定してプリセット情報を取得

	// 地域プリセットを取得
	// 地域プリセットはjobb3
	const buildingPresets = await presetInfo.getByUserTypeJob(
		'us-east-1:12345678-1234-1234-1234-123456789012',
		SimulationType.Narrow,
		JobType.Building
	);
	// 地震動プリセットを取得
	// 地震動プリセットはjob4
	const simModelPresets = await presetInfo.getByUserTypeJob(
		'us-east-1:12345678-1234-1234-1234-123456789012',
		SimulationType.Narrow,
		JobType.Analysis_model
	);

	return {
		buildingPresets: buildingPresets,
		simModelPresets: simModelPresets
	};
};
