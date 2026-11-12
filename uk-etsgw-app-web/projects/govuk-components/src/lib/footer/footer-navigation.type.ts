import type { GovukLinkItem } from '../types/link-item.type';

/** A column of links in the footer. */
export interface GovukFooterNavigation {
  title: string;
  items: GovukLinkItem[];
  /** Grid width, e.g. `two-thirds`. Defaults to `full`. */
  width?: string;
  /** Splits the list over this many columns. */
  columns?: 1 | 2 | 3;
}
