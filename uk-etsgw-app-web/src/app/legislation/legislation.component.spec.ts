import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislationComponent } from './legislation.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '@etsgw/common/testing';

describe('LegislationComponent', () => {
  let component: LegislationComponent;
  let fixture: ComponentFixture<LegislationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegislationComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(LegislationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
