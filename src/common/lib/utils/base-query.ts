import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

export const axiosBaseQuery =
	(
		{
			baseUrl,
			baseHeaders,
			baseAuth
		}: {
			baseUrl: string;
			baseHeaders?: AxiosRequestConfig['headers'];
			baseAuth?: AxiosRequestConfig['auth'];
		} = { baseUrl: '' }
	): BaseQueryFn<
		{
			url: string;
			method: AxiosRequestConfig['method'];
			data?: AxiosRequestConfig['data'];
			params?: AxiosRequestConfig['params'];
			headers?: AxiosRequestConfig['headers'];
			auth?: AxiosRequestConfig['auth'];
		},
		unknown,
		unknown
	> =>
	async ({ url, method, data, params, headers, auth }) => {
		try {
			const result = await axios({
				url: baseUrl + url,
				method,
				data,
				params,
				headers: headers || baseHeaders,
				auth: auth || baseAuth
			});
			return { data: result.data };
		} catch (axiosError) {
			let err = axiosError as AxiosError;
			return {
				error: {
					status: err.response?.status,
					data: err.response?.data || err.message
				}
			};
		}
	};
