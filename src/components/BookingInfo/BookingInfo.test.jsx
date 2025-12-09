import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import BookingInfo from "./BookingInfo";
import Booking from "../../views/Booking";
import { MemoryRouter } from "react-router-dom";

describe("BookingInfo", () => {
  // 1.Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem.
  it("should work for the user to pic time and date", async () => {
    const user = userEvent.setup();
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const dateInput = screen.getByLabelText("Date");
    await user.type(dateInput, "2025-05-05");
    const timeInput = screen.getByLabelText("Time");
    await user.type(timeInput, "11:30");

    expect(mockUpdate).toHaveBeenCalled();
    expect(dateInput).toHaveValue("2025-05-05");
    expect(timeInput).toHaveValue("11:30");
  });
  // 2.Användaren ska kunna ange antal spelare (minst 1 spelare).
  // . VAR FEL SÅ : Du kan fortfarande testa att man ska kunna ange spelare..DEN SKA JA GÅ EFTER!
  it("should BE ABLE for the user to select a player", async () => {
    const user = userEvent.setup();
    const mockUpdate = vi.fn();
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    await user.type(peopleInput, "1");

    expect(mockUpdate).toHaveBeenCalled();
    expect(peopleInput).toHaveValue(1);
  });
});
