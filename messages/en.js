// 动态导入并合并所有英文模块
import common from './en/common.json';
import auth from './en/auth.json';
import navigation from './en/navigation.json';
import timelock from './en/timelock.json';
import transaction from './en/transaction.json';
import abi from './en/abi.json';
import notification from './en/notification.json';
import home from './en/home.json';
import wallet from './en/wallet.json';

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
};
