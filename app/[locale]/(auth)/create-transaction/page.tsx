'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import EncodingTransactionForm from './components/EncodingTransactionForm';
import EncodingPreview from './components/EncodingPreview';
import MailboxSelection from './components/MailboxSelection';
import { useTranslations } from 'next-intl';
import { useTransactionApi, CreateTransactionRequest } from '@/hooks/useTransactionApi';
import { useActiveAccount, useActiveWalletChain } from 'thirdweb/react';
import { toast } from 'sonner';
const TransactionEncoderPage: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('CreateTransaction');
    const { createTransaction } = useTransactionApi();
    const account = useActiveAccount();
    const chain = useActiveWalletChain();

    // Form States
    const [timelockType, setTimelockType] = useState('');
    const [timelockMethod, setTimelockMethod] = useState('');
    const [timelockAddress, setTimelockAddress] = useState('');
    const [target, setTarget] = useState('');
    const [value, setValue] = useState('');
    const [abiValue, setAbiValue] = useState('');
    const [functionValue, setFunctionValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [arg1Value, setArg1Value] = useState('');
    const [arg2Value, setArg2Value] = useState('');
    const [selectedMailbox, setSelectedMailbox] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Preview State
    const [previewContent, setPreviewContent] = useState('');

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

    const handleSendTransaction = async () => {
        if (!account?.address) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!chain?.id) {
            toast.error('Please select a network');
            return;
        }

        // Validate required fields
        if (!timelockAddress || !target || !functionValue || !timeValue) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            // Prepare transaction data
            const transactionData: CreateTransactionRequest = {
                chain_id: chain.id,
                chain_name: chain.name || 'Unknown',
                description: description || `Transaction to ${target}`,
                eta: parseInt(timeValue) || 0,
                function_sig: functionValue,
                operation_id: `${Date.now()}-${account.address}`, // Generate unique operation ID
                target: target,
                timelock_address: timelockAddress,
                timelock_standard: timelockType === 'compound' ? 'compound' : 'openzeppelin',
                tx_data: abiValue || '0x',
                tx_hash: '', // Will be set when transaction is submitted to blockchain
                value: value || '0',
            };

            const result = await createTransaction(transactionData);
            
            toast.success('Transaction created successfully!');
            console.log('Transaction created:', result);
            
            // Navigate to transaction details or list
            router.push('/transactions');
        } catch (error: any) {
            console.error('Failed to create transaction:', error);
            toast.error(error.message || 'Failed to create transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageLayout title={t('title')}>
            <div className="min-h-screen bg-withe p-8">
                <div className="mx-auto flex flex-col space-y-8"> {/* Main vertical stack of major blocks */}

                    {/* FIRST MAJOR BLOCK: Encoding Transaction Form (Full Width) */}
                    <EncodingTransactionForm
                        timelockType={timelockType} onTimelockTypeChange={setTimelockType}
                        timelockMethod={timelockMethod} onTimelockMethodChange={setTimelockMethod}
                        onTimelockAddressChange={setTimelockAddress}
                        target={target} onTargetChange={setTarget}
                        value={value} onValueChange={setValue}
                        abiValue={abiValue} onAbiChange={setAbiValue}
                        functionValue={functionValue} onFunctionChange={setFunctionValue}
                        timeValue={timeValue} onTimeChange={setTimeValue}
                        arg1Value={arg1Value} onArg1Change={setArg1Value}
                        arg2Value={arg2Value} onArg2Change={setArg2Value}
                        description={description} onDescriptionChange={setDescription}
                    />
                    <EncodingPreview previewContent={previewContent} />
                    <MailboxSelection
                        selectedMailbox={selectedMailbox}
                        onMailboxChange={setSelectedMailbox}
                    />

                    {/* Submit button container */}
                    <div className="mt-auto flex justify-end">
                        <button
                            type="button"
                            onClick={handleSendTransaction}
                            disabled={isSubmitting}
                            className="text-sm bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center h-[36px] text-sm disabled:opacity-50 disabled:cursor-not-allowed px-4"
                        >
                            {isSubmitting ? t('submitting') : t('sendTransactionButton')}
                        </button>
                    </div>

                </div>
            </div>
        </PageLayout>

    );
};

export default TransactionEncoderPage;