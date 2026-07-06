import {
  getRegistrationStats,
  lookupRegistration,
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
      req.body.email
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
  const stats = await getRegistrationStats(req.params.type, req.params.id);

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
    req.query.email
  );

  if (!registration) {
    return res.status(404).json({ error: "Registration not found" });
  }

  res.json(registration);
}