import { Component } from '@angular/core';
import { BackToTopComponent, PageHeadingComponent } from '@etsgw/common/components';

@Component({
  selector: 'etsgw-legislation',
  standalone: true,
  imports: [PageHeadingComponent, BackToTopComponent],
  templateUrl: './legislation.component.html',
})
export class LegislationComponent {}
