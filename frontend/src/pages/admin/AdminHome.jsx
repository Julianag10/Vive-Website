import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

function isDonationFromCurrentMonth(donation) {
  const donationDate = new Date(donation.created_at);
  const today = new Date();

  return (
    donationDate.getFullYear() === today.getFullYear() &&
    donationDate.getMonth() === today.getMonth()
  );
}

export default function AdminHome() {
  const [dashboardData, setDashboardData] = useState({
    programs: [],
    events: [],
    donations: [],
    registrationItems: [],
    volunteerApplications: [],
    contactMessages: [],
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

        const [programs, eventGroups, donationsResponse, volunteersResponse, contactResponse] = await Promise.all([
          getPrograms(),
          Promise.all(monthRequests),
          fetch("/admin/api/donations", { credentials: "include" }),
          fetch("/admin/api/volunteers", { credentials: "include" }),
          fetch("/admin/api/contact", { credentials: "include" }),
        ]);

        if (!donationsResponse.ok) {
          const errorData = await donationsResponse.json();
          throw new Error(errorData.error || "Failed to load donations");
        }

        if (!volunteersResponse.ok) {
          const errorData = await volunteersResponse.json();
          throw new Error(errorData.error || "Failed to load volunteer applications");
        }

        if (!contactResponse.ok) {
          const errorData = await contactResponse.json();
          throw new Error(errorData.error || "Failed to load contact messages");
        }

        const events = uniqueEvents(eventGroups.flat());
        const donations = await donationsResponse.json();
        const volunteerApplications = await volunteersResponse.json();
        const contactMessages = await contactResponse.json();

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
          volunteerApplications,
          contactMessages,
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
  const currentMonthDonationTotal = dashboardData.donations
    .filter(isDonationFromCurrentMonth)
    .reduce((total, donation) => total + Number(donation.amount_cents || 0), 0);
  const recentVolunteerApplications = [...dashboardData.volunteerApplications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
  const recentContactMessages = [...dashboardData.contactMessages]
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
            <p className="experiment">
              what size am i , thisisi sixe 20.48px
            </p>
            <p>
              {totalRegistered} registered and {totalWaitlisted} waitlisted across programs and events.
            </p>
          </div>

          {dashboardData.registrationItems.length > 0 ? (
            <ul className="admin-dashboard-list">
              {dashboardData.registrationItems.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <Link
                    className="admin-dashboard-registration-link"
                    to={`/admin/registrations/${item.type.toLowerCase()}/${item.id}`}
                  >
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
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-dashboard-empty">No programs or events currently have registrations.</p>
          )}
        </article>
      </section>

      <section className="admin-dashboard-live-grid">
        <article className="admin-dashboard-panel admin-dashboard-volunteers-panel">
          <div className="admin-dashboard-panel-heading">
            <h2>Volunteer Form Responses</h2>
            <p>
              {dashboardData.volunteerApplications.length === 1
                ? "1 volunteer application has been submitted."
                : `${dashboardData.volunteerApplications.length} volunteer applications have been submitted.`}
            </p>
          </div>

          {recentVolunteerApplications.length > 0 ? (
            <div className="admin-dashboard-volunteer-list">
              {recentVolunteerApplications.map((application) => (
                <Link
                  className="admin-dashboard-volunteer-row"
                  key={application.id}
                  to="/admin/volunteers"
                >
                  <strong>
                    {application.first_name} {application.last_name}
                  </strong>
                  <span className="admin-dashboard-response-email">{application.email}</span>
                  <span className="admin-dashboard-response-date">
                    {formatDisplayDate(application.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="admin-dashboard-empty">No volunteer form responses yet.</p>
          )}
        </article>

        <article className="admin-dashboard-panel admin-dashboard-contact-panel">
          <div className="admin-dashboard-panel-heading">
            <h2>Contact Us Responses</h2>
            <p>
              {dashboardData.contactMessages.length === 1
                ? "1 contact message has been submitted."
                : `${dashboardData.contactMessages.length} contact messages have been submitted.`}
            </p>
          </div>

          {recentContactMessages.length > 0 ? (
            <div className="admin-dashboard-volunteer-list">
              {recentContactMessages.map((message) => (
                <Link
                  className="admin-dashboard-volunteer-row"
                  key={message.id}
                  to="/admin/contact"
                >
                  <strong>
                    {message.first_name} {message.last_name}
                  </strong>
                  <span className="admin-dashboard-response-email">{message.email}</span>
                  <span className="admin-dashboard-response-date">
                    {formatDisplayDate(message.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="admin-dashboard-empty">No contact messages yet.</p>
          )}
        </article>
      </section>

      <section className="admin-dashboard-panel">
        <div className="admin-dashboard-panel-heading">
          <h2>Recent Donations</h2>
          <p>Latest donation records from the admin donations endpoint.</p>
        </div>

        <div className="admin-dashboard-monthly-donation-total">
          <span>This Month</span>
          <strong>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(currentMonthDonationTotal / 100)}
          </strong>
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
