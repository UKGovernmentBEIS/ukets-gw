import type { GovukLinkTarget } from './link-target.type';

/** A link rendered as list item text. */
export interface GovukLinkItem extends GovukLinkTarget {
  text: string;
  classes?: string;
  /** Extra context announced to assistive technology only. */
  visuallyHiddenText?: string;
}
