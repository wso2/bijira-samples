import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const merchants = new Map(); // merchantId => merchant object
const kycDocs = new Map(); // merchantId => array of docs
const linkedAccounts = new Map(); // merchantId => bank account info

// GET /merchants - list all merchants
app.get("/merchants", (_req, res) => {
  const allMerchants = Array.from(merchants.values());
  res.json({ merchants: allMerchants });
});

// POST /merchants - register a new merchant
app.post("/merchants", (req, res) => {
  const { name, contactEmail, businessType, phone, website } = req.body;

  if (!name || !contactEmail || !businessType) {
    return res.status(400).json({ error: "Missing required fields: name, contactEmail, businessType." });
  }

  const merchantId = `merch-${uuidv4()}`;
  const merchant = {
    merchantId,
    name,
    contactEmail,
    businessType,
    phone: phone || null,
    website: website || null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  merchants.set(merchantId, merchant);

  return res.status(201).json({
    merchantId,
    status: merchant.status,
    message: "Merchant registration submitted successfully.",
  });
});

// PATCH /merchants/:merchantId - partial update of merchant
app.patch("/merchants/:merchantId", (req, res) => {
  const { merchantId } = req.params;

  if (!merchants.has(merchantId)) {
    return res.status(404).json({ error: "Merchant not found." });
  }

  const merchant = merchants.get(merchantId);
  const allowedFields = ["name", "contactEmail", "businessType", "phone", "website"];
  const updates = req.body;

  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      merchant[key] = updates[key];
    }
  }

  merchants.set(merchantId, merchant);
  return res.json({ merchantId, message: "Merchant updated successfully." });
});

// DELETE /merchants/:merchantId - delete merchant and related data
app.delete("/merchants/:merchantId", (req, res) => {
  const { merchantId } = req.params;

  if (!merchants.has(merchantId)) {
    return res.status(404).json({ error: "Merchant not found." });
  }

  merchants.delete(merchantId);
  kycDocs.delete(merchantId);
  linkedAccounts.delete(merchantId);

  return res.json({ merchantId, message: "Merchant deleted successfully." });
});

// POST /merchants/:merchantId/kyc - submit KYC docs
app.post("/merchants/:merchantId/kyc", (req, res) => {
  const { merchantId } = req.params;
  const { documents } = req.body;

  if (!merchants.has(merchantId)) {
    return res.status(404).json({ error: "Merchant not found." });
  }

  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return res.status(400).json({ error: "Documents array is required." });
  }

  kycDocs.set(merchantId, documents);

  // Update KYC status on merchant
  const merchant = merchants.get(merchantId);
  merchant.kycStatus = "submitted";
  merchants.set(merchantId, merchant);

  return res.json({
    merchantId,
    kycStatus: merchant.kycStatus,
    message: "KYC documents received and under review.",
  });
});

// POST /merchants/:merchantId/account-link - link bank account
app.post("/merchants/:merchantId/account-link", (req, res) => {
  const { merchantId } = req.params;
  const { bankAccountNumber, bankRoutingNumber, accountHolderName } = req.body;

  if (!merchants.has(merchantId)) {
    return res.status(404).json({ error: "Merchant not found." });
  }

  if (!bankAccountNumber || !bankRoutingNumber || !accountHolderName) {
    return res.status(400).json({ error: "Missing required bank account fields." });
  }

  const linkedAccountId = `acct-${uuidv4()}`;
  linkedAccounts.set(merchantId, {
    linkedAccountId,
    bankAccountNumber,
    bankRoutingNumber,
    accountHolderName,
  });

  return res.json({
    merchantId,
    linkedAccountId,
    message: "Bank account linked successfully.",
  });
});

// GET /merchants/:merchantId/approval-status - get approval status
app.get("/merchants/:merchantId/approval-status", (req, res) => {
  const { merchantId } = req.params;

  if (!merchants.has(merchantId)) {
    return res.status(404).json({ error: "Merchant not found." });
  }

  const merchant = merchants.get(merchantId);
  return res.json({
    merchantId,
    approvalStatus: merchant.status || "pending",
    reviewedBy: "admin-user-01",
    reviewedAt: new Date().toISOString(),
    remarks:
        merchant.status === "approved"
            ? "All documents verified successfully."
            : "Pending review.",
  });
});

// GET /merchants/:merchantId - get merchant details by ID
app.get("/merchants/:merchantId", (req, res) => {
  const { merchantId } = req.params;

  if (!merchants.has(merchantId)) {
    return res.status(404).json({ error: "Merchant not found." });
  }

  const merchant = merchants.get(merchantId);
  return res.json(merchant);
});

// Health check endpoint
app.get("/healthz", (_req, res) => {
  res.sendStatus(200);
});

// 404 handler for unmatched routes
app.use("*", (_req, res) => {
  res.status(404).json({ error: "The requested resource does not exist on this server" });
});

export default app;