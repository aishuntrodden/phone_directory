require("dotenv").config();
const request = require("supertest");
const express = require("express");
const searchRoutes = require("../routes/searchRoutes");
const globalSearch = require("../library/search/globalSearch");
const SearchByName = require("../library/search/searchByName");
const searchByPhone = require("../library/search/searchByPhone");

const app = express();
app.use(express.json());

jest.mock("../library/search/globalSearch", () => ({
  search: jest.fn(),
}));

jest.mock("../library/search/searchByName", () => ({
  search: jest.fn(),
}));

jest.mock("../library/search/searchByPhone", () => ({
  search: jest.fn(),
}));

app.use("/search", searchRoutes);

describe("Search Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /search/globalSearch", () => {
    it("should return all users and contacts", async () => {
      const mockUsers = [
        { id: 1, name: "User 1", phoneNumber: "1234567890", spam: true },
        { id: 2, name: "User 2", phoneNumber: "0987654321", spam: false },
      ];
      const mockContacts = [
        { id: 1, name: "Contact 1", phoneNumber: "5551234567", spam: false },
      ];

      globalSearch.search.mockResolvedValue([...mockUsers, ...mockContacts]);

      const response = await request(app).get("/search/globalSearch").expect(201);

      expect(response.body.result.length).toBe(3);
      expect(response.body.result[0].name).toBe("User 1");
      expect(response.body.result[1].name).toBe("User 2");
      expect(response.body.result[0].phoneNumber).toBe("1234567890");
      expect(response.body.result[1].phoneNumber).toBe("0987654321");
      expect(response.body.result[2].name).toBe("Contact 1");
      expect(response.body.result[2].phoneNumber).toBe("5551234567");

      expect(globalSearch.search).toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      globalSearch.search.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/search/globalSearch").expect(500);

      expect(response.body.error).toBe("Database error");
    });
  });

  describe("POST /search/searchByName", () => {
    it("should return matches by name", async () => {
      const name = "Test";
      const mockResults = [
        { name: "Test User", phoneNumber: "1234567890", spam: false },
        { name: "Tester Contact", phoneNumber: "5559876543", spam: true },
      ];

      SearchByName.search.mockResolvedValue(mockResults);

      const response = await request(app)
        .post("/search/searchByName")
        .send({ name: name })
        .expect(201);

      expect(response.body.list.length).toBe(2);
      expect(response.body.list[0].name).toBe("Test User");
      expect(response.body.list[1].name).toBe("Tester Contact");
      expect(response.body.list[0].phoneNumber).toBe("1234567890");
      expect(response.body.list[1].phoneNumber).toBe("5559876543");

      expect(SearchByName.search).toHaveBeenCalledWith(name);
    });

    it("should handle errors gracefully", async () => {
      const name = "Test";
      SearchByName.search.mockRejectedValue(new Error("Name search error"));

      const response = await request(app)
        .post("/search/searchByName")
        .send({ name: name })
        .expect(500);

      expect(response.body.error).toBe("Name search error");
    });
  });

  describe("POST /search/searchByPhone", () => {
    it("should return matches by phone number", async () => {
      const phoneNumber = "1234567890";
      const mockResults = [
        { name: "Test User", phoneNumber: "1234567890", spam: false },
      ];

      searchByPhone.search.mockResolvedValue(mockResults);

      const response = await request(app)
        .post("/search/searchByPhone")
        .send({ phoneNumber: phoneNumber })
        .expect(201);

      expect(response.body.list.length).toBe(1);
      expect(response.body.list[0].name).toBe("Test User");
      expect(response.body.list[0].phoneNumber).toBe("1234567890");

      expect(searchByPhone.search).toHaveBeenCalledWith(phoneNumber);
    });

    it("should handle errors gracefully", async () => {
      const phoneNumber = "1234567890";
      searchByPhone.search.mockRejectedValue(new Error("Phone number search error"));

      const response = await request(app)
        .post("/search/searchByPhone")
        .send({ phoneNumber: phoneNumber })
        .expect(500);

      expect(response.body.error).toBe("Phone number search error");
    });
  });
});
