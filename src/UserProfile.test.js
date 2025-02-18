import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserProfile from "./UserProfile";
import api from "./api/api";
import userEvent from "@testing-library/user-event";

// Mock API module
jest.mock("./api/api");

describe("UserProfile Component", () => {
  beforeEach(() => {
    api.get.mockClear();
    api.put.mockClear();
    api.post.mockClear();
  });

  // ✅ **Smoke Test: Ensures Component Renders Without Crashing**
  test("renders UserProfile without crashing", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [],
      },
    });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    expect(await screen.findByText(/User Profile/i)).toBeInTheDocument();
  });

  // ✅ **Test Form Fields Exist**
  test("renders form input fields", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [],
      },
    });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    expect(await screen.findByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  });

  // ✅ **Test Input Change Events**
  test("updates input fields on change", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [],
      },
    });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    const firstNameInput = await screen.findByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const phoneInput = screen.getByLabelText(/Phone/i);
    const locationInput = screen.getByLabelText(/Location/i);

    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Smith" } });
    fireEvent.change(phoneInput, { target: { value: "987654321" } });
    fireEvent.change(locationInput, { target: { value: "Los Angeles" } });

    expect(firstNameInput.value).toBe("Jane");
    expect(lastNameInput.value).toBe("Smith");
    expect(phoneInput.value).toBe("987654321");
    expect(locationInput.value).toBe("Los Angeles");
  });

  // ✅ **Test Successful Profile Update**
  test("submits form and updates user profile", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [],
      },
    });

    api.put.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    fireEvent.change(await screen.findByLabelText(/First Name/i), {
      target: { value: "Jane" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "http://localhost:5000/api/update",
        expect.objectContaining({ firstName: "Jane" })
      );
    });
  });

  // ✅ **Test Avatar Upload**
  test("uploads avatar successfully", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [],
      },
    });

    api.post.mockResolvedValueOnce({ data: { avatar: "/uploads/avatar.jpg" } });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    const fileInput = await screen.findByLabelText(/file/i);
    const file = new File(["dummy-content"], "avatar.jpg", { type: "image/jpg" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Upload Picture/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });

  // ✅ **Test Leaving Group**
  test("leaves a group when clicking 'Leave Group'", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [1],
      },
    });

    api.put.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: /Leave Group/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });
  });

  // ✅ **Test Error Handling**
  test("displays error when profile update fails", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123456789",
        location: "New York",
        avatar: "/avatar.jpg",
        groupIds: [],
      },
    });

    api.put.mockRejectedValueOnce(new Error("Profile update failed"));

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error updating profile/i)).toBeInTheDocument();
    });
  });

  // ✅ **Test Navigation**
  test("navigates back to homepage when clicking 'Cancel'", async () => {
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: /Cancel/i }));
  });
});
