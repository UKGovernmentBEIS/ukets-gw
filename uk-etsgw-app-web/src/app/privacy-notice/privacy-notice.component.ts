import { Component } from '@angular/core';
import { BackToTopComponent, PageHeadingComponent } from '@etsgw/common/components';
import { InsetTextDirective, LinkDirective } from '@etsgw/govuk-components';

@Component({
  selector: 'etsgw-privacy-notice',
  standalone: true,
  imports: [PageHeadingComponent, InsetTextDirective, BackToTopComponent, LinkDirective],
  templateUrl: './privacy-notice.component.html',
})
export class PrivacyNoticeComponent {}
