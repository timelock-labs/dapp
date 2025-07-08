1. 先换wallet 钱包插件使用 thirdweb，且需要支持 safewallet

   https://playground.thirdweb.com/connect/sign-in/button
2. 钱包需要签署消息通过后端验证，方为完成登录动作
3. wallet 可以连接的链 从后端接口获取
4. 切换链 wallet 没切换成功
5. 刷新页面 accessToken不能 消失
6. 创建 timelocker 上链， 先 oz
7. timelocker 对接接口
8. 针对compound标准的，都是你那边需要集成一键call小按钮的；先是admin点击set-pending-admin；然后pendingadmin登陆进来后，会看到accept-admin亮着，可以点；中间那个就是来检查该用户能不能调用set-pending-admin或者能不能来接受admin（返回俩值，一个是canSetPendingAdmin，一个是canAcceptAdmin，均是布尔值）
9. 也就是先用2来检查相应权限（应该只有一个true和一个false和全false，不然就是后端这边逻辑错了，得调整），再各自调用1，3
   先检查
10. Timelock 其余接口对接
11. ABI 对接
12. Transaction 对接
13.
