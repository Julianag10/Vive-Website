import {
  getRegistrationStats,
  lookupRegistration,
  lookupRegistrationsByEmail,
  registerForResource,
  unregisterFromResource,
} from "../services/registrations.service.js";

export async function registerController(req, res) {
  try {
    const name = req.body.name || [req.body.firstName, req.body.lastName].filter(Boolean).join(" ").trim();

    const registration = await registerForResource(
      req.params.type,
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      status: registration.status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

export async function unregisterController(req, res) {
  try {
    const registration = await unregisterFromResource(
      req.params.type,
      req.params.id,
      req.body.email,
      {
        occurrenceId: req.body.eventOccurrenceId || null,
        registrationId: req.body.registrationId || null,
      }
    );

    return res.json({
      success: true,
      removed: registration.removed,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getRegistrationStatsController(req, res) {
  const stats = await getRegistrationStats(req.params.type, req.params.id, {
    occurrenceId: req.query.occurrence_id || null,
  });

  if (!stats) {
    const resourceLabel = req.params.type === "event" ? "Event" : "Program";
    return res.status(404).json({ error: `${resourceLabel} not found` });
  }

  res.json(stats);
}

export async function lookupRegistrationController(req, res) {
  const registration = await lookupRegistration(
    req.params.type,
    req.params.id,
    req.query.email,
    {
      occurrenceId: req.query.occurrence_id || null,
    }
  );

  if (!registration) {
    return res.status(404).json({ error: "Registration not found" });
  }

  res.json(registration);
}

export async function lookupRegistrationsByEmailController(req, res) {
  const registrations = await lookupRegistrationsByEmail(req.query.email);

  if (registrations.length === 0) {
    return res.status(404).json({ error: "Registration not found" });
  }

  res.json(registrations);
}
