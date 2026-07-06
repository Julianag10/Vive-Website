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

  async unregister(type, id, email) {
    const res = await fetch(`/api/registrations/${type}/${id}/unregister`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Unable to unregister.");
    }

    return true;
  }

  // PUBLIC
  async lookupRegistration(type, id, email) {
    const res = await fetch(
      `/api/registrations/${type}/${id}/registration?email=${encodeURIComponent(email)}`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return new Registration(data);
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
  async emailRegistrant(type, id, emailData) {
    const res = await fetch(
      `/admin/api/${type}/${id}/email`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to send email.");
    }

    return true;
  }

// piublic or amdin ????
  async getRegistrationStats(type, id) {
    // TODO FIX HERE???? shoudlnt it be /admin/api/registrations/${type}/${id}/registration-stats
    const res = await fetch(`/api/registrations/${type}/${id}/registration-stats`);

    if (!res.ok) {
      throw new Error("Failed to load registration stats.");
    }

    return await res.json();
  }
}