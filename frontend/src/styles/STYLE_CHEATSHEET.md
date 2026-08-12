# ViVe Styling Cheatsheet

Use these reusable classes for new UI. Existing classes are also mapped into this system, so old forms/buttons keep working while new code can be cleaner.

## Colors

- Lime: `#c0d969`
- Blue: `#3c88f4`
- Use tokens in CSS: `var(--brand-lime)`, `var(--brand-blue)`, `var(--brand-blue-dark)`.

## Page And Panels

- `page-shell`: page/card container with padding, border, radius, background, shadow.
- `section-stack`: vertical section layout.
- `panel`: boxed content section.
- `card-shell`: repeated card item.

Example:

```jsx
<section className="page-shell">
  <div className="section-stack">
    <h1>Page Title</h1>
    <p>Content.</p>
  </div>
</section>
```

## Buttons

Use `btn` plus one variant:

- `btn btn-primary`: main action. Public/admin use the same shape, with site-aware colors.
- `btn btn-secondary`: alternate action.
- `btn btn-tertiary`: quiet action.

Example:

```jsx
<button className="btn btn-primary" type="submit">Save</button>
<a className="btn btn-secondary" href="/donate">Donate</a>
<button className="btn btn-tertiary" type="button">Cancel</button>
```

Existing classes mapped into the button system include:

- Public: `learnmore-btn`, `register-btn`, `aboutus-btn`, `donate-btn`, `volunteer-btn`, `nav-donate-button`, `footer-donate-button`, `donation-submit`, `donation-rewards-button`, `register-another-person-btn`, `already-registered-btn`.
- Admin: `admin-create-event-button`, `admin-program-card-action`, `admin-program-card-action--edit`, `admin-program-card-action--toggle`, admin modal buttons, event occurrence buttons.

## Forms

Use:

- `form-shell`: form container panel.
- `form-grid`: two-column form layout.
- `form-stack`: one-column form layout.
- `field`: label/input grouping.
- `field-full`: makes one field span both columns.
- `required-mark`: red asterisk.

Example:

```jsx
<form className="form-shell form-grid">
  <label className="field">
    <span>Name <span className="required-mark">*</span></span>
    <input name="name" required />
  </label>

  <label className="field field-full">
    Notes
    <textarea name="notes" />
  </label>

  <button className="btn btn-primary" type="submit">Submit</button>
</form>
```

Existing forms mapped into the form system include:

- Public: `registration-form`, `contact-form`, `donation-form`, `registration-lookup-panel`, `stripe-like-input`.
- Admin: `create-program-form`, `admin-event-modal form`, `admin-edit-modal form`, `admin-login form`.

## File Organization

- `design-system.css`: fonts, tokens, reusable classes.
- `public-global.css`: public-site button/form mappings and public color behavior.
- `admin-global.css`: admin-site button/form mappings and admin color behavior.
- Page-specific files like `donate.css`, `contact.css`, `programs.css`: page layout and component-specific rules only.
- `App.css`: legacy global/page styles still being migrated. Avoid adding new page styles there.
