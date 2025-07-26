import express from 'express';
import { Resend } from 'resend';

const app = express();
app.use(express.json());
const sentNotifications = new Map();

const resend = new Resend(process.env.RESEND_API_KEY || "re_SF9zrda1_QEniFgR3Mjp1ckJFBcMwrjkG");

// Sample promotions
const promotions = [
  {
    company_name: "HNB Hotels & Resorts",
    card_type: "Amex",
    description: "Enjoy up to 25% off on hotel bookings with your card.",
    category: "Travel & Hotels",
    validity: { start_date: "2025-07-23", end_date: "2025-08-12" },
    promotion_details: "Enjoy up to 25% off on hotel bookings with your card. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "HNB-AMEX-25HOTEL"
  },
  {
    company_name: "FreshMart Supermarket",
    card_type: "Visa",
    description: "Get 15% cashback on grocery shopping every weekend.",
    category: "Supermarket",
    validity: { start_date: "2025-07-23", end_date: "2025-08-11" },
    promotion_details: "Get 15% cashback on grocery shopping every weekend. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "BOC-VISA-15GROC"
  },
  {
    company_name: "Green Valley Grocers",
    card_type: "Visa",
    category: "Supermarket",
    promo_code: "SAVE10",
    description: "Get 10% off on groceries using Visa card",
    promotion_details: "Get 10% cashback on grocery shopping every weekend. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    validity: { start_date: "2025-07-01", end_date: "2025-07-31" }
  },
  {
    company_name: "Gourmet Dining Co.",
    card_type: "Visa",
    description: "Buy 1 Get 1 Free on selected dining outlets.",
    category: "Dining",
    validity: { start_date: "2025-07-23", end_date: "2025-08-22" },
    promotion_details: "Buy 1 Get 1 Free on selected dining outlets. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "CBC-VISA-B1G1DIN"
  },
  {
    company_name: "FashionHub",
    card_type: "Visa",
    description: "10% discount on all clothing items every Friday.",
    category: "Fashion",
    validity: { start_date: "2025-07-23", end_date: "2025-08-05" },
    promotion_details: "10% discount on all clothing items every Friday. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "NDB-VISA-10FRI"
  },
  {
    company_name: "ElectroFest",
    card_type: "Amex",
    description: "Flat 20% off on electronics during the festive season.",
    category: "Electronics",
    validity: { start_date: "2025-07-23", end_date: "2025-08-13" },
    promotion_details: "Flat 20% off on electronics during the festive season. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "SAMP-AMEX-20ELEC"
  },
  {
    company_name: "Mobile Zone",
    card_type: "Visa",
    description: "Special EMI options on mobile purchases.",
    category: "Mobiles & Gadgets",
    validity: { start_date: "2025-07-23", end_date: "2025-08-11" },
    promotion_details: "Special EMI options on mobile purchases. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "PB-VISA-EMIMOB"
  },
  {
    company_name: "UtilityPay",
    card_type: "Debit",
    description: "Extra 5% discount on utility bill payments.",
    category: "Utilities",
    validity: { start_date: "2025-07-23", end_date: "2025-08-13" },
    promotion_details: "Extra 5% discount on utility bill payments. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "DFCC-DEBIT-5UTIL"
  },
  {
    company_name: "Salon Luxe",
    card_type: "Visa",
    description: "Exclusive 30% off at selected salons.",
    category: "Beauty & Wellness",
    validity: { start_date: "2025-07-23", end_date: "2025-08-06" },
    promotion_details: "Exclusive 30% off at selected salons. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "AMA-VISA-30SALON"
  },
  {
    company_name: "RewardsPlus",
    card_type: "Amex",
    description: "Double your reward points every Wednesday.",
    category: "Rewards",
    validity: { start_date: "2025-07-23", end_date: "2025-08-15" },
    promotion_details: "Double your reward points every Wednesday. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "UB-AMEX-2XWED"
  },
  {
    company_name: "Sweet Treats Bakery",
    card_type: "Visa",
    description: "Complimentary dessert with any main course.",
    category: "Dining",
    validity: { start_date: "2025-07-23", end_date: "2025-08-18" },
    promotion_details: "Complimentary dessert with any main course. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "SEY-VISA-FREEDES"
  },
  {
    company_name: "ShopEase",
    card_type: "Debit",
    description: "Free delivery on all online orders over Rs. 2000.",
    category: "E-Commerce",
    validity: { start_date: "2025-07-23", end_date: "2025-08-20" },
    promotion_details: "Free delivery on all online orders over Rs. 2000. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "SCB-DEBIT-FREEDEL"
  },
  {
    company_name: "MovieMania",
    card_type: "Amex",
    description: "Win movie tickets when you spend over Rs. 5000.",
    category: "Entertainment",
    validity: { start_date: "2025-07-23", end_date: "2025-08-20" },
    promotion_details: "Win movie tickets when you spend over Rs. 5000. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "NTB-AMEX-MOVIE5000"
  },
  {
    company_name: "LoanSmart Financial",
    card_type: "Amex",
    description: "Special rates on personal loans for cardholders.",
    category: "Financial Services",
    validity: { start_date: "2025-07-23", end_date: "2025-08-21" },
    promotion_details: "Special rates on personal loans for cardholders. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "PAB-AMEX-LOANSPL"
  },
  {
    company_name: "FuelUp Gas Stations",
    card_type: "Amex",
    description: "Fuel up and save 5% every weekend.",
    category: "Fuel",
    validity: { start_date: "2025-07-23", end_date: "2025-08-05" },
    promotion_details: "Fuel up and save 5% every weekend. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "CB-AMEX-FUEL5WKND"
  },
  {
    company_name: "CoffeeCorner Cafes",
    card_type: "Visa",
    description: "Free coffee every Monday at partner cafes.",
    category: "Dining",
    validity: { start_date: "2025-07-23", end_date: "2025-08-09" },
    promotion_details: "Free coffee every Monday at partner cafes. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "LBF-VISA-COFMON"
  },
  {
    company_name: "AirFly Airlines",
    card_type: "Visa",
    description: "20% off on air tickets for international flights.",
    category: "Travel & Hotels",
    validity: { start_date: "2025-07-23", end_date: "2025-08-17" },
    promotion_details: "20% off on air tickets for international flights. Valid at selected merchants only.",
    terms_and_conditions: "Terms apply. Offer valid only during the mentioned period. Subject to change without notice.",
    promo_code: "MI-VISA-AIR20INT"
  }
];


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

