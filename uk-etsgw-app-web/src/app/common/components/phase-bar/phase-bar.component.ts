import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { AuthStore, selectUserProfile } from '@etsgw/core/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LinkDirective, PhaseBannerComponent } from '@etsgw/govuk-components';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

/* eslint-disable @angular-eslint/use-component-view-encapsulation */
@Component({
  selector: 'etsgw-phase-bar',
  standalone: true,
  template: `
    <govuk-phase-banner phase="BETA">
      <span
        *ngIf="userProfile$ | async as user"
        class="logged-in-user float-right"
      >
        You are logged in as:
        <span class="govuk-!-font-weight-bold"
          >{{ user.firstName }} {{ user.lastName }}</span
        >
      </span>
    </govuk-phase-banner>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhaseBannerComponent, NgIf, LinkDirective, RouterLink, AsyncPipe],
})
export class PhaseBarComponent {
  userProfile$ = this.authStore
    .rxSelect(selectUserProfile)
    .pipe(takeUntilDestroyed(inject(DestroyRef)));

  constructor(private readonly authStore: AuthStore) {}
}
