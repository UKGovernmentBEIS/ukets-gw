import { UserDTO } from '@etsgw/api';
import { KeycloakProfile } from 'keycloak-js';

export interface AuthState {
  user: UserDTO;
  userProfile: KeycloakProfile;
  isLoggedIn: boolean;
}

export const initialState: AuthState = {
  user: null,
  userProfile: null,
  isLoggedIn: null,
};
