import { ethers } from 'ethers';

class EthereumParamsCodec {
    constructor() {
        this.utils = ethers.utils;
        this.coder = ethers.utils.defaultAbiCoder;
    }

    /**
     * 标准化地址格式
     * @param {string} address - 原始地址
     * @returns {string} 标准化后的地址
     */
    normalizeAddress(address: string) {
        try {
            return this.utils.getAddress(address.toLowerCase());
        } catch (error) {
            throw new Error(`无效的地址格式: ${address}`);
        }
    }

    /**
     * 解析函数签名，提取参数类型
     * @param {string} functionSig - 函数签名，例如 "approve(address,uint256)"
     * @returns {Array} 参数类型数组
     */
    parseParamTypes(functionSig: string) {
        // 移除空格
        functionSig = functionSig.replace(/\s+/g, '');

        const match = functionSig.match(/^[a-zA-Z_][a-zA-Z0-9_]*\((.*)\)$/);
        if (!match) {
            throw new Error('无效的函数签名格式');
        }

        const paramsStr = match[1];

        // 解析参数类型
        return paramsStr ? paramsStr.split(',').map(type => type.trim()) : [];
    }

    /**
     * 预处理参数值
     * @param {Array} paramTypes - 参数类型数组
     * @param {Array} params - 原始参数值数组
     * @returns {Array} 处理后的参数值数组
     */
    preprocessParams(paramTypes: [], params: []): any[] {
        return params.map((param, index) => {
            const paramType = paramTypes[index];
            if (paramType === 'address' && typeof param === 'string') {
                return this.normalizeAddress(param);
            }
            return param;
        });
    }

