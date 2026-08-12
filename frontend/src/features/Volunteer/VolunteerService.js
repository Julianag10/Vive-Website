export default class VolunteerService {
  async submitApplication(applicationData) {
    const res = await fetch("/api/volunteers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Unable to submit volunteer application.");
    }

    return data;
  }

  async getApplication(token) {
    const res = await fetch(`/api/volunteers/application/${token}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Unable to load volunteer application.");
    }

    return data.application;
  }

  async updateApplication(token, applicationData) {
    const res = await fetch(`/api/volunteers/application/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Unable to update volunteer application.");
    }

    return data.application;
  }

  async withdrawApplication(token) {
    const res = await fetch(`/api/volunteers/application/${token}/withdraw`, {
      method: "POST",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Unable to withdraw volunteer application.");
    }

    return data.application;
  }
}
