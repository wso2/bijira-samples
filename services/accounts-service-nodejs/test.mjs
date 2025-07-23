import chai from "chai";
import chaiHttp from "chai-http";
import app from "./app.mjs";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Accounts API", () => {
  // Sample account data for testing
  const sampleAccount = {
    customerId: "TEST123",
    name: "Test User",
    email: "test.user@example.com",
    phone: "555-0000",
    address: "100 Test Street",
    accountType: "savings",
    balance: 1000,
    status: "active",
  };

  describe("POST /accounts", () => {
    it("should create a new account", async () => {
      const res = await chai.request(app).post("/accounts").send(sampleAccount);

      expect(res).to.have.status(201);
      expect(res.body).to.include(sampleAccount);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("createdAt");
    });

    it("should return 400 if required fields are missing", async () => {
      const invalidAccount = { ...sampleAccount };
      delete invalidAccount.name; // remove a required field

      const res = await chai.request(app).post("/accounts").send(invalidAccount);

      expect(res).to.have.status(400);
      expect(res.body.error).to.match(/name is required/i);
    });

    it("should return 400 if accountType is invalid", async () => {
      const invalidAccount = { ...sampleAccount, accountType: "invalid_type" };

      const res = await chai.request(app).post("/accounts").send(invalidAccount);

      expect(res).to.have.status(400);
      expect(res.body.error).to.match(/accountType must be one of/i);
    });

    it("should return 400 if status is invalid", async () => {
      const invalidAccount = { ...sampleAccount, status: "invalid_status" };

      const res = await chai.request(app).post("/accounts").send(invalidAccount);

      expect(res).to.have.status(400);
      expect(res.body.error).to.match(/status must be one of/i);
    });
  });

  describe("GET /accounts", () => {
    it("should return an array of accounts", async () => {
      const res = await chai.request(app).get("/accounts");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      // Optionally: check for at least one account
      expect(res.body.length).to.be.gte(1);
    });
  });

  describe("GET /accounts/:id", () => {
    it("should return an account by ID", async () => {
      // Create an account first
      const createRes = await chai.request(app).post("/accounts").send(sampleAccount);

      const res = await chai.request(app).get(`/accounts/${createRes.body.id}`);

      expect(res).to.have.status(200);
      expect(res.body).to.include(sampleAccount);
      expect(res.body.id).to.equal(createRes.body.id);
    });

    it("should return 400 for invalid ID", async () => {
      const res = await chai.request(app).get("/accounts/abc");

      expect(res).to.have.status(400);
      expect(res.body.error).to.match(/invalid account id/i);
    });

    it("should return 404 if account not found", async () => {
      const res = await chai.request(app).get("/accounts/9999999");

      expect(res).to.have.status(404);
      expect(res.body.error).to.match(/account not found/i);
    });
  });

  describe("PUT /accounts/:id", () => {
    it("should update an existing account", async () => {
      // Create an account first
      const createRes = await chai.request(app).post("/accounts").send(sampleAccount);

      const updatedData = {
        name: "Updated User",
        balance: 5000,
      };

      const res = await chai.request(app).put(`/accounts/${createRes.body.id}`).send(updatedData);

      expect(res).to.have.status(200);
      expect(res.body.name).to.equal(updatedData.name);
      expect(res.body.balance).to.equal(updatedData.balance);
      expect(res.body.id).to.equal(createRes.body.id);
    });

    it("should return 400 for invalid ID", async () => {
      const res = await chai.request(app).put("/accounts/abc").send({ name: "Name" });

      expect(res).to.have.status(400);
      expect(res.body.error).to.match(/invalid account id/i);
    });

    it("should return 404 if account not found", async () => {
      const res = await chai.request(app).put("/accounts/9999999").send({ name: "Name" });

      expect(res).to.have.status(404);
      expect(res.body.error).to.match(/account not found/i);
    });
  });

  describe("DELETE /accounts/:id", () => {
    it("should delete an existing account", async () => {
      // Create an account first
      const createRes = await chai.request(app).post("/accounts").send(sampleAccount);

      const res = await chai.request(app).delete(`/accounts/${createRes.body.id}`);

      expect(res).to.have.status(200);
      expect(res.body.message).to.match(/deleted/i);

      // Verify deleted
      const getRes = await chai.request(app).get(`/accounts/${createRes.body.id}`);
      expect(getRes).to.have.status(404);
    });

    it("should return 400 for invalid ID", async () => {
      const res = await chai.request(app).delete("/accounts/abc");

      expect(res).to.have.status(400);
      expect(res.body.error).to.match(/invalid account id/i);
    });

    it("should return 404 if account not found", async () => {
      const res = await chai.request(app).delete("/accounts/9999999");

      expect(res).to.have.status(404);
      expect(res.body.error).to.match(/account not found/i);
    });
  });
});
