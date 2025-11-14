import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeadingComponent } from '@etsgw/common/components';
import { SecondsToMinutesPipe } from '@etsgw/common/pipes/seconds-to-minutes.pipe';
import { LinkDirective } from '@etsgw/govuk-components';
import { AuthService } from '@etsgw/core/services/auth.service';

@Component({
  selector: 'etsgw-timed-out',
  standalone: true,
  template: `
    <etsgw-page-heading size="xl"
      >Your session has timed out</etsgw-page-heading
    >
    <p class="govuk-body">
      We have reset your session because it expired. We did this to keep your
      information secure.
    </p>

    <button type="button" class="govuk-button" (click)="onSignInAgain()">
      Sign in again
    </button>

    <p class="govuk-body">
      If you don't want to start again, you can
      <a govukLink href="https://www.gov.uk/">return to GOV.UK</a>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeadingComponent,
    AsyncPipe,
    SecondsToMinutesPipe,
    NgIf,
    LinkDirective,
  ],
})
export class TimedOutComponent {
  constructor(private readonly authService: AuthService) {}

  async onSignInAgain() {
    await this.authService.login('etsgw');
  }
}
