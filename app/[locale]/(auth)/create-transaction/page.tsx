// pages/TransactionEncoderPage.tsx (or components/TransactionEncoderPage.tsx)
'use client';

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import EncodingTransactionForm from './components/EncodingTransactionForm';
import EncodingPreview from './components/EncodingPreview';
import MailboxSelection from './components/MailboxSelection';
import { useTranslations } from 'next-intl';
const TransactionEncoderPage: React.FC = () => {

    // Form States
    const [timelockType, setTimelockType] = useState('');
    const [timelockMethod, setTimelockMethod] = useState('');
    const [target, setTarget] = useState('');
    const [value, setValue] = useState('');
    const [abiValue, setAbiValue] = useState('');
    const [functionValue, setFunctionValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [arg1Value, setArg1Value] = useState('');
    const [arg2Value, setArg2Value] = useState('');
    const [selectedMailbox, setSelectedMailbox] = useState('');

    // Preview State
    const [previewContent, setPreviewContent] = useState('');

    const t = useTranslations('Transactions');

    // Effect to update preview content whenever form fields change
    useEffect(() => {
        const generatePreview = () => {
            return `chain: BSC
                wallet : 0x73823131a67782100075140A57cfFAb1421B1a40
                timelock: 0x73823131a67782100075140A57cfFAb1421B1a40
                target : ${target || '0x73823131a67782100075140A57cfFAb1421B1a40'}
                value : ${value || '0'}
                calldata: 0x73823131a67782100075140A57cfFAb1421B1a40
                time : ${timeValue || '17903210'}
                Function: ${functionValue || 'N/A'}
                arg1: ${arg1Value || 'N/A'}
                arg2: ${arg2Value || 'N/A'}`;
        };
        setPreviewContent(generatePreview());
    }, [target, value, timeValue, functionValue, arg1Value, arg2Value]);

    const handleSendTransaction = () => {
        alert('发起交易 button clicked!');
        console.log({
            timelockType, timelockMethod, target, value, abiValue,
            functionValue, timeValue, arg1Value, arg2Value, selectedMailbox,
            previewContent
        });
        // Implement actual transaction logic here
    };

    return (
        <PageLayout title={t('title')}>
            <div className="min-h-screen bg-withe p-8">
                <div className="mx-auto flex flex-col space-y-8"> {/* Main vertical stack of major blocks */}

                    {/* FIRST MAJOR BLOCK: Encoding Transaction Form (Full Width) */}
                    <EncodingTransactionForm
                        timelockType={timelockType} onTimelockTypeChange={setTimelockType}
                        timelockMethod={timelockMethod} onTimelockMethodChange={setTimelockMethod}
                        target={target} onTargetChange={setTarget}
                        value={value} onValueChange={setValue}
                        abiValue={abiValue} onAbiChange={setAbiValue}
                        functionValue={functionValue} onFunctionChange={setFunctionValue}
                        timeValue={timeValue} onTimeChange={setTimeValue}
                        arg1Value={arg1Value} onArg1Change={setArg1Value}
                        arg2Value={arg2Value} onArg2Change={setArg2Value}
                    />
                    <EncodingPreview previewContent={previewContent} />
                    <MailboxSelection
                        selectedMailbox={selectedMailbox}
                        onMailboxChange={setSelectedMailbox}
                    />

                    {/* 将按钮容器推到底部，并使按钮在容器内右对齐 */}
                    <div className="mt-auto flex justify-end">
                        <button
                            onClick={handleSendTransaction}
                            className="text-sm bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center w-[88px] h-[36px] text-sm" // 应用固定宽高，并居中文本
                        >
                            {t('sendTransactionButton')}
                        </button>
                    </div>

                </div>
            </div>
        </PageLayout>

    );
};

export default TransactionEncoderPage;