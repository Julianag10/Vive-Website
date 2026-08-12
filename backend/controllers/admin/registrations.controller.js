// ADMIN
import {
  emailRegistrationRecipientForResource,
  emailRegisteredForResource,
  listRegistrationsForResource,
} from "../../services/admin/registrations.service.js";

export async function listRegistrationsController(req, res) {
  const registrationList = await listRegistrationsForResource(
    req.params.type,
    req.params.id
  );

  res.json(registrationList);
}

export async function emailRegisteredController(req, res, next) {
  try {
    const result = await emailRegisteredForResource(
      req.params.type,
      req.params.id,
      req.body
    );

    res.json({
      message: `Email sent to ${result.sentCount} registered recipient${result.sentCount === 1 ? "" : "s"}.`,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function emailRegistrationRecipientController(req, res, next) {
  try {
    const result = await emailRegistrationRecipientForResource(
      req.params.type,
      req.params.id,
      req.params.registrationId,
      req.body
    );

    res.json({
      message: `Email sent to ${result.recipientEmail}.`,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
