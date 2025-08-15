// 动态导入并合并所有中文模块
import common from './zh/common.json';
import login from '@/app/login/i18n/zh.json';
import navigation from '@/components/navigation/i18n/zh.json';

import abi from '@/app/abi-lib/i18n/zh.json';
import createTimelock from '@/app/create-timelock/i18n/zh.json';
import createTransaction from '@/app/create-transaction/i18n/zh.json';
import importTimelock from '@/app/import-timelock/i18n/zh.json';
import home from '@/app/home/i18n/zh.json';
import timelocks from '@/app/timelocks/i18n/zh.json';
import transactions from '@/app/transactions/i18n/zh.json';
import notify from '@/app/notify/i18n/zh.json';
import ecosystem from '@/app/ecosystem/i18n/zh.json';

export default {
	// common 模块直接包含键值对，需要包装在 common 命名空间中
	common,

	// 其他模块已经有正确的命名空间结构，直接展开
	...navigation,
	...abi,
	...login,
	...createTimelock,
	...createTransaction,
	...importTimelock,
	...home,
	...timelocks,
	...transactions,
	...notify,
	...ecosystem,
};
