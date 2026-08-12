import { Fragment, useState } from "react";
import {
  formatDisplayDate,
  formatDisplayDateTime,
  formatDisplayTime,
} from "../../../utils/dateFormat";

function formatOccurrenceRange(registration) {
  const start = formatDisplayTime(registration.startTime, "");
  const end = formatDisplayTime(registration.endTime, "");

  if (start && end) return `${start} - ${end}`;
  return start || end;
}

function groupEventRegistrations(registrations) {
  const groups = new Map();

  registrations.forEach((registration) => {
    const key = registration.eventOccurrenceId || "no-occurrence";

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        date: registration.occurrenceDate,
        startTime: registration.startTime,
        endTime: registration.endTime,
        eventStartDate: registration.eventStartDate,
        eventEndDate: registration.eventEndDate,
        capacity: registration.capacity,
        registrations: [],
      });
    }

    groups.get(key).registrations.push(registration);
  });

  return Array.from(groups.values());
}

function RegistrationRows({ registrations, onSelectRegistration, emptyMessage = "No registrations found." }) {
  const [openNotesId, setOpenNotesId] = useState(null);
  const actualRegistrations = registrations.filter((registration) => registration.id);

  if (actualRegistrations.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="5">{emptyMessage}</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {actualRegistrations.map((registration) => {
        const hasNotes = Boolean(registration.notes?.trim());
        const notesAreOpen = openNotesId === registration.id;

        return (
          <Fragment key={registration.id}>
            <tr>
              <td>{registration.name}</td>
              <td>{registration.email}</td>
              <td>{formatDisplayDateTime(registration.createdAt)}</td>
              <td>{registration.status}</td>
              <td>
                <div className="admin-registration-row-actions">
                  <button
                    className="admin-registration-email-button"
                    type="button"
                    onClick={() => onSelectRegistration(registration)}
                  >
                    Email
                  </button>
                  {hasNotes && (
                    <button
                      className="admin-registration-notes-button"
                      type="button"
                      onClick={() => setOpenNotesId(notesAreOpen ? null : registration.id)}
                    >
                      {notesAreOpen ? "Hide notes" : "View notes"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
            {hasNotes && notesAreOpen && (
              <tr>
                <td colSpan="5">
                  <strong>Notes:</strong> {registration.notes}
                </td>
              </tr>
            )}
          </Fragment>
        );
      })}
    </tbody>
  );
}

function CapacityRows({ registrations, capacity, onSelectRegistration }) {
  const [openNotesId, setOpenNotesId] = useState(null);
  const actualRegistrations = registrations.filter((registration) => registration.id);
  const slotCount = Math.max(Number(capacity || 0), actualRegistrations.length);
  const slots = Array.from({ length: slotCount }, (_, index) => actualRegistrations[index] || null);

  if (slots.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="5">No capacity spots configured.</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {slots.map((registration, index) => {
        if (!registration) {
          return (
            <tr className="admin-registration-empty-slot" key={`empty-${index}`}>
              <td>Spot {index + 1}</td>
              <td colSpan="4">Available</td>
            </tr>
          );
        }

        const hasNotes = Boolean(registration.notes?.trim());
        const notesAreOpen = openNotesId === registration.id;

        return (
          <Fragment key={registration.id}>
            <tr>
              <td>Spot {index + 1}</td>
              <td>{registration.name}</td>
              <td>{registration.email}</td>
              <td>{formatDisplayDateTime(registration.createdAt)}</td>
              <td>
                <div className="admin-registration-row-actions">
                  <button
                    className="admin-registration-email-button"
                    type="button"
                    onClick={() => onSelectRegistration(registration)}
                  >
                    Email
                  </button>
                  {hasNotes && (
                    <button
                      className="admin-registration-notes-button"
                      type="button"
                      onClick={() => setOpenNotesId(notesAreOpen ? null : registration.id)}
                    >
                      {notesAreOpen ? "Hide notes" : "View notes"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
            {hasNotes && notesAreOpen && (
              <tr>
                <td colSpan="5">
                  <strong>Notes:</strong> {registration.notes}
                </td>
              </tr>
            )}
          </Fragment>
        );
      })}
    </tbody>
  );
}

function RegistrationSection({
  title,
  registrations,
  capacity = null,
  showCapacitySlots = false,
  onSelectRegistration,
  emptyMessage,
}) {
  const actualRegistrations = registrations.filter((registration) => registration.id);
  const capacityNumber = capacity === null || capacity === undefined ? null : Number(capacity);
  const remaining = capacityNumber === null ? null : Math.max(capacityNumber - actualRegistrations.length, 0);
  const tableHead = showCapacitySlots ? (
    <thead>
      <tr>
        <th>Spot</th>
        <th>Name</th>
        <th>Email</th>
        <th>Registered At</th>
        <th>Actions</th>
      </tr>
    </thead>
  ) : (
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Registered At</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );

  return (
    <section className="admin-registration-status-section">
      <div className="admin-registration-status-heading">
        <h4>{title}</h4>
        {capacityNumber !== null ? (
          <p>
            {actualRegistrations.length} of {capacityNumber} filled
            {remaining > 0 ? `, ${remaining} spots left` : ""}
          </p>
        ) : (
          <p>{actualRegistrations.length} total</p>
        )}
      </div>

      <table className="admin-program-registrations-table">
        {tableHead}
        {showCapacitySlots ? (
          <CapacityRows
            capacity={capacityNumber}
            registrations={actualRegistrations}
            onSelectRegistration={onSelectRegistration}
          />
        ) : (
          <RegistrationRows
            emptyMessage={emptyMessage}
            registrations={actualRegistrations}
            onSelectRegistration={onSelectRegistration}
          />
        )}
      </table>
    </section>
  );
}

export default function RegistrationTable({ registrations = [], type, capacity = null, onEmailRegistrant }) {
  function getRegisteredEmailCount(registrationList) {
    return new Set(
      registrationList
        .filter(
          (registration) =>
            registration.id &&
            registration.status === "registered" &&
            registration.email
        )
        .map((registration) => registration.email.toLowerCase())
    ).size;
  }

  function handleSelectRegistration(registration) {
    if (onEmailRegistrant) {
      onEmailRegistrant({ kind: "single", registration });
    }
  }

  if (type === "event") {
    const groups = groupEventRegistrations(registrations);

    if (groups.length === 0) {
      return <p>No registrations yet.</p>;
    }

    return (
      <>
        <div className="admin-event-registration-groups">
          {groups.map((group) => {
            const registeredCount = group.registrations.filter(
              (registration) => registration.status === "registered"
            ).length;
            const registeredEmailCount = getRegisteredEmailCount(group.registrations);
            const waitlistedCount = group.registrations.filter(
              (registration) => registration.status === "waitlisted"
            ).length;
            const groupTitle = group.date
              ? formatDisplayDate(group.date)
              : "Registrations without a saved event day";

            return (
              <section className="admin-event-registration-group" key={group.key}>
                <div className="admin-event-registration-group-header">
                  <h3>{groupTitle}</h3>
                  {!group.date && formatDisplayDate(group.eventStartDate, "") && (
                    <p>Event starts {formatDisplayDate(group.eventStartDate, "")}</p>
                  )}
                  {formatOccurrenceRange(group) && (
                    <p>{formatOccurrenceRange(group)}</p>
                  )}
                  <p>
                    {registeredCount} registered
                    {waitlistedCount > 0 ? `, ${waitlistedCount} waitlisted` : ""}
                  </p>
                  {group.key !== "no-occurrence" && (
                    <button
                      className="admin-registration-email-day-button"
                      disabled={registeredEmailCount === 0}
                      onClick={() =>
                        onEmailRegistrant?.({
                          kind: "event-day",
                          occurrenceId: group.key,
                          recipientCount: registeredEmailCount,
                          title: groupTitle,
                        })
                      }
                      type="button"
                    >
                      Email All For This Day
                    </button>
                  )}
                </div>

                <div className="admin-registration-split-sections">
                  <RegistrationSection
                    capacity={group.capacity}
                    emptyMessage="No registered people for this day."
                    registrations={group.registrations.filter((registration) => registration.status === "registered")}
                    showCapacitySlots={group.capacity !== null && group.capacity !== undefined}
                    title="Registered"
                    onSelectRegistration={handleSelectRegistration}
                  />
                  <RegistrationSection
                    emptyMessage="No waitlisted people for this day."
                    registrations={group.registrations.filter((registration) => registration.status === "waitlisted")}
                    title="Waitlisted"
                    onSelectRegistration={handleSelectRegistration}
                  />
                </div>
              </section>
            );
          })}
        </div>
      </>
    );
  }

  const registeredRegistrations = registrations.filter(
    (registration) => registration.status === "registered"
  );
  const waitlistedRegistrations = registrations.filter(
    (registration) => registration.status === "waitlisted"
  );

  return (
    <>
      <div className="admin-registration-split-sections">
        <RegistrationSection
          capacity={capacity}
          emptyMessage="No registered people yet."
          registrations={registeredRegistrations}
          showCapacitySlots={capacity !== null && capacity !== undefined}
          title="Registered"
          onSelectRegistration={handleSelectRegistration}
        />
        <RegistrationSection
          emptyMessage="No waitlisted people yet."
          registrations={waitlistedRegistrations}
          title="Waitlisted"
          onSelectRegistration={handleSelectRegistration}
        />
      </div>
    </>
  );
}
