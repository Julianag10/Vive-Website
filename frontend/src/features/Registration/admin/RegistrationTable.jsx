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
        registrations: [],
      });
    }

    groups.get(key).registrations.push(registration);
  });

  return Array.from(groups.values());
}

function RegistrationRows({ registrations, onSelectRegistration }) {
  const [openNotesId, setOpenNotesId] = useState(null);
  const actualRegistrations = registrations.filter((registration) => registration.id);

  if (actualRegistrations.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan="5">No registrations for this day.</td>
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
                <button
                  type="button"
                  onClick={() => onSelectRegistration(registration)}
                >
                  Email
                </button>
                {hasNotes && (
                  <button
                    type="button"
                    onClick={() => setOpenNotesId(notesAreOpen ? null : registration.id)}
                  >
                    {notesAreOpen ? "Hide notes" : "View notes"}
                  </button>
                )}
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

export default function RegistrationTable({ registrations = [], type, onEmailRegistrant }) {
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  if (registrations.length === 0) {
    return <p>No registrations yet.</p>;
  }

  function handleSelectRegistration(registration) {
    setSelectedRegistration(registration);

    if (onEmailRegistrant) {
      onEmailRegistrant(registration);
    }
  }

  const tableHead = (
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

  if (type === "event") {
    const groups = groupEventRegistrations(registrations);

    return (
      <>
        <div className="admin-event-registration-groups">
          {groups.map((group) => {
            const registeredCount = group.registrations.filter(
              (registration) => registration.status === "registered"
            ).length;
            const waitlistedCount = group.registrations.filter(
              (registration) => registration.status === "waitlisted"
            ).length;

            return (
              <section className="admin-event-registration-group" key={group.key}>
                <div className="admin-event-registration-group-header">
                  <h3>
                    {group.date
                      ? formatDisplayDate(group.date)
                      : "Registrations without a saved event day"}
                  </h3>
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
                </div>

                <table className="admin-program-registrations-table">
                  {tableHead}
                  <RegistrationRows
                    registrations={group.registrations}
                    onSelectRegistration={handleSelectRegistration}
                  />
                </table>
              </section>
            );
          })}
        </div>

        {selectedRegistration && (
          <p>
            Selected {type} registrant: {selectedRegistration.name}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <table className="admin-program-registrations-table">
        {tableHead}
        <RegistrationRows
          registrations={registrations}
          onSelectRegistration={handleSelectRegistration}
        />
      </table>

      {selectedRegistration && (
        <p>
          Selected {type} registrant: {selectedRegistration.name}
        </p>
      )}
    </>
  );
}
