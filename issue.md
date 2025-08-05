1. 针对compound标准的，都是你那边需要集成一键call小按钮的；先是admin点击set-pending-admin；然后pendingadmin登陆进来后，会看到accept-admin亮着，可以点；中间那个就是来检查该用户能不能调用set-pending-admin或者能不能来接受admin（返回俩值，一个是canSetPendingAdmin，一个是canAcceptAdmin，均是布尔值）
2. 也就是先用2来检查相应权限（应该只有一个true和一个false和全false，不然就是后端这边逻辑错了，得调整），再各自调用1，3
   先检查

一共四个大的模块

- ABI-Lib
  - 最简单只有增删改查
  - 需要验证 abi
- timelocks
  - 列表
    - 删除功能
  - 创建
  - 导入 （先对接导入 再 创建）
    - 需要 验证合约标准
    - 需要检查参数
- notify
  - 需要 timelock 地址
  - 需要 接收发送验证码
- transcations
  - 需要以上三个

ABI-Lib 已经完成




  Compound Timelock 方法参数：

1. **queueTransaction**: `(address target, uint256 value, string signature, bytes data, uint256 eta)`
   - `target`: 目标合约地址，要调用的合约
   - `value`: 发送的以太币数量（wei单位）
   - `signature`: 函数签名，如 "transfer(address,uint256)"
   - `data`: 编码后的函数调用数据
   - `eta`: 执行时间戳（Unix时间戳），必须在当前时间+延迟时间之后

2. **executeTransaction**: `(address target, uint256 value, string signature, bytes data, uint256 eta)`
   - 参数同queueTransaction，用于执行已排队的交易
   - 必须在eta时间之后且在grace period内执行

3. **cancelTransaction**: `(address target, uint256 value, string signature, bytes data, uint256 eta)`
   - 参数同queueTransaction，用于取消已排队的交易
   - 只有admin可以取消

4. **setPendingAdmin**: `(address pendingAdmin_)`
   - `pendingAdmin_`: 新的待定管理员地址
   - 只有当前admin可以调用

5. **acceptAdmin**: 无参数
   - 只有pendingAdmin可以调用来接受管理员权限

6. **setDelay**: `(uint256 delay_)`
   - `delay_`: 新的延迟时间（秒），必须在MINIMUM_DELAY和MAXIMUM_DELAY之间

## OpenZeppelin Timelock 方法参数：

1. **schedule**: `(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt, uint256 delay)`
   - `target`: 目标合约地址
   - `value`: 发送的以太币数量（wei单位）
   - `data`: 编码后的函数调用数据（不包含函数选择器）
   - `predecessor`: 前置操作ID，必须先执行的操作（0x0表示无前置）
   - `salt`: 随机盐值，用于生成唯一的操作ID
   - `delay`: 延迟时间（秒），必须大于等于最小延迟

2. **scheduleBatch**: `(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt, uint256 delay)`
   - `targets`: 目标合约地址数组
   - `values`: 以太币数量数组
   - `datas`: 函数调用数据数组
   - `predecessor`: 前置操作ID
   - `salt`: 随机盐值
   - `delay`: 延迟时间
   - 用于批量调度多个操作

3. **execute**: `(address target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt)`
   - 参数同schedule（除了delay），用于执行已调度的操作
   - 必须在延迟时间过后执行

4. **executeBatch**: `(address[] targets, uint256[] values, bytes[] datas, bytes32 predecessor, bytes32 salt)`
   - 参数同scheduleBatch（除了delay），用于批量执行已调度的操作

5. **cancel**: `(bytes32 id)`
   - `id`: 操作ID，由target、value、data、predecessor、salt计算得出
   - 只有具有CANCELLER_ROLE的账户可以调用

6. **updateDelay**: `(uint256 newDelay)`
   - `newDelay`: 新的最小延迟时间（秒）
   - 只能通过timelock自身调用（需要先schedule再execute）

7. **grantRole**: `(bytes32 role, address account)`
   - `role`: 角色标识符（如PROPOSER_ROLE、EXECUTOR_ROLE、CANCELLER_ROLE）
   - `account`: 要授予角色的账户地址

8. **revokeRole**: `(bytes32 role, address account)`
   - `role`: 角色标识符
   - `account`: 要撤销角色的账户地址

### 常用角色标识符：
- `PROPOSER_ROLE`: 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1
- `EXECUTOR_ROLE`: 0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63
- `CANCELLER_ROLE`: 0xfd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783
- `TIMELOCK_ADMIN_ROLE`: 0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5
