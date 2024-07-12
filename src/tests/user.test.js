require("dotenv").config();

const request = require("supertest");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = require("../routes/userRoutes");
const db_queries = require("../library/db_queries");
const generateRandomPhoneNumber =
  require("../library/util").generateRandomNumber;

const randomNumber = generateRandomPhoneNumber().toString();

jest.mock("../library/db_queries");

const app = express();
app.use(express.json());
app.use("/", router);

describe("POST /register", () => {
  it("should register a new user", async () => {
    const newUser = {
      name: "Test User",
      phoneNumber: randomNumber,
      email: "john.doe@example.com",
      password: "password123",
    };
    db_queries.createUser.mockResolvedValue(newUser);
    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(201);

    expect(response.body.message).toEqual("User registered successfully");
    expect(response.body.user).toEqual(newUser);
    expect(db_queries.createUser).toHaveBeenCalledWith(newUser);
  });
  it("should handle errors during registration", async () => {
    const newUser = {
      name: "Jane Doe",
      phoneNumber: "0987654321",
      email: "jane.doe@example.com",
      password: "password456",
    };

    const errorMessage = "Database connection failed";
    db_queries.createUser.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app)
      .post("/register")
      .send(newUser)
      .expect(500);
    expect(response.body).toEqual({
      Error: errorMessage,
    });

    expect(db_queries.createUser).toHaveBeenCalledWith(newUser);
    jest.clearAllMocks();
  });
  it("should login a user successfully", async () => {
    const mockUser = {
      phoneNumber: randomNumber,
      password: "password123",
    };

    const mockUserObject = {
      dataValues: { id: "mockUserId" },
      isValidPassword: jest.fn().mockResolvedValue(true),
    };
    db_queries.findUserByPhoneNumber.mockResolvedValue(mockUserObject);

    const mockToken = "mock.token.string";
    jwt.sign = jest.fn().mockReturnValue(mockToken);

    const response = await request(app)
      .post("/login")
      .send(mockUser)
      .expect(201);

    expect(response.body.token).toEqual(mockToken);
    expect(db_queries.findUserByPhoneNumber).toHaveBeenCalledWith(
      mockUser.phoneNumber
    );

    expect(mockUserObject.isValidPassword).toHaveBeenCalledWith(
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockUserObject.dataValues.id },
      process.env.JWT_TOKEN,
      { expiresIn: process.env.TOKEN_EXPIRE_TIME }
    );
  });
  it("should handle login failure if user is not found", async () => {
    const mockUser = {
      phoneNumber: randomNumber,
      password: "password123",
    };

    db_queries.findUserByPhoneNumber.mockResolvedValue(null); // Simulate user not found

    const response = await request(app)
      .post("/login")
      .send(mockUser)
      .expect(401); // Expect HTTP response status 401 Unauthorized

    expect(response.body.error).toEqual("User not found");
    expect(db_queries.findUserByPhoneNumber).toHaveBeenCalledWith(
      mockUser.phoneNumber
    );
  });

  it("should handle login failure if password is incorrect", async () => {
    const mockUser = {
      phoneNumber: randomNumber,
      password: "incorrectPassword",
    };

    const mockUserObject = {
      isValidPassword: jest.fn().mockResolvedValue(false),
    };
    db_queries.findUserByPhoneNumber.mockResolvedValue(mockUserObject);

    const response = await request(app)
      .post("/login")
      .send(mockUser)
      .expect(401);

    expect(response.body.error).toEqual("Invalid password");
    expect(db_queries.findUserByPhoneNumber).toHaveBeenCalledWith(
      mockUser.phoneNumber
    );
    expect(mockUserObject.isValidPassword).toHaveBeenCalledWith(
      mockUser.password
    );
  });

  it("should handle errors during login", async () => {
    const mockUser = {
      phoneNumber: randomNumber,
      password: "password123",
    };

    const errorMessage = "Database connection failed";
    db_queries.findUserByPhoneNumber.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const response = await request(app)
      .post("/login")
      .send(mockUser)
      .expect(500);

    expect(response.body).toEqual({
      error: `Login Failed: ${errorMessage}`,
    });

    expect(db_queries.findUserByPhoneNumber).toHaveBeenCalledWith(
      mockUser.phoneNumber
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {});
