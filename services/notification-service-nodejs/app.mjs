import express from 'express';
import { Resend } from 'resend';

const app = express();
app.use(express.json());
const sentNotifications = new Map();

const resend = new Resend(process.env.RESEND_API_KEY || "re_SF9zrda1_QEniFgR3Mjp1ckJFBcMwrjkG");

// Helper to build email HTML and text bodies from filtered promotions
function buildEmailContent(filtered) {
  const promoItemsHtml = filtered.length
      ? filtered.map((promo, i) => `
    <div style="
      margin-bottom: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.85);
      box-shadow: 0 1px 6px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.5;
      max-width: 100%;
      box-sizing: border-box;
    ">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #004aad;">
        ${i + 1}. ${promo.company_name}
      </h3>
      <p style="margin: 0 0 6px 0; font-size: 13px;">
        <strong>Card Type:</strong> ${promo.card_type} &nbsp; | &nbsp;
        <strong>Promo Code:</strong> <span style="color: #0073e6;">${promo.promo_code ?? "N/A"}</span>
      </p>
      <p style="margin: 8px 0; font-size: 14px;">
        <em>${promo.description}</em>
      </p>
      <p style="margin: 8px 0; font-size: 13px;">
        <strong>Promotion Details:</strong> ${promo.promotion_details ?? "N/A"}
      </p>
      <p style="margin: 8px 0; font-size: 12px; color: #666; font-style: italic; border-top: 1px solid #eee; padding-top: 6px;">
        <strong>Terms & Conditions:</strong> ${promo.terms_and_conditions ?? "N/A"}
      </p>
      <p style="font-size: 13px; color: #555;">
        <strong>Validity:</strong> ${promo.validity?.start_date ?? "N/A"} to ${promo.validity?.end_date ?? "N/A"}
      </p>
    </div>
  `).join("")
      : `<p style="font-size: 14px; color: #333;">No matching promotions found.</p>`;

  const htmlTemplate = `<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table 
      width="100%" height="100%" 
      cellpadding="0" cellspacing="0" border="0"
      style="
        background-image: url('https://png.pngtree.com/background/20210710/original/pngtree-mid-year-big-rush-to-red-envelope-orange-gradient-banner-background-picture-image_1043704.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        width: 100%;
        height: 100vh;
        min-height: 100%;
      ">
      <tr>
        <td align="center" valign="middle" style="padding: 20px;">
          <table 
            cellpadding="0" cellspacing="0" border="0"
            style="
              width: 100%;
              max-width: 600px;
              background-color: rgba(255, 255, 255, 0.95);
              border-radius: 12px;
              font-family: Arial, sans-serif;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(6px);
              padding: 24px;
              text-align: left;
              box-sizing: border-box;
            ">
            <tr>
              <td>
                <h2 style="margin-top: 0; color: #222; font-size: 20px;">Card Promotion Alerts</h2>
                ${promoItemsHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;


  const text = filtered.length
      ? filtered.map((promo, i) =>
          `${i + 1}. ${promo.company_name} - ${promo.category}\n` +
          `Card Type: ${promo.card_type}\n` +
          `Promo Code: ${promo.promo_code ?? "N/A"}\n` +
          `Description: ${promo.description}\n` +
          `Validity: ${promo.validity?.start_date ?? "N/A"} to ${promo.validity?.end_date ?? "N/A"}\n`
      ).join("\n")
      : "No matching promotions found.";

  return { html: htmlTemplate, text };
}


app.post('/notifications', async (req, res) => {
  try {
    const {
      type,
      to,
      subject,
      messageBody // <-- expected to be a list of promotion objects
    } = req.body;

    if (!type || !to || !Array.isArray(messageBody)) {
      return res.status(400).json({
        error: "Missing required fields. Ensure 'type', 'to', and 'messageBody' (as array) are present."
      });
    }

    if (type !== "email") {
      return res.status(400).json({ error: `Notification type '${type}' not supported` });
    }

    const userMessage = "You can find exclusive promotions given below.";

    const { html: promosHtml, text: promosText } = buildEmailContent(messageBody);

    const fullHtml = `
      <p>Dear Sir/Madam,</p>
      <p>${userMessage}</p>
      ${promosHtml}
    `;

    const fullText = `Dear Sir/Madam,\n\n${userMessage}\n\n${promosText}`;

    const emailRequest = {
      from: "Card Promotions <onboarding@resend.dev>",
      to,
      subject: subject || `Don't miss today's Promotions!`,
      html: fullHtml,
      text: fullText,
      replyTo: "onboarding@resend.dev"
    };

    const response = await resend.emails.send(emailRequest);

    if (response.error) {
      console.error("Resend email error:", response.error);
      return res.status(500).json({ error: "Email sending failed", details: response.error });
    }

    const notificationId = response.data.id;
    const notification = {
      id: notificationId,
      type,
      recipient: to,
      status: "sent",
      createdAt: new Date().toISOString(),
      error: null
    };

    sentNotifications.set(notificationId, notification);

    return res.status(201).json({
      message: "✅ Email sent successfully",
      id: notificationId,
      promotionsIncluded: messageBody.length
    });

  } catch (error) {
    console.error("Error in /notifications:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// GET /notifications - list all sent mock notifications
app.get('/notifications', (req, res) => {
  const { type, status } = req.query;

  let results = Array.from(sentNotifications.values());

  if (type) {
    results = results.filter((n) => n.type === type);
  }

  if (status) {
    results = results.filter((n) => n.status === status);
  }

  return res.status(200).json(results);
});

// GET /notifications/:id - get a specific mock notification
app.get('/notifications/:id', (req, res) => {
  const { id } = req.params;

  if (!sentNotifications.has(id)) {
    return res.status(404).json({ error: "Notification not found" });
  }

  return res.status(200).json(sentNotifications.get(id));
});

// Health check
app.get('/healthz', (_, res) => res.sendStatus(200));

// 404 handler
app.use("*", (_, res) => res.status(404).json({ error: "Not found" }));

export default app;
