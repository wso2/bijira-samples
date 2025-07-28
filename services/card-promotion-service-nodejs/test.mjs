import chai from "chai";
import chaiHttp from "chai-http";
import app from "./app.mjs";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Card Promotions API", () => {
  describe("GET /promotions", () => {
    it("should return all card promotions", async () => {
      const res = await chai.request(app).get("/promotions");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  describe("GET /promotions/filter", () => {
    it("should filter promotions by card_type", async () => {
      const res = await chai.request(app).get("/promotions/filter").query({ card_type: "Visa" });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      res.body.forEach(promo => {
        expect(promo.card_type.toLowerCase()).to.equal("visa");
      });
    });

    it("should filter promotions by category", async () => {
      const res = await chai.request(app).get("/promotions/filter").query({ category: "Dining" });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      res.body.forEach(promo => {
        expect(promo.category.toLowerCase()).to.equal("dining");
      });
    });

    it("should filter promotions by company_name", async () => {
      const res = await chai.request(app).get("/promotions/filter").query({ company_name: "CoffeeCorner" });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      res.body.forEach(promo => {
        expect(promo.company_name.toLowerCase()).to.include("coffeecorner");
      });
    });

    it("should filter promotions active on a specific date", async () => {
      const res = await chai.request(app).get("/promotions/filter").query({ active_on: "2025-07-27" });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");

      const testDate = new Date("2025-07-27");
      res.body.forEach(promo => {
        const start = new Date(promo.validity.start_date);
        const end = new Date(promo.validity.end_date);
        expect(testDate >= start && testDate <= end).to.be.true;
      });
    });

    it("should return empty array for unmatched filters", async () => {
      const res = await chai.request(app).get("/promotions/filter").query({
        card_type: "MasterCard",
        category: "Pets"
      });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.is.empty;
    });

    it("should support multiple filters together", async () => {
      const res = await chai.request(app).get("/promotions/filter").query({
        card_type: "Amex",
        category: "Travel & Hotels"
      });

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      res.body.forEach(promo => {
        expect(promo.card_type.toLowerCase()).to.equal("amex");
        expect(promo.category.toLowerCase()).to.equal("travel & hotels");
      });
    });
  });
});
