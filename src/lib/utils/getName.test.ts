import { describe, it, expect } from 'vitest';
import { getSimulationTypeName, getJobTypeName, getSimulationStatusName } from './getName';

describe('getName functions', () => {
	it('should return the correct simulation type name', () => {
		expect(getSimulationTypeName('wide')).toBe('広域');
		expect(getSimulationTypeName('narrow')).toBe('個別建物');
		expect(getSimulationTypeName('type3')).toBe(null); // 存在しないID
	});

	it('should return the correct job type name', () => {
		expect(getJobTypeName('job1')).toBe('地域');
		expect(getJobTypeName('job2')).toBe('地震動');
		expect(getJobTypeName('job3')).toBe('建物');
		expect(getJobTypeName('job4')).toBe('解析モデル');
		expect(getJobTypeName('job5')).toBe(null); // 存在しないID
	});

	it('should return the correct simulation status name', () => {
		expect(getSimulationStatusName('0')).toBe('計算予約');
		expect(getSimulationStatusName('1')).toBe('計算開始');
		expect(getSimulationStatusName('2')).toBe('計算完了');
		expect(getSimulationStatusName('3')).toBe('計算エラー');
		expect(getSimulationStatusName('4')).toBe('可視化加工処理開始');
		expect(getSimulationStatusName('5')).toBe('可視化加工処理完了');
		expect(getSimulationStatusName('6')).toBe('可視化加工処理エラー');
		expect(getSimulationStatusName('7')).toBe(null); // 存在しないID
	});
});
