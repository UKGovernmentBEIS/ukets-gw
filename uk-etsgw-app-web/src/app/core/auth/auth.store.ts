import { Injectable } from '@angular/core';

import { UserDTO } from '@etsgw/api';
import { produce } from 'immer';

import { AuthState, initialState } from './auth.state';
import { SignalStore } from '../store/signal-store';

@Injectable({ providedIn: 'root' })
export class AuthStore extends SignalStore<AuthState> {
  constructor() {
    super(initialState);
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.setState(
      produce(this.state, (state) => {
        state.isLoggedIn = isLoggedIn;
      })
    );
  }

  setUser(user: UserDTO) {
    this.setState(
      produce(this.state, (state) => {
        state.user = user;
      })
    );
  }

  setUserProfile(userProfile: object) {
    this.setState(
      produce(this.state, (state) => {
        state.userProfile = userProfile;
      })
    );
  }

  reset(): void {
    this.setState(initialState);
  }
}
