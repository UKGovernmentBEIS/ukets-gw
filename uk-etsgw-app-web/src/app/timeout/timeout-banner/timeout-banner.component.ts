import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

import dialogPolyfill from 'dialog-polyfill';

import { TimeoutBannerService } from './timeout-banner.service';
import { PageHeadingComponent } from '@etsgw/common/components';
import { ButtonDirective } from '@etsgw/govuk-components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SecondsToMinutesPipe } from '@etsgw/common/pipes/seconds-to-minutes.pipe';

@Component({
  selector: 'etsgw-timeout-banner',
  standalone: true,
  templateUrl: './timeout-banner.component.html',
  styleUrl: './timeout-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeadingComponent,
    AsyncPipe,
    SecondsToMinutesPipe,
    ButtonDirective,
    NgIf,
  ],
})
export class TimeoutBannerComponent implements OnInit, AfterViewInit {
  @Input() timeOffsetSeconds: number;
  @ViewChild('modal') readonly modal: ElementRef<HTMLDialogElement>;

  private overlayClass = 'govuk-timeout-warning-overlay';
  private lastFocusedElement = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    readonly timeoutBannerService: TimeoutBannerService,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.timeoutBannerService.isVisible$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isVisible) => {
        isVisible ? this.showDialog() : this.hideDialog();
      });
  }

  ngAfterViewInit(): void {
    dialogPolyfill.registerDialog(this.modal.nativeElement);
  }

  isDialogOpen(): boolean {
    return this.modal && this.modal.nativeElement.getAttribute('open') === '';
  }

  showDialog(): void {
    if (!this.isDialogOpen()) {
      this.renderer.addClass(this.document.body, this.overlayClass);
      this.saveLastFocusedElement();
      (<any>this.modal.nativeElement).showModal();
      this.modal.nativeElement.setAttribute('tabindex', '-1');
      this.modal.nativeElement.focus();
    }
  }

  hideDialog(): void {
    if (this.isDialogOpen()) {
      this.renderer.removeClass(this.document.body, this.overlayClass);
      this.modal.nativeElement.removeAttribute('tabindex');
      (<any>this.modal.nativeElement).close();
      this.setFocusOnLastFocusedElement();
    }
  }

  saveLastFocusedElement(): void {
    this.lastFocusedElement =
      this.document.activeElement &&
      this.document.activeElement !== this.document.body
        ? this.document.activeElement
        : this.document.querySelector(':focus');
  }

  setFocusOnLastFocusedElement(): void {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  continue(): void {
    this.timeoutBannerService.extendSession();
  }

  signOut(): void {
    this.timeoutBannerService.signOut();
  }
}
