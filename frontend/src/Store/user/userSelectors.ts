import { UserState } from './userTypes';
import { RootState } from '../store';

export const getUser = (state: RootState): UserState => state.auth;
