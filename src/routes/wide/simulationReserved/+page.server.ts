import {
	putSimulationReserve,
	updateSimulationWithApiResponse
} from '$lib/client/simulationReserve.js';
import { executeSimulationApi } from '$lib/client/simulationApi.js';
import type { SimulationReserve } from '$lib/types/index.js';
import { v4 as uuidv4 } from 'uuid';
import { presetInfo } from '$lib/client';
import { JobType, SimulationStatus, SimulationType } from '$lib/utils/getName.js';
import { getUnixTimestamp } from '$lib/utils/common';
import { generateWideDppContent } from '$lib/utils/dppGenerator.js';

export const actions = {
	addSimulationBooking: async ({ request }) => {
		try {
			const formData = await request.formData();
			const regionName = formData.get('regionName') as string;
			const presetName = formData.get('presetName') as string;

			if (!regionName || !presetName) {
				return {
					type: 'error',
					error: 'Region name and earthquake preset are required'
				};
			}

			// シミュレーションIDを生成
			const simulationId = uuidv4();

			// 出力パスを生成（S3バケットへのパス）
			const outputPath = `${simulationId}/SHP`;
			// 出力ディレクトリを設定
			const outputDir = `/output/${outputPath}`;

			// シミュレーション予約レコードを作成
			const simulationReserve: SimulationReserve = {
				id: simulationId,
				userId: 'us-east-1:12345678-1234-1234-1234-123456789012',
				type: SimulationType.Wide,
				regionName: regionName,
				paramName: presetName,
				status: SimulationStatus.reservation.toString(),
				createDateTime: getUnixTimestamp(Date.now()),
				outputPath: outputPath, // 出力パスを追加
				outputDir: outputDir // 出力ディレクトリを追加
			};

			// DynamoDBにシミュレーション予約を保存
			console.log('Saving simulation reservation:', simulationReserve);
			await putSimulationReserve(simulationReserve);

			// 選択された名前を用いてDynamoDBのregionPresetsからmeshCodeを取得
			const meshCode = await presetInfo.getMeshcodeByPresetName(
				'us-east-1:12345678-1234-1234-1234-123456789012',
				SimulationType.Wide,
				JobType.Area,
				regionName
			);

			// メッシュコードが取得できなかった場合のエラー処理
			if (!meshCode) {
				throw new Error('Failed to retrieve mesh code for the selected region');
			}

			try {
				// DPPファイル内容の生成 - UUIDを渡す
				const dppContent = generateWideDppContent(meshCode, presetName, simulationId);
				console.log('Generated DPP content:', dppContent.substring(0, 200) + '...');

				// シミュレーションAPIの実行
				console.log('Executing simulation API...');
				const apiResult = await executeSimulationApi(simulationReserve, dppContent);
				console.log('API result:', apiResult);

				if (apiResult.success && apiResult.data) {
					// APIレスポンスを使用してシミュレーション予約を更新
					console.log('Updating simulation with API response...');

					// API結果から実際の出力ディレクトリがあれば更新
					const outputDir = `output/${simulationId}`;
					simulationReserve.outputDir = outputDir;

					const updateSuccess = await updateSimulationWithApiResponse(
						simulationReserve.id,
						apiResult.data
					);

					if (!updateSuccess) {
						console.warn('Failed to update simulation with API response');
					}

					return {
						type: 'success',
						data: {
							simulationId: simulationReserve.id,
							status: apiResult.data.status || 'SUBMITTED',
							uuid: apiResult.data.uuid,
							message: apiResult.data.message || 'Simulation started successfully'
						}
					};
				} else {
					// API呼び出しが失敗した場合
					console.error('API execution failed:', apiResult.error);
					await updateSimulationWithApiResponse(simulationReserve.id, {
						uuid: `failed-${Date.now()}`,
						simulationId: simulationReserve.id,
						jobId: `failed-${Date.now()}`,
						status: 'FAILED',
						message: apiResult.error || 'API execution failed'
					});

					return {
						type: 'error',
						error: `API execution failed: ${apiResult.error}`
					};
				}
			} catch (error) {
				// エラーが発生した場合はAPIレスポンス形式でエラー情報を更新
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error occurred';
				await updateSimulationWithApiResponse(simulationReserve.id, {
					uuid: `error-${Date.now()}`,
					simulationId: simulationReserve.id,
					status: 'FAILED',
					message: errorMessage
				});

				return {
					type: 'error',
					error: errorMessage
				};
			}
		} catch (topLevelError) {
			console.error('Top level error in addSimulationBooking:', topLevelError);
			return {
				type: 'error',
				error:
					topLevelError instanceof Error
						? topLevelError.message
						: 'An unexpected error occurred'
			};
		}
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
