import chai from "chai";
import chaiHttp from "chai-http";
import app from "./app.mjs";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Merchant Onboarding API - CRUD & Operations", () => {
  let merchantId;

  describe("POST /merchants", () => {
    it("should register a new merchant", async () => {
      const merchantData = {
        name: "Test Merchant",
        contactEmail: "merchant@test.com",
        businessType: "marketplace",
        phone: "+1-555-000-1111",
        website: "https://merchant.test",
      };

      const res = await chai.request(app).post("/merchants").send(merchantData);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property("merchantId");
      expect(res.body.status).to.equal("pending");
      expect(res.body.message).to.equal("Merchant registration submitted successfully.");

      merchantId = res.body.merchantId; // Save for other tests
    });

    it("should return 400 if required fields are missing", async () => {
      const res = await chai.request(app).post("/merchants").send({});
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });

  describe("PATCH /merchants/:merchantId", () => {
    it("should update merchant info partially", async () => {
      const updates = {
        name: "Updated Merchant Name",
        phone: "+1-555-999-8888",
      };

      const res = await chai.request(app).patch(`/merchants/${merchantId}`).send(updates);
      expect(res).to.have.status(200);
      expect(res.body.merchantId).to.equal(merchantId);
      expect(res.body.message).to.equal("Merchant updated successfully.");
    });

    it("should return 404 for unknown merchant", async () => {
      const res = await chai.request(app).patch("/merchants/nonexistent").send({ name: "X" });
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("POST /merchants/:merchantId/kyc", () => {
    it("should submit KYC documents", async () => {
      const kycDocs = {
        documents: [
          {
            documentType: "business_license",
            documentUrl: "https://example.com/license.pdf",
          },
        ],
      };

      const res = await chai.request(app).post(`/merchants/${merchantId}/kyc`).send(kycDocs);
      expect(res).to.have.status(200);
      expect(res.body.merchantId).to.equal(merchantId);
      expect(res.body.kycStatus).to.equal("submitted");
      expect(res.body.message).to.equal("KYC documents received and under review.");
    });

    it("should return 404 for unknown merchant", async () => {
      const res = await chai.request(app).post(`/merchants/unknown/kyc`).send({
        documents: [{ documentType: "id", documentUrl: "url" }],
      });
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("POST /merchants/:merchantId/account-link", () => {
    it("should link bank account", async () => {
      const accountData = {
        bankAccountNumber: "1234567890",
        bankRoutingNumber: "111000025",
        accountHolderName: "Test Merchant",
      };

      const res = await chai.request(app).post(`/merchants/${merchantId}/account-link`).send(accountData);
      expect(res).to.have.status(200);
      expect(res.body.merchantId).to.equal(merchantId);
      expect(res.body).to.have.property("linkedAccountId");
      expect(res.body.message).to.equal("Bank account linked successfully.");
    });

    it("should return 400 if bank account fields missing", async () => {
      const res = await chai.request(app).post(`/merchants/${merchantId}/account-link`).send({});
      expect(res).to.have.status(400);
      expect(res.body).to.have.property("error");
    });
  });

  describe("GET /merchants/:merchantId/approval-status", () => {
    it("should get approval status", async () => {
      const res = await chai.request(app).get(`/merchants/${merchantId}/approval-status`);
      expect(res).to.have.status(200);
      expect(res.body.merchantId).to.equal(merchantId);
      expect(res.body).to.have.property("approvalStatus");
      expect(res.body).to.have.property("reviewedBy");
      expect(res.body).to.have.property("reviewedAt");
      expect(res.body).to.have.property("remarks");
    });

    it("should return 404 for unknown merchant", async () => {
      const res = await chai.request(app).get(`/merchants/unknown/approval-status`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });

  describe("DELETE /merchants/:merchantId", () => {
    it("should delete merchant", async () => {
      const res = await chai.request(app).delete(`/merchants/${merchantId}`);
      expect(res).to.have.status(200);
      expect(res.body.merchantId).to.equal(merchantId);
      expect(res.body.message).to.equal("Merchant deleted successfully.");
    });

    it("should return 404 for unknown merchant", async () => {
      const res = await chai.request(app).delete(`/merchants/nonexistent`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property("error");
    });
  });
});
