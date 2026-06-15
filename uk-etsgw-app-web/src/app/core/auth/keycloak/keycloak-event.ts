import { InjectionToken, signal, WritableSignal } from '@angular/core';

import Keycloak from 'keycloak-js';

export enum KeycloakEventType {
  AuthRefreshSuccess = 'AuthRefreshSuccess',
  AuthLogout = 'AuthLogout',
  AuthSuccess = 'AuthSuccess',
  AuthError = 'AuthError',
  AuthRefreshError = 'AuthRefreshError',
  Ready = 'Ready',
  TokenExpired = 'TokenExpired',
  ActionUpdate = 'ActionUpdate',
}

export interface KeycloakEvent {
  type: KeycloakEventType;
  args?: unknown;
}

export const KEYCLOAK_EVENT_SIGNAL = new InjectionToken<WritableSignal<KeycloakEvent>>(
  'KEYCLOAK_EVENT_SIGNAL'
);

export function createKeycloakSignal(keycloak: Keycloak): WritableSignal<KeycloakEvent> {
  const keycloakEventSignal = signal<KeycloakEvent>({ type: KeycloakEventType.Ready });

  keycloak.onAuthRefreshSuccess = () => keycloakEventSignal.set({ type: KeycloakEventType.AuthRefreshSuccess });
  keycloak.onAuthLogout = () => keycloakEventSignal.set({ type: KeycloakEventType.AuthLogout });
  keycloak.onAuthSuccess = () => keycloakEventSignal.set({ type: KeycloakEventType.AuthSuccess });
  keycloak.onAuthError = (args) => keycloakEventSignal.set({ type: KeycloakEventType.AuthError, args });
  keycloak.onAuthRefreshError = () => keycloakEventSignal.set({ type: KeycloakEventType.AuthRefreshError });
  keycloak.onReady = (args) => keycloakEventSignal.set({ type: KeycloakEventType.Ready, args });
  keycloak.onTokenExpired = () => keycloakEventSignal.set({ type: KeycloakEventType.TokenExpired });
  keycloak.onActionUpdate = (args) => keycloakEventSignal.set({ type: KeycloakEventType.ActionUpdate, args });

  return keycloakEventSignal;
}
