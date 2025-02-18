import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Ensure Router is wrapped
import App from "./App";

test("renders homepage", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Ensure that a key element from App renders
  const homepageElement = screen.getByText(/My Events/i); // Adjust text based on App
  expect(homepageElement).toBeInTheDocument();
});
