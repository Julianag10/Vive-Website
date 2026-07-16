import { useEffect, useMemo, useState } from "react";
import EventService from "../../features/EventCalander/EventService";
import RegistrationService from "../../features/Registration/RegistrationService";
import { getPrograms } from "../../features/Programs/ProgramService";
import {
  formatDisplayDate,
  formatDisplayDateTime,
} from "../../utils/dateFormat";
import "../../styles/admin-home.css";

const eventService = new EventService();
const registrationService = new RegistrationService();
const MONTHS_TO_CHECK = 6;

function monthRangeFromToday(monthCount) {
  const today = new Date();

  return Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() + index, 1);

    return {
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  });
}

function uniqueEvents(events) {
  const eventMap = new Map();

  events.forEach((event) => {
    eventMap.set(event.id, event);
  });

  return Array.from(eventMap.values());
}

function formatDonationAmount(donation) {
  return `${(Number(donation.amount_cents || 0) / 100).toFixed(2)} USD`;
}

export default function AdminHome() {
  const [dashboardData, setDashboardData] = useState({
    programs: [],
    events: [],
    donations: [],
    registrationItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const monthRequests = monthRangeFromToday(MONTHS_TO_CHECK).map(({ month, year }) =>
          eventService.getAllEventsForMonth(month, year)
        );

        const [programs, eventGroups, donationsResponse] = await Promise.all([
          getPrograms(),
          Promise.all(monthRequests),
          fetch("/admin/api/donations", { credentials: "include" }),
        ]);

        if (!donationsResponse.ok) {
          const errorData = await donationsResponse.json();
          throw new Error(errorData.error || "Failed to load donations");
        }

        const events = uniqueEvents(eventGroups.flat());
        const donations = await donationsResponse.json();

        const programRegistrationItems = await Promise.all(
          programs.map(async (program) => {
            const stats = await registrationService
              .getRegistrationStats("program", program.id)
              .catch(() => ({ registered: 0, waitlisted: 0 }));

            return {
              id: program.id,
              title: program.title,
              type: "Program",
              registered: Number(stats?.registered || 0),
              waitlisted: Number(stats?.waitlisted || 0),
            };
          })
        );

        const eventRegistrationItems = await Promise.all(
          events
            .filter((event) => event.isRegisterable)
            .map(async (event) => {
              const stats = await registrationService
                .getRegistrationStats("event", event.id)
                .catch(() => ({ registered: 0, waitlisted: 0 }));

              return {
                id: event.id,
                title: event.title,
                type: "Event",
                registered: Number(stats?.registered || 0),
                waitlisted: Number(stats?.waitlisted || 0),
              };
            })
        );

        const registrationItems = [
          ...programRegistrationItems,
          ...eventRegistrationItems,
        ];

        setDashboardData({
          programs,
          events,
          donations,
          registrationItems: registrationItems
            .filter((item) => item.registered > 0 || item.waitlisted > 0)
            .sort(
              (a, b) =>
                b.registered - a.registered ||
                b.waitlisted - a.waitlisted ||
                a.title.localeCompare(b.title)
            ),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const upcomingEvents = dashboardData.events
    .filter((event) => event.isActive)
    .filter((event) => event.startDate >= today)
    .sort((a, b) => a.startDate - b.startDate);
  const recentDonations = [...dashboardData.donations]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const totalWaitlisted = dashboardData.registrationItems.reduce(
    (total, item) => total + item.waitlisted,
    0
  );
  const totalRegistered = dashboardData.registrationItems.reduce(
    (total, item) => total + item.registered,
    0
  );

  if (loading) {
    return (
      <div className="admin-home">
        <p className="admin-dashboard-message">Loading dashboard totals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-home">
        <p className="admin-dashboard-message admin-dashboard-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="admin-home">
      <section className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-kicker">Live Dashboard</p>
          <h1>Admin Totals</h1>
        </div>
        <p>
          Showing events from the current month through the next {MONTHS_TO_CHECK - 1} months.
        </p>
      </section>

      <section className="admin-dashboard-live-grid">
        <article className="admin-dashboard-panel">
          <div className="admin-dashboard-panel-heading">
            <h2>Upcoming Events</h2>
            <p>{upcomingEvents.length} active upcoming events found.</p>
          </div>

          {upcomingEvents.length > 0 ? (
            <ul className="admin-dashboard-list">
              {upcomingEvents.slice(0, 6).map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong>
                  <span>{formatDisplayDate(event.startDate)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-dashboard-empty">No upcoming active events found.</p>
          )}
        </article>

        <article className="admin-dashboard-panel">
          <div className="admin-dashboard-panel-heading">
            <h2>Registration Counts</h2>
            <p>
              {totalRegistered} registered and {totalWaitlisted} waitlisted across programs and events.
            </p>
          </div>

          {dashboardData.registrationItems.length > 0 ? (
            <ul className="admin-dashboard-list">
              {dashboardData.registrationItems.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.type}</span>
                  </div>
                  <div className="admin-dashboard-count-pair">
                    <span>
                      {item.registered === 1
                        ? "1 registered"
                        : `${item.registered} registered`}
                    </span>
                    <span>
                      {item.waitlisted === 1
                        ? "1 waitlisted"
                        : `${item.waitlisted} waitlisted`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-dashboard-empty">No programs or events currently have registrations.</p>
          )}
        </article>
      </section>

      <section className="admin-dashboard-panel">
        <div className="admin-dashboard-panel-heading">
          <h2>Recent Donations</h2>
          <p>Latest donation records from the admin donations endpoint.</p>
        </div>

        {recentDonations.length > 0 ? (
          <div className="admin-dashboard-donation-list">
            {recentDonations.map((donation) => (
              <div className="admin-dashboard-donation-row" key={donation.id}>
                <strong>{formatDonationAmount(donation)}</strong>
                <span>{donation.status}</span>
                <span>{formatDisplayDateTime(donation.created_at)}</span>
                <span>{donation.donor_email || "No email"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="admin-dashboard-empty">No recent donations found.</p>
        )}
      </section>
    </div>
  );
}
