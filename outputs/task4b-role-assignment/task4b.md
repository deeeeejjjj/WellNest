# Task 4B: Accessibility Review (Claude)

Reviewed files: `outputs/task4a-few-shot/index.html`, `style.css`, `script.js`

## Findings

1. **Focus indicator has low contrast (visual clarity / keyboard access).** `style.css` uses `outline: 3px solid #ffb703` for `:focus-visible`. Yellow-orange on the white cards and light page background is hard to see, so keyboard users may lose track of the focused control.
2. **Dynamic changes are not announced (screen reader support).** Changing the library topic filter replaces the cards without any status message, and ticking checklist items gives no summary such as "2 of 6 completed." Only the tracker has a live status region.
3. **Related controls are not grouped (HTML semantics).** The checklist and the goal/value input pairs are separate controls without a `fieldset`/`legend`, so a screen reader user hears each control without the group's purpose.
4. **Checklist label text is long (labels).** Each checkbox label includes the item, category, and description, so it is read in full each time. This is acceptable but could be shortened by moving the description into `aria-describedby`.
5. **Number inputs rely on native validation (labels / feedback).** Out-of-range values are blocked by the browser, but WellNest shows no custom error text.

## Positive observations
- Landmarks (`header`, `nav`, `main`, `section`, `footer`) and a skip link are present.
- Every input has a visible `<label>` linked by `for`/`id`; native checkboxes are used.
- The reminder alert uses `role="alert"`; the tracker status uses `role="status"`.