    /**
     * 编码参数为十六进制数据（不包含函数选择器）
     * @param {string} functionSig - 函数签名
     * @param {Array} params - 参数数组
     * @returns {object} 编码结果
     */
    encodeParams(functionSig:string, params:[]): any {
        try {
            const paramTypes = this.parseParamTypes(functionSig);

            if (params.length !== paramTypes.length) {
                throw new Error(`参数数量不匹配。期望 ${paramTypes.length} 个参数，实际 ${params.length} 个`);
            }

            // 预处理参数
            const processedParams = this.preprocessParams(paramTypes, params);

            // 编码参数
            const encoded = this.coder.encode(paramTypes, processedParams);

            return {
                success: true,
                encodedData: encoded,
                details: {
                    paramTypes: paramTypes,
                    originalParams: params,
                    processedParams: processedParams,
                    dataLength: encoded.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 解码十六进制数据为参数值（不包含函数选择器）
     * @param {string} functionSig - 函数签名
     * @param {string} encodedData - 编码的参数数据
     * @returns {object} 解码结果
     */
    decodeParams(functionSig:string, encodedData:string): any {
        try {
            const paramTypes = this.parseParamTypes(functionSig);

            // 确保数据以0x开头
            if (!encodedData.startsWith('0x')) {
                encodedData = '0x' + encodedData;
            }

            // 解码参数
            const decoded = this.coder.decode(paramTypes, encodedData);

            // 格式化解码结果
            const params = [];
            for (let i = 0; i < paramTypes.length; i++) {
                const paramType = paramTypes[i];
                let value = decoded[i];

                // 对于数字类型，转换为字符串以避免精度问题
                if (paramType.includes('uint') || paramType.includes('int')) {
                    value = value.toString();
                }

                params.push({
                    type: paramType,
                    value: value,
                    index: i
                });
            }

            return {
                success: true,
                params: params,
                details: {
                    paramTypes: paramTypes,
                    originalData: encodedData,
                    dataLength: encodedData.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 仅使用参数类型数组进行编码
     * @param {Array} paramTypes - 参数类型数组，例如 ['address', 'uint256']
     * @param {Array} params - 参数值数组
     * @returns {object} 编码结果
     */
    encodeByTypes(paramTypes:[], params:[]): any {
        try {
            if (params.length !== paramTypes.length) {
                throw new Error(`参数数量不匹配。期望 ${paramTypes.length} 个参数，实际 ${params.length} 个`);
            }

            // 预处理参数
            const processedParams = this.preprocessParams(paramTypes, params);

            // 编码参数
            const encoded = this.coder.encode(paramTypes, processedParams);

            return {
                success: true,
                encodedData: encoded,
                details: {
                    paramTypes: paramTypes,
                    originalParams: params,
                    processedParams: processedParams,
                    dataLength: encoded.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 仅使用参数类型数组进行解码
     * @param {Array} paramTypes - 参数类型数组，例如 ['address', 'uint256']
     * @param {string} encodedData - 编码的参数数据
     * @returns {object} 解码结果
     */
    decodeByTypes(paramTypes, encodedData) {
        try {
            // 确保数据以0x开头
            if (!encodedData.startsWith('0x')) {
                encodedData = '0x' + encodedData;
            }

            // 解码参数
            const decoded = this.coder.decode(paramTypes, encodedData);

            // 格式化解码结果
            const params = [];
            for (let i = 0; i < paramTypes.length; i++) {
                const paramType = paramTypes[i];
                let value = decoded[i];

                // 对于数字类型，转换为字符串
                if (paramType.includes('uint') || paramType.includes('int')) {
                    value = value.toString();
                }

                params.push({
                    type: paramType,
                    value: value,
                    index: i
                });
            }

            return {
                success: true,
                params: params,
                details: {
                    paramTypes: paramTypes,
                    originalData: encodedData,
                    dataLength: encodedData.length
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 获取函数选择器（辅助功能）
     * @param {string} functionSig - 函数签名
     * @returns {object} 函数选择器结果
     */
    getFunctionSelector(functionSig) {
        try {
            const signature = functionSig.replace(/\s+/g, '');
            const hash = this.utils.keccak256(this.utils.toUtf8Bytes(signature));
            const selector = hash.slice(0, 10); // 取前4字节

            return {
                success: true,
                selector: selector,
                functionSignature: signature
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// // 使用示例
// function example() {
//     const codec = new EthereumParamsCodec();

//     console.log('=== 参数编码示例 ===');
//     // 例子1：编码 approve(address, uint256) 的参数
//     const encodeResult = codec.encodeParams(
//         'approve(address, uint256)',
//         ['0xf8d9D01c90B84dC99064968Ed77B829Ab0A593F7', '9527']
//     );

//     if (encodeResult.success) {
//         console.log('编码成功:');
//         console.log('编码数据:', encodeResult.encodedData);
//         console.log('参数类型:', encodeResult.details.paramTypes);
//         console.log('处理后参数:', encodeResult.details.processedParams);
//     } else {
//         console.log('编码失败:', encodeResult.error);
//     }

//     console.log('\n=== 参数解码示例 ===');
//     // 例子2：解码你提供的数据
//     const decodeResult = codec.decodeParams(
//         'approve(address, uint256)',
//         '0x000000000000000000000000f8d9d01c90b84dc99064968ed77b829ab0a593f700000000000000000000000000000000000000000000020475af37ca6a7c0000'
//     );

//     if (decodeResult.success) {
//         console.log('解码成功:');
//         decodeResult.params.forEach((param, index) => {
//             console.log(`  参数${index}: ${param.type} = ${param.value}`);
//         });
//     } else {
//         console.log('解码失败:', decodeResult.error);
//     }

//     console.log('\n=== 仅使用类型数组的示例 ===');
//     // 使用类型数组直接编码
//     const typeEncodeResult = codec.encodeByTypes(
//         ['address', 'uint256'],
//         ['0xf8d9D01c90B84dC99064968Ed77B829Ab0A593F7', '9527']
//     );

//     if (typeEncodeResult.success) {
//         console.log('类型编码成功:');
//         console.log('编码数据:', typeEncodeResult.encodedData);
//     }

//     // 使用类型数组直接解码
//     const typeDecodeResult = codec.decodeByTypes(
//         ['address', 'uint256'],
//         '0x000000000000000000000000f8d9d01c90b84dc99064968ed77b829ab0a593f700000000000000000000000000000000000000000000020475af37ca6a7c0000'
//     );

//     if (typeDecodeResult.success) {
//         console.log('类型解码成功:');
//         typeDecodeResult.params.forEach((param, index) => {
//             console.log(`  参数${index}: ${param.type} = ${param.value}`);
//         });
//     }

//     console.log('\n=== 编码解码验证 ===');
//     // 验证编码解码的一致性
//     if (encodeResult.success) {
//         const verifyResult = codec.decodeParams('approve(address, uint256)', encodeResult.encodedData);
//         if (verifyResult.success) {
//             console.log('编码解码验证成功:');
//             verifyResult.params.forEach((param, index) => {
//                 console.log(`  参数${index}: ${param.type} = ${param.value}`);
//             });
//         }
//     }

//     console.log('\n=== 函数选择器（辅助功能）===');
//     const selectorResult = codec.getFunctionSelector('approve(address, uint256)');
//     if (selectorResult.success) {
//         console.log('函数选择器:', selectorResult.selector);
//         console.log('函数签名:', selectorResult.functionSignature);
//     }
// }

export default EthereumParamsCodec;
