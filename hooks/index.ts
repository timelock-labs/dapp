/**
 * Hook utilities barrel export
 * Central export point for all hook utilities and patterns
 */

// Common hook utilities
export * from './useCommonHooks';
export * from './useHookUtils';
export * from './useValidationUtils';
export * from './useAsyncUtils';

// API-related hooks
export * from './useApiBase';
export * from './useApiPatterns';

// Form-related hooks
export * from './useFormHooks';

// Blockchain-related hooks
export * from './useBlockchainHooks';
export * from './useWeb3Utils';
export * from './useWeb3ErrorHandler';

// Domain-specific hooks
export * from './useTimelockApi';
export * from './useTransactionApi';
export * from './useNotificationApi';

// Re-export commonly used hooks for convenience
export {
	useLoadingState,
	useAsyncOperation,
	useLocalStorage,
	useDebounce,
	usePrevious,
	useToggle,
	useCounter,
	useArray,
	useClipboard,
	useMediaQuery,
	useWindowSize,
	useDocumentTitle,
	useInterval,
	useTimeout,
} from './useCommonHooks';

export { useIsMobile, useIsTablet, useIsDesktop, useDeviceType, useResponsiveValue, useIsTouchDevice } from './useMobile';

export { useApiBase, useApiMutation, usePaginatedApi, useFilteredApi } from './useApiBase';

export { useForm, useFieldValidation, useFormArray, useMultiStepForm, useFormPersistence } from './useFormHooks';

export {
	useWalletConnection,
	useContractDeployment,
	useTransactionSender,
	useContractValidation,
	useContractInteraction,
	useGasEstimation,
	useAddressUtils,
} from './useBlockchainHooks';

export { useWeb3Utils } from './useWeb3Utils';

export { useWeb3ErrorHandler } from './useWeb3ErrorHandler';

export { useCrudOperations, usePaginatedList, useBatchOperations, useSearch, useFileUpload, useDataExport } from './useApiPatterns';

export { useValidation, useZodSchemas, useAsyncValidation, ValidationPatterns, ValidationMessages } from './useValidationUtils';

export { useStandardizedAsync, useConcurrentAsync, useDebouncedAsync } from './useAsyncUtils';
