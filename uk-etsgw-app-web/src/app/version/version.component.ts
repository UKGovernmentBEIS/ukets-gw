import { ChangeDetectionStrategy, Component } from '@angular/core';

import { VERSION } from '../../environments/version';
import { PageHeadingComponent } from '@etsgw/common/components';
import { ButtonDirective } from '@etsgw/govuk-components';

@Component({
  selector: 'etsgw-version',
  standalone: true,
  template: `
    <etsgw-page-heading
      caption="Information about the application version"
      size="l"
      >About</etsgw-page-heading
    >
    <p class="govuk-body">
      Version: <span class="govuk-!-font-weight-bold">RELEASE_VERSION</span>
    </p>
    <p class="govuk-body">
      Commit hash:
      <span class="govuk-!-font-weight-bold">{{ version.hash }}</span>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, ButtonDirective],
})
export class VersionComponent {
  version = VERSION;
}
