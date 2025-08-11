// 动态导入并合并所有中文模块
import common from './zh/common.json';
import auth from './zh/auth.json';
import navigation from './zh/navigation.json';
import timelock from './zh/timelock.json';
import transaction from './zh/transaction.json';

import abi from '@/app/abi-lib/i18n/zh.json';
import createTimelock from '@/app/create-timelock/i18n/zh.json';

import notification from './zh/notification.json';
import home from './zh/home.json';
import wallet from './zh/wallet.json';

export default {
	// common 模块直接包含键值对，需要包装在 common 命名空间中
	common,

	// 其他模块已经有正确的命名空间结构，直接展开
	...auth,
	...navigation,
	...timelock,
	...transaction,
	...abi,
	...notification,
	...home,
	...wallet,
	...createTimelock,
};
