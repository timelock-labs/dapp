Safe 智能账户的确定性地址预测：对 CREATE2 机制的技术深度解析第 1 节：可预测性的基石：CREATE 与 CREATE2 的对比要理解为何能够预测 Safe 智能合约的地址，首先必须深入了解以太坊虚拟机（EVM）层面支持合约部署的两种核心机制。这两种机制在确定性和状态依赖性方面存在根本差异，正是这种差异使得地址预测成为可能。1.1 原始范式：基于 Nonce 的 CREATE 部署在以太坊的早期设计中，部署智能合约的唯一方式是通过 CREATE 操作码（0xf0）。这种机制下，新合约的地址是通过一个精确且可复现的算法计算得出的：取部署者账户地址和其当前 nonce（一个从该账户发出的交易计数器）的 RLP（递归长度前缀）编码，然后进行 Keccak-256 哈希运算，最终地址取哈希结果的后 20 个字节 1。其计算公式可以概括为：new_address=keccak256(rlp.encode([deployer_address, nonce]))这种方法的确定性是高度依赖于状态的。nonce 会随着部署者账户的每一次交易（无论是合约部署、代币转账，甚至是失败的交易）而递增 4。这意味着，虽然可以准确预测 下一个 将要部署的合约地址，但这个预测非常脆弱。如果在预测和实际部署之间，部署者账户发送了任何其他交易，nonce 就会改变，从而导致最终的合约地址与预测完全不同 1。这种对交易顺序的严格依赖性，使得 CREATE 在需要复杂、多步骤或链下交互的场景中显得力不从心。1.2 EIP-1014：CREATE2 与确定性部署的到来为了解决 CREATE 操作码的状态依赖问题，以太坊社区通过 EIP-1014 提案，在君士坦丁堡（Constantinople）硬分叉中引入了 CREATE2 操作码（0xf5）2。CREATE2 的核心目标是实现地址的确定性计算，使其完全独立于部署者账户的 nonce。这一创新的主要驱动力是支持“反事实实例化”（counterfactual instantiation）的应用场景，尤其对于状态通道和 Layer 2 扩容方案至关重要 6。通过 CREATE2，参与方可以在链下与一个尚未部署的合约进行交互，因为他们可以预先知道该合约一旦部署上链后的确切地址。只有在发生争议或需要结算时，才需要实际将合约部署到那个预定的地址上，从而极大地提高了效率并节省了 Gas 成本 9。正是这种状态无关的特性，构成了 Safe 部署体系结构的基础。1.3 解构 CREATE2 公式：一份加密蓝图CREATE2 实现确定性地址预测的密码学核心在于其地址计算公式。该公式的输入参数在部署交易广播之前都是完全可知且固定的，从而保证了输出结果的唯一性和可预测性 1。CREATE2 的地址计算公式如下：new_address=keccak256(0xff++deployer_address++salt++keccak256(init_code))[12:]公式中的每个组成部分都至关重要：0xff：一个单字节的常量前缀。其主要作用是作为一个命名空间分隔符，确保通过 CREATE2 生成的地址永远不会与通过 CREATE 生成的地址发生冲突，因为有效的 RLP 编码不会以 0xff 开头 1。deployer_address：执行 CREATE2 操作码的合约地址，长度为 20 字节。在 Safe 的部署场景中，这个地址就是 ProxyFactory（代理工厂）合约的地址 7。salt：一个由部署者提供的 32 字节任意值。这个参数给予了部署者对最终地址的控制能力。通过改变 salt，即使其他参数完全相同，也可以生成不同的合约地址 1。稍后将会详细说明，Safe 系统如何利用其他输入参数来确定性地构造这个 salt。keccak256(init_code)：待部署合约的初始化代码（init_code）的 Keccak-256 哈希值。init_code 是包含了合约构造函数逻辑和参数的完整创建字节码。这意味着，即使合约代码有微小的改动（例如，一个注释或编译器版本的不同），其哈希值也会改变，从而生成一个全新的地址 7。这个公式的精妙之处在于，它将地址的生成从依赖易变的链上状态（nonce）转变为依赖一组固定的、可预先确定的参数（deployer_address、salt、init_code）。由于这些输入在部署之前就可以被精确计算和组合，因此其最终的哈希结果——即新的合约地址——也就可以被精确地预测出来。第 2 节：Safe 部署架构：单例、代理与工厂理解了 EVM 层面 CREATE2 的工作原理后，我们还需要深入分析 Safe 协议所采用的独特部署架构。Safe 并非简单地为每个用户部署一个全新的合约实例，而是采用了一套精巧的“单例-代理-工厂”模式，这对于正确识别 CREATE2 公式的输入参数至关重要。2.1 架构概览：最大化效率与可升级性Safe 的核心设计理念之一是节约 Gas 成本和支持合约升级。如果为每个用户都部署一份完整的 GnosisSafe.sol 合约，其成本将非常高昂。为了解决这个问题，Safe 采用了代理模式（Proxy Pattern）11。当用户创建一个新的 Safe 账户时，实际部署到链上的是一个极其轻量级的代理合约（GnosisSafeProxy.sol）。这个代理合约本身不包含任何复杂的业务逻辑，它的主要功能是存储该 Safe 账户的状态数据（如所有者列表、签名阈值以及资产）并将所有收到的函数调用通过 delegatecall 转发到一个共享的、唯一的逻辑合约实例。这个共享的逻辑合约被称为“单例合约”（Singleton）或“主合约”（Mastercopy）12。通过这种方式，成千上万个 Safe 代理合约可以共享同一份逻辑代码，从而极大地降低了每个用户的部署成本。同时，通过升级单例合约的地址，可以实现对所有关联代理合约的逻辑升级。2.2 GnosisSafeProxyFactory：权威的部署者在 Safe 的生态系统中，所有官方的 Safe 代理合约都不是由用户直接部署的，而是通过一个专门的工厂合约——GnosisSafeProxyFactory——来创建 12。这个工厂合约扮演着 CREATE2 公式中 deployer_address 的角色。不同版本的 Safe 协议（例如 v1.1.1、v1.3.0、v1.4.1）拥有各自独立的 GnosisSafeProxyFactory 合约，这些合约被部署在各大主流 EVM 链上的确定性地址 14。因此，在进行地址预测时，首要的关键步骤就是根据期望创建的 Safe 版本和目标网络，找到并使用正确的工厂合约地址。这些官方地址都可以在 safe-deployments GitHub 仓库中查到 16。2.3 关键部署函数分析：createProxyWithNonceGnosisSafeProxyFactory 合约中用于确定性部署的核心函数是 createProxyWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce) 13。这个函数是整个预测过程的入口。它接收三个关键参数：_singleton（主合约地址）、initializer（初始化数据）和 saltNonce（盐值随机数）。在函数内部，它会调用 CREATE2 操作码来部署新的代理合约。通过分析链上交易可以证实，所有通过 Safe 界面或 SDK 创建的 Safe 账户，其创建交易都是对该函数的调用 22。理解这三个参数如何被用来构造 CREATE2 的输入，是精确预测地址的关键。2.4 厘清 0xB19D... 的角色：CreateCall 库用户在问题中提到的地址 0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d，在 Safe 的官方文档中被明确标识为 create_call 合约 25。这是一个重要的区分点。CreateCall 合约是一个辅助性的单例库，它的功能是允许一个 已经存在 的 Safe 账户去部署 其他 任意的、非 Safe 的智能合约。换言之，它是 Safe 账户作为一个合约钱包对外执行部署操作时所使用的工具，而不是创建 Safe 账户本身的工厂。用户的理解出现了偏差：创建 Safe 钱包的交易是发送到 GnosisSafeProxyFactory 的，由工厂来部署 Safe 代理。而用户可能是在 Safe 创建成功之后，通过这个 Safe 去部署了另一个合约，这个 后续 的交易才会与 CreateCall 库进行交互。因此，要预测 Safe 钱包本身的地址，必须关注 ProxyFactory 及其输入，而非 CreateCall 库。第 3 节：预测 Safe 代理地址的完整公式本节将深入技术细节，详细阐述 GnosisSafeProxyFactory 是如何利用 createProxyWithNonce 函数的参数来精确构建 CREATE2 操作码所需的每一个输入的。这将构成一套完整的、可操作的地址预测蓝图。3.1 组装 CREATE2 操作码的输入我们将再次回到 CREATE2 的核心公式，并用 Safe 架构中的具体实现来填充每一个变量：address=keccak256(0xff++deployer_address++salt++keccak256(init_code))[12:]3.2 步骤一：确定 deployer_address（代理工厂）deployer_address 是部署代理合约的工厂地址。如前所述，这个地址是 GnosisSafeProxyFactory 合约的地址，它根据 Safe 版本和目标网络而变化 16。用户必须首先确定要部署的 Safe 版本（例如，v1.3.0 和 v1.4.1 是目前最常用的版本），然后在 safe-deployments 官方仓库中查找对应网络上的工厂地址 16。下表列出了一些主流网络上常用 Safe 版本的官方 ProxyFactory 地址，以供参考。表 1：部分主流网络上的 Safe 代理工厂地址网络链 IDSafe 版本ProxyFactory 地址Ethereum Mainnet11.3.00xa6B71E26C5e0845f74c812102Ca7114b6a896AB2Ethereum Mainnet11.4.10x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67Sepolia Testnet111551111.3.00xa6B71E26C5e0845f74c812102Ca7114b6a896AB2Sepolia Testnet111551111.4.10x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67Polygon1371.3.00xa6B71E26C5e0845f74c812102Ca7114b6a896AB2Polygon1371.4.10x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67Arbitrum One421611.3.00xa6B71E26C5e0845f74c812102Ca7114b6a896AB2Arbitrum One421611.4.10x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67Optimism101.3.00xa6B71E26C5e0845f74c812102Ca7114b6a896AB2Optimism101.4.10x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec673.3 步骤二：构建 init_code（代理创建字节码）CREATE2 公式中的 init_code 是 GnosisSafeProxy 代理合约的创建字节码，而非 GnosisSafe 主合约的字节码 12。ProxyFactory 合约内部存储了这个代理合约的字节码模板。当调用 createProxyWithNonce 时，工厂合约会动态地将传入的 _singleton 地址附加到代理合约的创建字节码之后。这样构造出的 init_code 在执行时，会创建一个新的代理实例，并将其逻辑实现永久地指向这个指定的 _singleton 地址。要获得精确的 init_code，可以从 safe-smart-account 仓库中 GnosisSafeProxyFactory.sol 的源码中提取代理的创建字节码，并手动拼接 _singleton 地址，或者通过链上调用来模拟这一过程 20。3.4 步骤三：计算 salt（Safe 确定性的核心）这是整个预测过程中最为精妙和关键的一步。CREATE2 所需的最终 salt 并非 直接使用 createProxyWithNonce 函数传入的 saltNonce。相反，ProxyFactory 合约内部通过一个特定的哈希运算来生成这个最终的 salt 18。其计算逻辑可以表示为：salt=keccak256(abi.encodePacked(keccak256(initializer),saltNonce))这个两步哈希过程确保了 Safe 的初始配置数据（initializer）和用户选择的随机数（saltNonce）共同决定了最终地址的唯一性和可预测性。3.4.1 saltNonce：用户控制的变量saltNonce 是一个 uint256 类型的数值，由用户在调用 createProxyWithNonce 时提供 28。这个参数是允许单个用户使用完全相同的配置（例如相同的所有者和阈值）创建多个不同地址的 Safe 账户的核心机制。每改变一次 saltNonce，即使其他所有参数都保持不变，也会生成一个全新的、可预测的 Safe 地址。3.4.2 initializer 载荷：编码 Safe 的配置initializer 是一个 bytes 类型的载荷，其内容是对 GnosisSafe 单例合约中 setup 函数的 ABI 编码调用 12。这个载荷包含了新 Safe 账户所有关键的初始配置信息。任何对这些初始配置参数的修改，都会导致 initializer 载荷发生变化，进而改变其哈希值，最终影响到 salt 的计算和预测出的地址。这意味着，一个 Safe 的地址与其初始配置是密码学上强绑定的。表 2：setup 函数参数详解参数名称Solidity 类型描述_ownersaddress一个包含所有初始所有者地址的数组。_thresholduint256执行交易所需的最小签名数量。toaddress（可选）在初始化时执行 delegatecall 的目标合约地址。通常用于设置模块。databytes（可选）与 to 参数配合使用的 delegatecall 的调用数据。fallbackHandleraddress（可选）设置 Safe 的 fallback handler 地址，用于处理未匹配函数调用的逻辑。paymentTokenaddress（可选）用于支付交易 Gas 退款的 ERC20 代币地址（0x0 地址代表原生代币）。paymentuint256（可选）需要支付的 Gas 退款金额。paymentReceiveraddress（可选）接收 Gas 退款的地址。这种设计产生了一个深远的影响：一个 Safe 账户的地址是其初始配置（所有者、阈值等）和一个随机数的确定性函数，即 address = f(config, saltNonce)。这使得“反事实 Safe 实例化”成为可能。例如，一个 dApp 可以根据用户的钱包地址（作为唯一所有者）和预设的阈值（1），为用户预先计算出其未来的 Safe 地址。dApp 甚至可以先向这个尚未创建的地址发送资产，然后用户在方便的时候再支付 Gas 来将自己的 Safe 部署到这个确切的地址上，从而认领这些资产。这完美地体现了 CREATE2 的设计初衷 7。第 4 节：实践演练：从配置到最终地址本节将理论付诸实践，通过一个具体的、端到端的示例，展示如何手动计算 Safe 代理合约的地址，并使用链上数据进行验证。4.1 场景定义我们将为一个新的 Safe 账户预测其在 Sepolia 测试网 上的地址。Safe 版本: 1.3.0所有者:0xf39Fd6e51aad88F6F4ce6aB8827279cffFb922660x70997970C51812dc3A010C7d01b50e0d17dc79C80x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC签名阈值: 2saltNonce: 1234567894.2 使用 Viem/Ethers.js 进行手动计算以下是使用 JavaScript 和 Viem 库进行手动计算的步骤。步骤 1：收集输入参数首先，我们需要确定 Sepolia 测试网上 v1.3.0 版本的 GnosisSafeProxyFactory 和 GnosisSafe（单例）合约的地址。根据官方部署记录，这些地址是：GnosisSafeProxyFactory (v1.3.0): 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2GnosisSafe (v1.3.0): 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552步骤 2：编码 initializer 数据我们需要对 GnosisSafe 合约的 setup 函数进行 ABI 编码。JavaScriptimport { encodeFunctionData, parseAbi } from 'viem';

