
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
