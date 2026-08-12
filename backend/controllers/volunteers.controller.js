import {
  createVolunteerApplication,
  getVolunteerApplicationByToken,
  updateVolunteerApplicationByToken,
  withdrawVolunteerApplicationByToken,
} from "../services/volunteers.service.js";

export async function createVolunteerApplicationController(req, res, next) {
  try {
    const application = await createVolunteerApplication(req.body);
    res.status(201).json({
      message: "Volunteer application submitted.",
      application,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVolunteerApplicationController(req, res, next) {
  try {
    const application = await getVolunteerApplicationByToken(req.params.token);
    res.json({ application });
  } catch (error) {
    next(error);
  }
}

export async function updateVolunteerApplicationController(req, res, next) {
  try {
    const application = await updateVolunteerApplicationByToken(req.params.token, req.body);
    res.json({
      message: "Volunteer application updated.",
      application,
    });
  } catch (error) {
    next(error);
  }
}

export async function withdrawVolunteerApplicationController(req, res, next) {
  try {
    const application = await withdrawVolunteerApplicationByToken(req.params.token);
    res.json({
      message: "Volunteer application withdrawn.",
      application,
    });
  } catch (error) {
    next(error);
  }
}
