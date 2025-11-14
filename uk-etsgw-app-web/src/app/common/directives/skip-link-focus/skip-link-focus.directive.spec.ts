import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SkipLinkFocusDirective } from './skip-link-focus.directive';
import { RouterStubComponent } from '@etsgw/common/testing';
import { SkipLinkComponent } from '@etsgw/govuk-components';

describe('SkipLinkFocusDirective', () => {
  @Component({
    standalone: true,
    template:
      '<govuk-skip-link></govuk-skip-link><router-outlet etsgwSkipLinkFocus></router-outlet>',
    imports: [SkipLinkFocusDirective, SkipLinkComponent, RouterOutlet],
  })
  class TestComponent {}

  let directive: SkipLinkFocusDirective;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [
        TestComponent,
        RouterStubComponent,
        RouterTestingModule.withRoutes([
          { path: 'test', component: TestComponent },
        ]),
        SkipLinkComponent,
      ],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    directive = fixture.debugElement
      .query(By.directive(SkipLinkFocusDirective))
      .injector.get(SkipLinkFocusDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should focus to skip link after navigation', async () => {
    expect(document.activeElement).toEqual(document.body);

    await TestBed.inject(Router).navigate(['test']);
    expect(fixture.nativeElement.querySelector('govuk-skip-link')).toEqual(
      document.activeElement
    );
  });
});