// POST /notifications - unified notification sender
app.post('/notifications', async (req, res) => {
  try {
    const {
      type,
      to,
      subject,
      cardTypes = [],
      category,
      promoCode,
      startDate,
      endDate,
      message
    } = req.body;

    if (!type || !to) {
      return res.status(400).json({ error: "Missing 'type' or 'to' in request body" });
    }

    if (type !== "email") {
      return res.status(400).json({ error: `Notification type '${type}' not supported` });
    }

    const cleanCardTypes = Array.isArray(cardTypes)
        ? cardTypes.filter(Boolean).map(ct => ct.trim().toLowerCase())
        : [];

    const cleanPromoCode = promoCode?.trim().toLowerCase() || '';
    const cleanDate = startDate || endDate ? new Date(startDate || endDate) : null;

    const cleanCategories = Array.isArray(category)
        ? category.filter(Boolean).map(c => c.trim().toLowerCase())
        : category ? [category.trim().toLowerCase()] : [];

    const filtered = promotions.filter((promo) => {
      const matchCard = !cleanCardTypes.length || cleanCardTypes.includes(promo.card_type?.toLowerCase());
      const matchCategory = !cleanCategories.length || cleanCategories.includes(promo.category?.toLowerCase());
      const matchCode = !cleanPromoCode || promo.promo_code?.toLowerCase() === cleanPromoCode;
      const matchDate = !cleanDate || (
          new Date(promo.validity.start_date) <= cleanDate &&
          new Date(promo.validity.end_date) >= cleanDate
      );
      return matchCard && matchCategory && matchCode && matchDate;
    });

    if (filtered.length === 0) {
      return res.status(200).json({ status: "no_matching_promotions", message: "No promotions matched the criteria." });
    }

    const userMessage = message || "You can find exclusive promotions given below.";

    const { html: promosHtml, text: promosText } = buildEmailContent(filtered);

    const fullHtml = `
      <p>Dear Sir/Madam,</p>
      <p>${userMessage}</p>
      ${promosHtml}
    `;

    const fullText = `Dear Sir/Madam,\n\n${userMessage}\n\n${promosText}`;

    const emailRequest = {
      from: "Card Promotions <onboarding@resend.dev>",
      to,
      subject: subject || `Don't miss today's Promotions${cleanCategories.length ? ` in ${cleanCategories.join(', ')}` : ''}`,
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
      promotionsMatched: filtered.length
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
