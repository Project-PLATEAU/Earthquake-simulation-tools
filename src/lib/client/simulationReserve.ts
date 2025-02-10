import { getClient } from './dynamodb';
import type { SimulationReserve } from '$lib/types';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import {
	QueryCommand,
	DynamoDBDocumentClient,
	ScanCommand,
	type ScanCommandOutput
} from '@aws-sdk/lib-dynamodb';

const getById = async (id: string): Promise<SimulationReserve | null> => {
	console.log('getById', id);
	const client = getClient();
	const docClient = DynamoDBDocumentClient.from(client);
	const params = {
		TableName: 'simulation_reserve',
		KeyConditionExpression: 'id = :id',
		ExpressionAttributeValues: {
			':id': id
		},
		ConsistentRead: true
	};

	const command = new QueryCommand(params);
	const data = await docClient.send(command);
	const presetInfos = makeSimulationReserves(data);
	return presetInfos.length > 0 ? presetInfos[0] : null;
};

const getByUserType = async (userId: string, typeId: string): Promise<SimulationReserve[]> => {
	console.log('getByUserType', userId + typeId);
	const client = getClient();
	const docClient = DynamoDBDocumentClient.from(client);
	const params = {
		TableName: 'simulation_reserve',
		FilterExpression: '#userId = :userIdValue AND #type = :typeIdValue',
		ExpressionAttributeNames: {
			'#userId': 'userId', // フィルタリングする非キー項目
			'#type': 'type' // フィルタリングする非キー項目
		},
		ExpressionAttributeValues: {
			':userIdValue': userId,
			':typeIdValue': typeId
		},
		ConsistentRead: true
	};

	const command = new ScanCommand(params);
	const data = await docClient.send(command);
	const presetInfos = makeSimulationReserves(data);
	return presetInfos;
};

const putSimulationReserve = async (item: SimulationReserve): Promise<{ success: boolean }> => {
	const params = {
		TableName: 'simulation_reserve',
		Item: item
	};

	const client = getClient();
	const docClient = DynamoDBDocumentClient.from(client);

	try {
		const command = new PutCommand(params);
		await docClient.send(command);
		return { success: true };
	} catch (error) {
		console.error('Error adding item:', error);
		throw new Error('Failed to add item to DynamoDB');
	}
};

const makeSimulationReserves = (data: ScanCommandOutput): SimulationReserve[] => {
	const presetInfos =
		data.Items?.map<SimulationReserve>((item) => ({
			id: item.id,
			userId: item.userId,
			type: item.type,
			paramName: item.paramName,
			createDateTime: item.createDateTime,
			status: item.status,
			regionName: item.regionName
		})) ?? [];
	return presetInfos;
};

export { getById, getByUserType, putSimulationReserve };
