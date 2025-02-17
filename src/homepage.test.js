import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Homepage from "./homepage"; // Adjust path as needed
import api from "./api/api"; // Mock API calls
import dayjs from "dayjs";

// Mock API Responses
jest.mock("./api/api");

describe("Homepage Component", () => {
  beforeEach(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ firstName: "John", lastName: "Doe", groupIds: [1] })
    );
    localStorage.setItem("token", "mockToken");
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders homepage with navbar", async () => {
    api.get.mockResolvedValueOnce({ data: [] }); // Mock empty events response

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    expect(screen.getByText("FamLink")).toBeInTheDocument();
    expect(screen.getByText("Welcome, John Doe!")).toBeInTheDocument();
    expect(screen.getByText("My Group")).toBeInTheDocument();
    expect(screen.getByText("Create Event")).toBeInTheDocument();
  });

  test("fetches and displays events", async () => {
    const mockEvents = [
      { id: 1, title: "Birthday Party", date: "2024-02-15T18:00:00Z" },
    ];
    api.get.mockResolvedValueOnce({ data: mockEvents });

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalled());

    expect(screen.getByText("Birthday Party")).toBeInTheDocument();
  });

  test("updates selected event on date change", async () => {
    const mockEvents = [
      {
        id: 1,
        title: "Family Meeting",
        date: dayjs().format("YYYY-MM-DD"),
        comments: [],
      },
    ];

    api.get.mockResolvedValueOnce({ data: mockEvents }); // Mock event API
    api.get.mockResolvedValueOnce({ data: [] }); // Mock tasks
    api.get.mockResolvedValueOnce({ data: [] }); // Mock expenses

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalled());

    // Click on the calendar to change the date
    const calendarDays = screen.getAllByRole("button");
    fireEvent.click(calendarDays[5]); // Click on a date

    await waitFor(() =>
      expect(screen.getByText("Family Meeting")).toBeInTheDocument()
    );
  });

  test("allows posting a comment", async () => {
    const mockEvent = {
      id: 1,
      title: "Picnic",
      date: "2024-02-20",
      comments: [],
    };

    api.get.mockResolvedValueOnce({ data: [mockEvent] }); // Fetch events
    api.post.mockResolvedValueOnce({
      data: { id: 2, content: "Excited for this!", user: { firstName: "Jane" } },
    });

    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>
    );

    await waitFor(() => expect(api.get).toHaveBeenCalled());

    const commentInput = screen.getByPlaceholderText("Add a comment");
    fireEvent.change(commentInput, { target: { value: "Excited for this!" } });

    const postButton = screen.getByText("Post Comment");
    fireEvent.click(postButton);

    await waitFor(() => expect(api.post).toHaveBeenCalled());

    expect(screen.getByText("Excited for this!")).toBeInTheDocument();
  });
});
