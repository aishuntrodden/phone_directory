require("dotenv").config();
const request = require("supertest");
const express = require("express");
const spamRoutes = require("../routes/spamRoutes");
const db_queries = require("../library/db_queries");

const app = express();
app.use(express.json());

jest.mock("../library/db_queries", () => ({
  findUserByPhoneNumber: jest.fn(),
  findContactByPhoneNumber: jest.fn(),
  setSpamStatus: jest.fn(),
}));

app.use("/spam", spamRoutes);

describe("Spam Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /spam/setSpam", () => {
    it("should set spam status for an existing user", async () => {
      const phoneNumber = "1234567890";
      const spamData = {
        phoneNumber: phoneNumber,
        spam: true,
      };

      const mockUser = {
        id: 1,
        name: "Test User",
      };

      db_queries.findUserByPhoneNumber.mockResolvedValue(mockUser);
      db_queries.setSpamStatus.mockResolvedValue({ success: true });

      const response = await request(app)
        .post("/spam/setSpam")
        .send(spamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(db_queries.findUserByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(db_queries.setSpamStatus).toHaveBeenCalledWith({
        spam: true,
        userId: mockUser.id,
        phoneNumber: phoneNumber,
      });
    });

    it("should set spam status for an existing contact", async () => {
      const phoneNumber = "1234567890";
      const spamData = {
        phoneNumber: phoneNumber,
        spam: true,
      };

      const mockContact = {
        id: 1,
        name: "Test Contact",
      };

      db_queries.findUserByPhoneNumber.mockResolvedValue(null);
      db_queries.findContactByPhoneNumber.mockResolvedValue(mockContact);
      db_queries.setSpamStatus.mockResolvedValue({ success: true });

      const response = await request(app)
        .post("/spam/setSpam")
        .send(spamData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(db_queries.findContactByPhoneNumber).toHaveBeenCalledWith(phoneNumber);
      expect(db_queries.setSpamStatus).toHaveBeenCalledWith({
        spam: true,
        contactId: mockContact.id,
        phoneNumber: phoneNumber,
      });
    });

    it("should set spam status for a new contact", async () => {
      const phoneNumber = "1234567890";
      const spamData = {
        phoneNumber: phoneNumber,
        spam: true,
      };

      db_queries.findUserByPhoneNumber.mockResolvedValue(null);
      db_queries.findContactByPhoneNumber.mockResolvedValue(null);
      db_queries.setSpamStatus.mockResolvedValue({ success: true });

      const response = await request(app)
        .post("/spam/setSpam")
        .send(spamData)
        .expect(200);

      expect(response.body.message).toBe("Contact spam status updated");
      expect(db_queries.setSpamStatus).toHaveBeenCalledWith({
        spam: true,
        phoneNumber: phoneNumber,
      });
    });

    it("should handle errors gracefully", async () => {
      const phoneNumber = "1234567890";
      const spamData = {
        phoneNumber: phoneNumber,
        spam: true,
      };

      db_queries.findUserByPhoneNumber.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/spam/setSpam")
        .send(spamData)
        .expect(500);

      expect(response.body.error).toBe("Database error");
    });
  });
});
