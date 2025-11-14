import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeadingComponent } from '@etsgw/common/components';
import { LinkDirective } from '@etsgw/govuk-components';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'etsgw-page-not-found',
  standalone: true,
  template: `
    <etsgw-page-heading size="xl">Page Not Found</etsgw-page-heading>
    <p class="govuk-body">If you typed the web address, check it is correct.</p>
    <p class="govuk-body">
      If you pasted the web address, check you copied the entire address.
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent, LinkDirective, RouterLink],
})
export class PageNotFoundComponent {}
