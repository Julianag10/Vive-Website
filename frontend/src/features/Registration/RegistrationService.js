import Registration from "./Registration";

export default class RegistrationService {

  async register(type, id, registrationData) {
    const res = await fetch(`/api/registrations/${type}/${id}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to register.");
    }

    return await res.json();
  }

  async unregister(type, id, email, options = {}) {
    const res = await fetch(`/api/registrations/${type}/${id}/unregister`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventOccurrenceId: options.eventOccurrenceId,
        registrationId: options.registrationId,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || error.message || "Unable to unregister.");
    }

    return await res.json();
  }

  // PUBLIC
  async lookupRegistration(type, id, email, options = {}) {
    const params = new URLSearchParams({
      email,
    });

    if (options.occurrenceId) {
      params.set("occurrence_id", options.occurrenceId);
    }

    const res = await fetch(
      `/api/registrations/${type}/${id}/registration?${params.toString()}`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return new Registration(data);
  }

  async lookupRegistrationsByEmail(email) {
    const params = new URLSearchParams({
      email,
    });

    const res = await fetch(`/api/registrations/lookup?${params.toString()}`);

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data.map((registration) => new Registration(registration));
  }

  async getAdminRegistrations(type, id) {
    const res = await fetch(`/admin/api/registrations/${type}/${id}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to load registrations.");
    }

    const data = await res.json();

    return data.map(reg => new Registration(reg));
  }

  // ADMIN
  async emailRegistrationRecipient(type, id, registrationId, emailData) {
    const res = await fetch(`/admin/api/registrations/${type}/${id}/email/${registrationId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to send email.");
    }

    return data;
  }

  async emailRegistered(type, id, emailData) {
    const res = await fetch(`/admin/api/registrations/${type}/${id}/email-all`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to send email.");
    }

    return data;
  }

// piublic or amdin ????
  async getRegistrationStats(type, id, options = {}) {
    // TODO FIX HERE???? shoudlnt it be /admin/api/registrations/${type}/${id}/registration-stats
    const params = new URLSearchParams();

    if (options.occurrenceId) {
      params.set("occurrence_id", options.occurrenceId);
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`/api/registrations/${type}/${id}/registration-stats${query}`);

    if (!res.ok) {
      throw new Error("Failed to load registration stats.");
    }

    return await res.json();
  }
}
