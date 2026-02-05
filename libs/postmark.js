import config from "../config";

/**
 * Send a transactional email using the Postmark API.
 *
 * @param {Object} input
 * @param {string} input.to - Recipient email address.
 * @param {string} input.subject - Email subject.
 * @param {string} [input.html] - HTML body.
 * @param {string} [input.text] - Plain text body.
 * @param {string} [input.from] - Optional sender override; defaults to config.postmark.senderEmail.
 * @param {string} [input.messageStream] - Optional Postmark message stream (default: "outbound").
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  messageStream = "outbound"
}) {
  const apiKey = config.postmark.apiKey;
  const sender = from ?? config.postmark.senderEmail;

  if (!apiKey) throw new Error("Missing POSTMARK_API_KEY");
  if (!sender) throw new Error("Missing POSTMARK_SENDER_EMAIL");
  if (!to) throw new Error("Missing recipient email");
  if (!subject) throw new Error("Missing subject");
  if (!html && !text) throw new Error("Missing email body");

  const payload = {
    From: sender,
    To: to,
    Subject: subject,
    HtmlBody: html,
    TextBody: text,
    MessageStream: messageStream
  };

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const textResponse = await response.text();
    throw new Error(`Postmark error: ${response.status} ${textResponse}`);
  }

  return response.json();
}
