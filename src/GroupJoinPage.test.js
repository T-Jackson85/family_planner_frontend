import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GroupJoinPage from "./GroupJoinPage";
import api from "./api/api";
import userEvent from "@testing-library/user-event";

// Mock API module
jest.mock("./api/api");

describe("GroupJoinPage Component", () => {
  const mockGroup = { id: 1, name: "Test Group" };

  beforeEach(() => {
    api.get.mockClear();
    api.put.mockClear();
  });

  // ✅ **Smoke Test: Ensures Component Renders Without Crashing**
  test("renders GroupJoinPage without crashing", async () => {
    api.get.mockResolvedValueOnce({ data: mockGroup });

    render(
      <MemoryRouter initialEntries={["/groups/1/join"]}>
        <Routes>
          <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Join Group: Test Group/i)).toBeInTheDocument();
  });

  // ✅ **Test API Call to Fetch Group Details**
  test("fetches and displays group details", async () => {
    api.get.mockResolvedValueOnce({ data: mockGroup });

    render(
      <MemoryRouter initialEntries={["/groups/1/join"]}>
        <Routes>
          <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Join Group: Test Group")).toBeInTheDocument();
  });

  // ✅ **Test Accepting Group Invitation**
  test("accepts group invitation successfully", async () => {
    api.get.mockResolvedValueOnce({ data: mockGroup });
    api.put.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter initialEntries={["/groups/1/join"]}>
        <Routes>
          <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />
        </Routes>
      </MemoryRouter>
    );

    const acceptButton = await screen.findByRole("button", { name: /Accept/i });
    userEvent.click(acceptButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "/groups/1/join",
        { status: "APPROVED" },
        expect.any(Object)
      );
    });
  });

  // ✅ **Test Rejecting Group Invitation**
  test("rejects group invitation successfully", async () => {
    api.get.mockResolvedValueOnce({ data: mockGroup });
    api.put.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter initialEntries={["/groups/1/join"]}>
        <Routes>
          <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />
        </Routes>
      </MemoryRouter>
    );

    const rejectButton = await screen.findByRole("button", { name: /Reject/i });
    userEvent.click(rejectButton);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        "/groups/1/join",
        { status: "REJECTED" },
        expect.any(Object)
      );
    });
  });

  // ✅ **Test Redirect if Group Not Found**
  test("redirects to inbox if group is not found", async () => {
    api.get.mockRejectedValueOnce(new Error("Group not found"));

    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={["/groups/999/join"]}>
        <Routes>
          <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/inbox");
    });
  });

  // ✅ **Test Error Handling on API Failure**
  test("shows error message if API call fails when joining group", async () => {
    api.get.mockResolvedValueOnce({ data: mockGroup });
    api.put.mockRejectedValueOnce(new Error("Error joining group"));

    render(
      <MemoryRouter initialEntries={["/groups/1/join"]}>
        <Routes>
          <Route path="/groups/:groupId/join" element={<GroupJoinPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole("button", { name: /Accept/i }));

    await waitFor(() => {
      expect(screen.getByText("Failed to join the group. Please try again.")).toBeInTheDocument();
    });
  });
});
