import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigStore } from '@etsgw/core/config/config.store';

import { environment } from '../../environments/environment';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let configStore: ConfigStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    configStore = TestBed.inject(ConfigStore);
    configStore.setState({
      ...configStore.state,
      features: { installationAviationEnabled: true, maritimeEnabled: true },
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render separate Installations and Aviation links carrying a domain hint', () => {
    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    const hrefOf = (text: string) => links.find((link) => link.textContent.trim() === text)?.getAttribute('href');

    expect(hrefOf('Manage your UK ETS reporting - Installations')).toBe(
      `${environment.appUrls.pmrv}landing?domain=INSTALLATION`,
    );
    expect(hrefOf('Manage your UK ETS reporting - Aviation')).toBe(
      `${environment.appUrls.pmrv}landing?domain=AVIATION`,
    );
  });
});
