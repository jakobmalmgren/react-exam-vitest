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
  //   // 2.Användaren ska kunna ange antal spelare (minst 1 spelare).
  //göra sen kanske! behövdes ej
  //   it("should BE ABLE for the user to select to be atleast 1 player when other fields are written", async () => {
  //     const mockUpdate = vi.fn();
  //     const user = userEvent.setup();
  //     render(<BookingInfo updateBookingDetails={mockUpdate} />);

  //     const dateInput = screen.getByLabelText("Date");
  //     const timeInput = screen.getByLabelText("Time");
  //     const lanesInput = screen.getByLabelText("Number of lanes");
  //     const bowlersInput = screen.getByLabelText("Number of awesome bowlers");

  //     await user.type(dateInput, "2025-05-10");
  //     await user.type(timeInput, "14:00");
  //     await user.type(lanesInput, "1");
  //     await user.type(bowlersInput, "1");

  //     expect(dateInput).toHaveValue("2025-05-10");
  //     expect(timeInput).toHaveValue("14:00");
  //     expect(lanesInput).toHaveValue(1);
  //     expect(bowlersInput).toHaveValue(1);
  //     expect(mockUpdate).toHaveBeenCalled();

  //     const error = screen.queryByText(
  //       "    Antalet skor måste stämma överens med antal spelare"
  //     );
  //     expect(error).not.toBeInTheDocument();
  //   });
  //   it("should NOT BE ABLE for the user to select 0 player when other fields are written", async () => {
  //     const mockUpdate = vi.fn();
  //     const user = userEvent.setup();
  //     // render(BookingInfo updateBookingDetails={mockUpdate} />);

  //     render(
  //       <MemoryRouter>
  //         <Booking />
  //       </MemoryRouter>
  //     );

  //     const dateInput = screen.getByLabelText("Date");
  //     const timeInput = screen.getByLabelText("Time");
  //     const lanesInput = screen.getByLabelText("Number of lanes");
  //     const bowlersInput = screen.getByLabelText("Number of awesome bowlers");

  //     await user.type(dateInput, "2025-05-10");
  //     await user.type(timeInput, "14:00");
  //     await user.type(lanesInput, "1");
  //     await user.type(bowlersInput, "0");

  //     const button = screen.getByRole("button", { name: "strIIIIIike!" });

  //     await user.click(button);

  //     const error = await screen.findByText(
  //       /Antalet skor måste stämma överens med antal spelare/i
  //     );
  //     expect(error).toBeInTheDocument();
  //   });
});
