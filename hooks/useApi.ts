'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/userStore';
import type { ApiRequestOptions, UseApiReturn, ApiResponse } from '@/types';
import { useRouter } from 'next/navigation';

export function useApi(): UseApiReturn {
	const [data, setData] = useState<ApiResponse | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const accessToken = useAuthStore(state => state.accessToken);

	const request = useCallback(
		async (url: string, body?: object, options: ApiRequestOptions = {}) => {
			setIsLoading(true);
			setError(null);

			const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			const fullUrl = `${baseUrl}${url}`;

			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
				...options.headers,
			};

			if (url !== '/api/v1/auth/wallet-connect' && accessToken) {
				headers['Authorization'] = `Bearer ${accessToken}`;
			}

			try {
				const { data } = await axios.request({
					url: fullUrl,
					method: 'POST',
					headers: headers,
					data: body,
					...options,
				});

				setData(data);
				setIsLoading(false);

				return data;
			} catch (error: unknown) {
				if (error.response?.status === 401) {
					router.push('/login');
					return;
				}
				alert('Error:\n' + `URL: ${fullUrl}\n` + `Headers: ${JSON.stringify(headers, null, 2)}\n` + `Body: ${JSON.stringify(body, null, 2)}\n` + `Error: ${error.message}`);
				setError(error);
				throw error;
			}
		},
		[accessToken]
	);

	return { data, error, isLoading, request };
}
