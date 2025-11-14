import { UserDTO } from '@etsgw/api';

import { AuthState } from './auth.state';
import { createSelector, StateSelector } from '../store/signal-store';
import { KeycloakProfile } from 'keycloak-js';

export const selectUserProfile: StateSelector<AuthState, KeycloakProfile> =
  createSelector((state) => state.userProfile);
export const selectIsLoggedIn: StateSelector<AuthState, boolean> =
  createSelector((state) => state.isLoggedIn);
export const selectUser: StateSelector<AuthState, UserDTO> = createSelector(
  (state) => state.user
);
