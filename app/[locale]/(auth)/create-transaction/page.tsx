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
import { useAuthStore } from '@/store/userStore';
import { toast } from 'sonner';
const TransactionEncoderPage: React.FC = () => {
    const router = useRouter();
    const t = useTranslations('CreateTransaction');
    const { createTransaction } = useTransactionApi();
    const account = useActiveAccount();
    const chain = useActiveWalletChain();
    const { allTimelocks } = useAuthStore();

    // Form States
    const [timelockType, setTimelockType] = useState('');
    const [timelockMethod, setTimelockMethod] = useState('');
    const [timelockAddress, setTimelockAddress] = useState('');
    const [target, setTarget] = useState('');
    const [value, setValue] = useState('');
    const [abiValue, setAbiValue] = useState('');
    const [functionValue, setFunctionValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [argumentValues, setArgumentValues] = useState<string[]>([]);
    const [selectedMailbox, setSelectedMailbox] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Preview State
    const [previewContent, setPreviewContent] = useState('');

    // Handle argument changes
    const handleArgumentChange = (index: number, value: string) => {
        const newArgumentValues = [...argumentValues];
        newArgumentValues[index] = value;
        setArgumentValues(newArgumentValues);
    };

    // Handle function changes and clear arguments
    const handleFunctionChange = (value: string) => {
        setFunctionValue(value);
        setArgumentValues([]); // Clear all argument values when function changes
    };

    // Handle ABI changes and clear arguments and function
    const handleAbiChange = (value: string) => {
        setAbiValue(value);
        setFunctionValue(''); // Clear selected function when ABI changes
        setArgumentValues([]); // Clear all argument values when ABI changes
    };

    // Effect to update preview content whenever form fields change
    useEffect(() => {
        const generatePreview = () => {
            // Get selected timelock's chain name
            const selectedTimelock = allTimelocks.find((tl) => tl.id.toString() === timelockType);
            const chainName = selectedTimelock?.chain_name || 'Not selected';
            
            const argsDisplay = argumentValues.length > 0 
                ? argumentValues.map((arg, index) => `arg${index + 1}: ${arg || 'N/A'}`).join('\n')
                : 'No arguments';
                
            return `chain: ${chainName}
 wallet: ${account?.address || 'Not connected'}
 timelock: ${timelockAddress || 'Not selected'}
 target: ${target || 'Not specified'}
 value: ${value || '0'}
 calldata: ${abiValue || 'Not generated'}
 time: ${timeValue || 'Not specified'}
 Function: ${functionValue || 'Not selected'}
 ${argsDisplay}`;
        };
        setPreviewContent(generatePreview());
    }, [target, value, timeValue, functionValue, argumentValues, account, timelockAddress, abiValue, timelockType, allTimelocks]);

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
                        abiValue={abiValue} onAbiChange={handleAbiChange}
                        functionValue={functionValue} onFunctionChange={handleFunctionChange}
                        timeValue={timeValue} onTimeChange={setTimeValue}
                        argumentValues={argumentValues} onArgumentChange={handleArgumentChange}
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