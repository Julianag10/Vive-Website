import {
  emailContactMessage,
  listContactMessages,
} from "../../services/admin/contact.service.js";

export async function listContactMessagesController(_req, res) {
  try {
    const messages = await listContactMessages();
    res.json(messages);
  } catch (error) {
    console.error("Failed to load contact messages:", error);
    res.status(500).json({ error: error.message || "Failed to load contact messages" });
  }
}

export async function emailContactMessageController(req, res) {
  try {
    const result = await emailContactMessage(req.params.id, req.body);

    res.json({
      message: `Email sent to ${result.recipientEmail}.`,
      ...result,
    });
  } catch (error) {
    console.error("Failed to email contact response:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Failed to email contact response" });
  }
}
