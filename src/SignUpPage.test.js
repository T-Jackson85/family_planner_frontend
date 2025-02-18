import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import api from "./api/api";

// Mock the API module
jest.mock("./api/api");

describe("SignUpPage Component", () => {
  beforeEach(() => {
    api.post.mockClear(); // Clear previous mocks before each test
  });

  // ✅ **Smoke Test: Ensures Component Renders Without Crashing**
  test("renders SignUpPage without crashing", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
  });

  // ✅ **Test Required Fields**
  test("shows error message when required fields are empty", async () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
  });

  // ✅ **Test Password Mismatch**
  test("displays error if passwords do not match", async () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText("Passwords do not match.")).toBeInTheDocument();
  });

  // ✅ **Test Successful Registration**
  test("submits form and redirects on success", async () => {
    const mockUser = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    };

    api.post.mockResolvedValueOnce({ data: { user: mockUser } });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Registration successful! Redirecting...")).toBeInTheDocument();
    });
  });

  // ✅ **Test API Error Handling**
  test("displays error when API request fails", async () => {
    api.post.mockRejectedValueOnce({ response: { data: { message: "User already exists." } } });

    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "existinguser@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("User already exists.")).toBeInTheDocument();
    });
  });
});
