import { HYDRATE, createWrapper } from 'next-redux-wrapper';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { compassWayApi } from '~store/compass-way/email-handler';

const allReducers = combineReducers({
	[compassWayApi.reducerPath]: compassWayApi.reducer
});
// SSR
const mainReducer: typeof allReducers = (state, action) => {
	if (action.type === HYDRATE) {
		const nextState = {
			...state,
			...action.payload
		};
		return nextState;
	} else {
		return allReducers(state, action);
	}
};

const store = () => {
	return configureStore({
		devTools: process.env.NODE_ENV !== 'production',
		reducer: mainReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(compassWayApi.middleware)
	});
};
export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<typeof allReducers>;
export type AppDispatch = AppStore['dispatch'];
// SSR
export const wrapper = createWrapper<AppStore>(store);
