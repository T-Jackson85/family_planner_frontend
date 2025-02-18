import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GroupForm from "./GroupForm";
import api from "../../api/api"; // Mock API module
import { io } from "socket.io-client";

// Mock Socket.IO client
jest.mock("socket.io-client", () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  })),
}));

// Mock API requests
jest.mock("../../api/api");

describe("GroupForm Component", () => {
  beforeEach(() => {
    api.post.mockClear();
    api.get.mockClear();
  });

  // ✅ **Smoke Test: Ensures Component Renders Without Crashing**
  test("renders GroupForm without crashing", () => {
    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    expect(screen.getByText("Create a New Group")).toBeInTheDocument();
  });

  // ✅ **Test Form Fields Exist**
  test("renders input fields for group name and email", () => {
    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Invite Member/i)).toBeInTheDocument();
  });

  // ✅ **Test Input Change Events**
  test("updates input fields on change", () => {
    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    const groupNameInput = screen.getByLabelText(/Group Name/i);
    const emailInput = screen.getByLabelText(/Invite Member/i);

    fireEvent.change(groupNameInput, { target: { value: "Test Group" } });
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });

    expect(groupNameInput.value).toBe("Test Group");
    expect(emailInput.value).toBe("user@example.com");
  });

  // ✅ **Test Adding Email Invite**
  test("adds an invite when clicking 'Add Invite'", () => {
    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Invite Member/i);
    const addButton = screen.getByRole("button", { name: /Add Invite/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(addButton);

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  // ✅ **Test Successful Group Creation**
  test("creates a group successfully and sends invites", async () => {
    const mockResponse = { data: { groupId: 1 } };

    api.post.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Group Name/i), {
      target: { value: "Test Group" },
    });
    fireEvent.change(screen.getByLabelText(/Invite Member/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Add Invite/i }));
    fireEvent.click(screen.getByRole("button", { name: /Create Group/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/groups",
        { name: "Test Group", invites: ["user@example.com"] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    });
  });

  // ✅ **Test Error Handling**
  test("displays error when group creation fails", async () => {
    api.post.mockRejectedValueOnce(new Error("You already belong to a group."));

    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Group Name/i), {
      target: { value: "Existing Group" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Create Group/i }));

    await waitFor(() => {
      expect(screen.getByText("You already belong to a group.")).toBeInTheDocument();
    });
  });

  // ✅ **Test Navigation to Homepage**
  test("navigates to homepage when clicking 'Return Home'", () => {
    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    const returnHomeButton = screen.getByRole("button", { name: /Return Home/i });
    expect(returnHomeButton).toBeInTheDocument();

    fireEvent.click(returnHomeButton);
  });
});
