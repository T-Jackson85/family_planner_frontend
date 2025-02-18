import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EventForm from "./EventForm";
import api from "../../api/api";
import userEvent from "@testing-library/user-event";

// Mock API module
jest.mock("../../api/api");

describe("EventForm Component", () => {
  beforeEach(() => {
    api.get.mockClear();
    api.post.mockClear();
    api.put.mockClear();
  });

  // ✅ **Smoke Test: Ensures Component Renders Without Crashing**
  test("renders EventForm without crashing", () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/Create Event/i)).toBeInTheDocument();
  });

  // ✅ **Test Form Fields Exist**
  test("renders form input fields", () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tasks/i)).toBeInTheDocument();
  });

  // ✅ **Test Input Change Events**
  test("updates input fields on change", () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    const locationInput = screen.getByLabelText(/Location/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(titleInput, { target: { value: "Birthday Party" } });
    fireEvent.change(locationInput, { target: { value: "New York" } });
    fireEvent.change(descriptionInput, { target: { value: "Celebrating John's birthday" } });

    expect(titleInput.value).toBe("Birthday Party");
    expect(locationInput.value).toBe("New York");
    expect(descriptionInput.value).toBe("Celebrating John's birthday");
  });

  // ✅ **Test Adding Expenses**
  test("adds an expense when clicking 'Add Expense'", async () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    const expenseDescInput = screen.getByPlaceholderText("Description");
    const expenseAmountInput = screen.getByPlaceholderText("Amount");
    const addExpenseButton = screen.getByText(/Add Expense/i);

    fireEvent.change(expenseDescInput, { target: { value: "Cake" } });
    fireEvent.change(expenseAmountInput, { target: { value: "50" } });
    fireEvent.click(addExpenseButton);

    await waitFor(() => {
      expect(screen.getByText("Cake: $50.00")).toBeInTheDocument();
    });
  });

  // ✅ **Test Removing Expenses**
  test("removes an expense when clicking 'Remove'", async () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    const expenseDescInput = screen.getByPlaceholderText("Description");
    const expenseAmountInput = screen.getByPlaceholderText("Amount");
    const addExpenseButton = screen.getByText(/Add Expense/i);

    fireEvent.change(expenseDescInput, { target: { value: "Cake" } });
    fireEvent.change(expenseAmountInput, { target: { value: "50" } });
    fireEvent.click(addExpenseButton);

    await waitFor(() => {
      expect(screen.getByText("Cake: $50.00")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Remove/i));

    await waitFor(() => {
      expect(screen.queryByText("Cake: $50.00")).not.toBeInTheDocument();
    });
  });

  // ✅ **Test Successful Event Creation**
  test("submits form and creates a new event", async () => {
    api.post.mockResolvedValueOnce({ data: { id: 1 } });

    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Dinner Party" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2024-12-31T18:00" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "Los Angeles" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/events",
        expect.objectContaining({ title: "Dinner Party", location: "Los Angeles" }),
        expect.any(Object)
      );
    });
  });

  // ✅ **Test Event Editing**
  test("loads existing event data when editing", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        title: "Family Gathering",
        date: "2024-12-15T15:00:00.000Z",
        location: "Chicago",
        description: "Yearly family meetup",
        tasks: [{ title: "Buy gifts" }],
        expenses: [{ description: "Food", amount: 100 }],
      },
    });

    render(
      <MemoryRouter initialEntries={["/events/1"]}>
        <Routes>
          <Route path="/events/:id" element={<EventForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Family Gathering")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Chicago")).toBeInTheDocument();
      expect(screen.getByText("Food: $100.00")).toBeInTheDocument();
    });
  });

  // ✅ **Test Error Handling**
  test("displays error when event creation fails", async () => {
    api.post.mockRejectedValueOnce(new Error("Failed to create event"));

    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "Dinner Party" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText(/An error occurred while saving the event/i)).toBeInTheDocument();
    });
  });

  // ✅ **Test Navigation to Homepage**
  test("navigates to homepage when clicking 'Cancel'", () => {
    render(
      <MemoryRouter>
        <EventForm />
      </MemoryRouter>
    );

    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);
  });
});