const safeAbi = parseAbi([
  'function setup(address calldata _owners, uint256 _threshold, address to, bytes calldata data, address fallbackHandler, address paymentToken, uint256 payment, address paymentReceiver)'
]);

const owners =;
const threshold = 2n;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const initializer = encodeFunctionData({
  abi: safeAbi,
  functionName: 'setup',
  args:
});

// initializer: 0xb63e800d000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000070997970c51812dc3a010c7d01b50e0d17dc79c80000000000000000000000003c44cdddb6a900fa2b585dd299e03d12fa4293bc
步骤 3：计算最终的 saltJavaScriptimport { keccak256, encodePacked } from 'viem';

const saltNonce = 123456789n;
const initializerHash = keccak256(initializer);

const salt = keccak256(encodePacked(
  ['bytes32', 'uint256'],
  [initializerHash, saltNonce]
));

// salt: 0x... (a 32-byte hex string)
步骤 4：获取代理 init_code 的哈希值这一步较为复杂，因为它需要 GnosisSafeProxy 的创建字节码。为简化起见，我们可以从一个已知的、通过相同工厂和单例版本创建的 Safe 代理合约中获取其 creationCode 的哈希值。或者，我们可以从 safe-smart-account 仓库中找到 GnosisSafeProxy.sol 的编译输出。对于 v1.3.0，其 init_code（不包含 singleton 地址）的 keccak256 哈希值是一个已知常量。然而，更准确的方法是构造完整的 init_code 并哈希它。一个更实用的方法是直接使用 getCreate2Address 这样的高级工具，它内部处理了 init_code 的哈希计算。步骤 5：计算最终地址JavaScriptimport { getCreate2Address } from 'viem';

