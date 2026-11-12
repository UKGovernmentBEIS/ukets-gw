import type { Params, QueryParamsHandling } from '@angular/router';

/**
 * Describes where a GOV.UK link should navigate to.
 *
 * Use `routerLink` for navigation inside the Angular application and `href`
 * for anything that leaves it. When both are supplied `routerLink` wins.
 */
export interface GovukLinkTarget {
  /** External URL. Rendered as a plain `href`. */
  href?: string;
  /** Internal route. Rendered with `RouterLink`, so no full page reload. */
  routerLink?: string | unknown[];
  queryParams?: Params | null;
  queryParamsHandling?: QueryParamsHandling | null;
  fragment?: string;
  preserveFragment?: boolean;
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: Record<string, unknown>;
  /** `target` attribute, e.g. `_blank`. */
  target?: string;
  /** `rel` attribute. Set automatically to `noreferrer noopener` for `_blank`. */
  rel?: string;
}
