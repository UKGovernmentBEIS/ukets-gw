import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TimedOutComponent } from './timed-out.component';
import { ActivatedRouteStub, mockClass } from '@etsgw/common/testing';
import { PageHeadingComponent } from '@etsgw/common/components';
import { AuthService } from '@etsgw/core/services/auth.service';

describe('TimedOutComponent', () => {
  let component: TimedOutComponent;
  let fixture: ComponentFixture<TimedOutComponent>;
  const authService = mockClass(AuthService);
  const activatedRoute = new ActivatedRouteStub(null, { idle: 30 });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimedOutComponent, RouterTestingModule, PageHeadingComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimedOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign in again on button click', () => {
    const loginSpy = jest.spyOn(authService, 'login');
    const button = fixture.nativeElement.querySelector('button');

    button.click();

    expect(loginSpy).toHaveBeenCalledTimes(1);
  });
});
