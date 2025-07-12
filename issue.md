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
11. tx 列表现在还有问题
12. ABI 对接
13. Transaction 对接
14. [Assets](http://localhost:8080/swagger/index.html#/Assets) 对接
15. [Email Notifications](http://localhost:8080/swagger/index.html#/Email%20Notifications) 对接
16. 




thirdweb-dev 的 签名 和 viem 不兼容




### `signTransactionError` 原因分析

你遇到的 `signTransactionError` 错误很可能源于 `viem` 和 `@thirdweb-dev/react` 提供的 `signer` (基于 ethers.js v5) 之间的集成问题。

在你的原始代码中，你通过 `custom(signer.provider.provider)` 创建了一个 `viem` 的 transport。虽然这种方式理论上可行，旨在将一个 EIP-1193 兼容的 provider（`signer.provider.provider`）包装给 `viem` 使用，但在不同库版本和实现细节之间，这种“桥接”很容易出现兼容性问题或未预期的行为，从而导致签名或交易发送失败。
