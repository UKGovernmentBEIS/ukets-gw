import { Component } from '@angular/core';
import { BackToTopComponent, PageHeadingComponent } from '@etsgw/common/components';
import { BreadcrumbsComponent, LinkDirective } from '@etsgw/govuk-components';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'etsgw-accessibility',
  standalone: true,
  imports: [PageHeadingComponent, LinkDirective, BackToTopComponent, BreadcrumbsComponent, RouterLink],
  templateUrl: './accessibility.component.html',
})
export class AccessibilityComponent {}
