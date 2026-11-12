## Skip link

Use the skip link component to help keyboard-only users skip to the main content on a page.
All GOV.UK pages must include a skip link in the header.
Design details can be found at [GOV.UK Design System](https://design-system.service.gov.uk/components/skip-link/).

Following the link moves focus to the target element, mirroring the GOV.UK Frontend skip link
script, so keyboard and screen reader users continue from the main content rather than the top
of the page. The target is made programmatically focusable with `tabindex="-1"` while it has
focus and is restored once it loses focus. If the target does not exist, the link falls back to
normal browser hash navigation.

### Inputs

- `targetId` - The id of the element to skip to. Defaults to `main-content`, the id used by the
  GOV.UK page template's `main` element.
- `text` - The link text. Defaults to `Skip to main content`.

### Example

```html
<govuk-skip-link />
```

```html
<govuk-skip-link targetId="search-results" text="Skip to results" />
```
