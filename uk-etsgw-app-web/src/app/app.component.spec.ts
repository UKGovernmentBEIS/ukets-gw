import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { mockClass } from '@etsgw/common/testing';
import { AuthService } from '@etsgw/core/services/auth.service';
import { AuthStore } from '@etsgw/core/auth';
import { screen } from '@testing-library/angular';
import { ETSGW_AUTH_SERVICE } from './auth.config';
import { KeycloakEvent, KeycloakService } from 'keycloak-angular';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let store: AuthStore;
  let fixture: ComponentFixture<AppComponent>;
  const authService = mockClass(AuthService);
  const etsgwService: Partial<KeycloakService> = {
    keycloakEvents$: new Subject<KeycloakEvent>(),
    getKeycloakInstance: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ETSGW_AUTH_SERVICE, useValue: etsgwService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    store = TestBed.inject(AuthStore);
    store.setIsLoggedIn(false);
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should display sign out link when user is logged in', () => {
    store.setIsLoggedIn(true);
    fixture.detectChanges();
    const signOutLink = screen.getByRole('link', { name: /Sign out/i });
    expect(signOutLink).toBeVisible();
  });
});
