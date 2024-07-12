require("dotenv").config();
const request = require("supertest");
const express = require("express");
const contactRoutes = require("../routes/contactRoutes");
const db_queries = require("../library/db_queries");
const Contact = require("../db_models/contactModel");
const generateRandomPhoneNumber = require("../library/util").generateRandomNumber;

const app = express();
app.use(express.json());

jest.mock("../db_models/contactModel", () => ({
    create: jest.fn(),
    findAll: jest.fn(),
  }));
const mockUserId = 1;

app.use((req, res, next) => {
  req.userId = mockUserId;
  next();
});

app.use("/contact", contactRoutes);

describe("Contact Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /contact/createContact", () => {
    it("should create a new contact", async () => {
      const newContactData = {
        name: "Test Doe 11",
        phoneNumber: generateRandomPhoneNumber().toString(),
      };

      const mockNewContact = {
        ...newContactData,
        userId: mockUserId,
      };

      Contact.create.mockResolvedValue(mockNewContact);

      const response = await request(app)
        .post("/contact/createContact")
        .send(newContactData)
        .expect(201);

      expect(response.body.name).toBe(newContactData.name);
      expect(response.body.phoneNumber).toBe(newContactData.phoneNumber);
      expect(response.body.userId).toBe(mockUserId);

      expect(Contact.create).toHaveBeenCalledWith({
        ...newContactData,
        userId: mockUserId,
      });
    });
  });

  describe("GET /contact/getAllContacts", () => {
    it("should fetch all contacts", async () => {
      const mockContacts = [
        { name: "test_contact1", phoneNumber: "1234567890", userId: mockUserId },
        { name: "test_contact2", phoneNumber: "0987654321", userId: mockUserId },
      ];

      Contact.findAll.mockResolvedValue(mockContacts);

      const response = await request(app)
        .get("/contact/getAllContacts")
        .expect(201);

      expect(response.body).toEqual(mockContacts);
    });
  });
});
