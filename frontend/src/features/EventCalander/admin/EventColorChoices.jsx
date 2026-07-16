const EVENT_COLOR_CHOICES = [
  "#f0c15d",
  "#0d7f71",
  "#2f80ed",
  "#9b51e0",
  "#eb5757",
  "#f2994a",
  "#27ae60",
  "#56ccf2",
  "#bb6bd9",
  "#6fcf97",
];

export default function EventColorChoices({ value, onChange }) {
  return (
    <fieldset className="event-color-choices">
      <legend>Event Color</legend>
      <div className="event-color-choice-grid">
        {EVENT_COLOR_CHOICES.map((color) => (
          <button
            aria-label={`Use event color ${color}`}
            aria-pressed={value === color}
            className={`event-color-choice ${value === color ? "is-selected" : ""}`}
            key={color}
            onClick={() => onChange(color)}
            style={{ backgroundColor: color }}
            type="button"
          />
        ))}
      </div>
    </fieldset>
  );
}
