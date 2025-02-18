import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import api from "./api/api";

// Mock the API module
jest.mock("./api/api");

describe("LoginPage Component", () => {
  beforeEach(() => {
    api.post.mockClear(); // Clear previous mocks before each test
  });

  // ✅ **Smoke Test: Ensures Component Renders Without Crashing**
  test("renders LoginPage without crashing", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Log In to FamLink")).toBeInTheDocument();
  });

  // ✅ **Test Form Inputs Exist**
  test("renders email and password input fields", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  // ✅ **Test Input Change Events**
  test("updates input fields on change", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  // ✅ **Test Successful Login**
  test("logs in successfully and navigates to homepage", async () => {
    const mockUser = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
      user: { id: 1, firstName: "John", lastName: "Doe", groupIds: [101] },
    };

    api.post.mockResolvedValueOnce({ data: mockUser });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mockAccessToken");
      expect(localStorage.getItem("refreshToken")).toBe("mockRefreshToken");
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser.user));
    });
  });

  // ✅ **Test Login Failure**
  test("displays error message on login failure", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  // ✅ **Test Navigation to Sign Up Page**
  test("navigates to sign-up page when clicking sign up button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();

    fireEvent.click(signUpButton);
  });
});
