import { createContactMessage } from "../services/contact.service.js";

export async function createContactMessageController(req, res, next) {
  try {
    const message = await createContactMessage(req.body);
    res.status(201).json({
      message: "Contact message submitted.",
      contactMessage: message,
    });
  } catch (error) {
    next(error);
  }
}
