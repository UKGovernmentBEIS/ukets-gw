import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthStore, selectUserProfile } from '@etsgw/core/auth';
import { PhaseBannerComponent } from '@etsgw/govuk-components';

import { AppService } from '../../../app.service';

@Component({
  selector: 'etsgw-phase-bar',
  imports: [PhaseBannerComponent],
  standalone: true,
  template: `
    <govuk-phase-banner borderTop phase="Beta">
      @if (appService.showPhaseLogin()) {
        @if (userProfile(); as user) {
          <span class="logged-in-user float-right">
            You are signed in as
            <span class="govuk-!-font-weight-bold">{{ user.firstName }} {{ user.lastName }}</span>
          </span>
        }
      }
    </govuk-phase-banner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBarComponent {
  private readonly authStore = inject(AuthStore);
  protected readonly appService = inject(AppService);

  userProfile = this.authStore.select(selectUserProfile);
}
