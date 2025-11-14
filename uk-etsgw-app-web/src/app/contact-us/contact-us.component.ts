import { Component } from '@angular/core';
import { PageHeadingComponent } from '@etsgw/common/components';
import { LinkDirective } from '@etsgw/govuk-components';

@Component({
  selector: 'etsgw-contact-us',
  standalone: true,
  imports: [PageHeadingComponent, LinkDirective],
  templateUrl: './contact-us.component.html',
})
export class ContactUsComponent {}