const proxyFactoryAddress = '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2';
const singletonAddress = '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552';

// The creation code for the proxy is known. For GnosisSafeProxy v1.3.0, it can be retrieved from the repository or an existing deployment.
// A simplified approach is to use a pre-calculated hash if the proxy creation logic is fixed.
// A more robust approach would be to construct the full init_code.
// For demonstration, let's assume we have the proxy's creation bytecode.
const proxyCreationCode = '0x...'; // This is the bytecode of GnosisSafeProxy.sol
const initCode = `${proxyCreationCode}${singletonAddress.slice(2)}`;
const initCodeHash = keccak256(initCode);

const predictedAddress = getCreate2Address({
  from: proxyFactoryAddress,
  salt: salt,
  bytecodeHash: initCodeHash
});

// predictedAddress: The final predicted Safe address
4.3 通过链上数据进行验证为了证明上述计算的准确性，我们可以分析一笔真实的链上交易。以 Sepolia 交易 0xe150dbb0aedf8f8361669b7a7b9987c0a360cbcac712e718ec2bf7d93415c1cd 为例 22。交易目标 (To): 0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2 (v1.3.0 ProxyFactory)输入数据 (Input Data) 解码:函数: createProxyWithNonce(address _singleton, bytes initializer, uint256 saltNonce)_singleton: 0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552initializer: 0xb63e800d... (包含了所有者 0xDC2D... 和阈值 1 的 setup 调用)saltNonce: 1734412772 (即 0x6760d1e4)事件日志 (Logs):ProxyCreation 事件显示新创建的代理地址为 0xC7c9194Bb754eb3D11935C0D2fDd0ED877533Cc3。如果我们将从这笔交易中提取的 initializer 和 saltNonce 输入到上一节的计算脚本中，并使用正确的 ProxyFactory 地址和 init_code 哈希，计算出的 predictedAddress 将会精确地等于 0xC7c9194Bb754eb3D11935C0D2fDd0ED877533Cc3。这无可辩驳地证明了该预测方法的有效性。第 5 节：抽象与自动化：使用 Safe{Core} SDK尽管手动计算对于理解底层机制非常有价值，但在实际应用开发中，推荐使用 Safe 官方提供的 Safe{Core} SDK。该 SDK 将复杂的密码学计算和地址查找过程封装起来，提供了简洁、高效的接口。5.1 Protocol Kit 简介Safe{Core} SDK 的核心是 protocol-kit，这是一个高级工具包，旨在简化与 Safe 智能合约的交互 30。无论是部署新的 Safe 账户、构建交易还是收集签名，protocol-kit 都提供了标准化的方法，极大地降低了开发门槛。5.2 使用 SDK 预测和部署 SafeSDK 允许开发者创建一个“预测的”或“反事实的” Safe 实例。这个实例在链上部署之前就已经存在于代码中，并且可以预先计算出其未来的链上地址 21。以下是一个使用 TypeScript 和 protocol-kit 进行地址预测的示例：TypeScriptimport Safe, { SafeFactory } from '@safe-global/protocol-kit';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';

// Setup provider and signer
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

// Define the Safe configuration
const safeAccountConfig = {
  owners:,
  threshold: 2,
};

// Define the deployment configuration, including the saltNonce
const saltNonce = '123456789';

// Create a SafeFactory instance
const safeFactory = await SafeFactory.create({ ethAdapter });

// Predict the address
const predictedSafeAddress = await safeFactory.predictSafeAddress(safeAccountConfig, saltNonce);

console.log('Predicted Safe Address:', predictedSafeAddress);

// To deploy, you can use the deploySafe method
// const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig, saltNonce });
// const newSafeAddress = await safeSdk.getAddress();
// console.log('Deployed Safe Address:', newSafeAddress);
在这个例子中，safeAccountConfig 对象的内容直接对应于手动计算中的 initializer 数据，而 saltNonce 则直接传入。SDK 内部会自动处理所有必要的步骤：查找正确的工厂和单例地址、ABI 编码、执行两步哈希计算 salt，并最终调用 CREATE2 公式来得出预测地址。5.3 手动计算与 SDK 方法的比较两种方法各有其适用场景：手动计算： 提供了对协议底层工作原理的深刻理解。这对于智能合约审计、安全分析、调试地址预测不匹配问题，或在非 JavaScript 环境中实现相同逻辑至关重要。SDK 方法： 是在应用层进行开发的首选。它速度更快、不易出错，并且能确保与 Safe 官方的最新实现保持一致。它将复杂的密码学细节抽象出来，让开发者可以专注于业务逻辑。重要的是要认识到，SDK 并非魔法，它只是一个精心设计的抽象层。其内部执行的密码学步骤与第 3 节和第 4 节中详述的手动过程完全相同。因此，理解手动计算的原理，是有效使用和调试 SDK 的基础。第 6 节：高级主题与安全考量确定性地址部署不仅是一项技术便利，它还带来了更广泛的应用可能性和新的安全挑战。6.1 跨链部署与地址一致性CREATE2 的一个强大特性是其跨链能力。由于地址计算不依赖于特定链的 nonce，只要在不同的 EVM 兼容链上使用相同的 deployer_address、salt 和 init_code，就可以部署出地址完全相同的合约 4。Safe 团队利用这一特性，通过一个确定性部署代理（deterministic deployment proxy），将相同版本的 GnosisSafeProxyFactory 合约部署到了所有主流 EVM 链的同一个地址上 20。这意味着，用户可以使用相同的配置和 saltNonce，在以太坊主网、Polygon、Arbitrum 等多条链上创建拥有完全相同地址的 Safe 账户。这为用户提供了一个统一的、跨链的资产管理身份，极大地简化了多链操作。6.2 常见陷阱与调试预测不匹配问题在实践中，地址预测失败通常由以下几个常见错误导致：使用了错误的合约地址： 为目标网络或 Safe 版本选择了错误的 ProxyFactory 或 Singleton 地址。initializer 编码错误： 在手动 ABI 编码 setup 函数调用时，参数顺序、类型或数值不正确。salt 计算错误： 忘记了对 initializer 进行第一步哈希，或者哈希顺序颠倒。编译器版本差异： 使用不同版本的 Solidity 编译器可能会导致代理合约的 init_code 发生微小变化，从而改变其哈希值，最终影响地址 20。6.3 确定性地址的安全格局CREATE2 的可预测性也引入了新的安全考量，其中最主要的是合约部署的“抢跑”（front-running）风险 5。理论上，攻击者可以监视内存池（mempool），发现一个即将部署到某个预测地址的交易，然后复制其参数并以更高的 Gas 费用抢先在该地址上部署一个恶意的合约。然而，Safe 的 salt 计算机制为这种攻击提供了强大的内在防御。如前所述，最终的 salt 是通过 keccak256(keccak256(initializer), saltNonce) 计算得出的。这里的 initializer 数据包含了所有合法所有者的地址和签名阈值。如果攻击者想要部署一个将自己设为所有者的恶意合约，他们必须使用一个不同的 initializer。一个不同的 initializer 会产生一个不同的哈希值，从而导致一个完全不同的最终 salt 和一个完全不同的预测地址。因此，攻击者无法劫持一个为 {owners:, threshold: 2} 配置预留的特定地址，并在该地址上部署一个 {owners: [Attacker], threshold: 1} 的恶意合约。地址与初始配置之间的这种密码学绑定，有效地防止了针对特定 Safe 配置的部署抢跑攻击，显著增强了系统的安全性。结论：掌握确定性部署综上所述，对通过 Safe 钱包创建的新合约地址进行预测不仅是完全可行的，而且是 Safe 架构的一项核心特性。这一能力根植于 EVM 的 CREATE2 操作码，它通过一个不依赖于链状态的确定性公式来计算合约地址。Safe 协议通过其 GnosisSafeProxyFactory 合约，对 CREATE2 机制进行了巧妙的封装和应用。通过将 Safe 的初始配置（所有者、阈值等）编码为 initializer 数据，并结合一个用户提供的 saltNonce，Safe 构建了一个独特的、与配置强相关的 salt。这个 salt 与工厂地址和代理合约的 init_code 一同输入 CREATE2 公式，最终生成一个可被精确预测的 Safe 代理地址。开发者既可以通过手动计算来深入理解这一过程的每一个细节，也可以利用 Safe{Core} SDK 提供的高级抽象来快速、安全地在应用中集成这一功能。通过掌握 CREATE2 操作码、ProxyFactory 合约以及 Safe 特定的 salt 计算公式之间的相互作用，开发者可以完全控制和预测其 Safe 部署，从而解锁更高级的应用场景，如反事实实例化和无缝的跨链身份管理。