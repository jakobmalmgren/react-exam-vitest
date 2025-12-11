import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Confirmation from "./Confirmation";
import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
/// kolla upp detta!!!!
// hur de verkligen kallar på uselocation..
// också om objektet...varför de blrir som de blir!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Importerar react-router-dom
  return {
    ...actual, // Behåll alla andra exports
    useLocation: vi.fn(), // Mocka useLocation för att kunna styra data
  };
});

describe("Confirmation", () => {
  //17. Systemet ska beräkna och visa den totala summan för
  //  bokningen baserat på antalet spelare (120 kr per person)
  // samt antalet reserverade banor (100 kr per bana).
  // &
  //18. Den totala summan ska visas tydligt på bekräftelsesidan
  //  och inkludera en uppdelning mellan spelare och banor.
  it("should calcultate and show the total amount correct plus amount of reservated lanes AND also see that players and lanes info are there", () => {
    const mockBooking = {
      state: {
        confirmationDetails: {
          when: "2025-05-30T18:00",
          people: 3,
          lanes: 2,
          shoes: ["40", "41", "42"],
          bookingId: "ABC123",
          price: 3 * 120 + 2 * 100, // = 560 kr
        },
      },
    };
    vi.mocked(useLocation).mockReturnValue(mockBooking);
    render(
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );
    console.log("debuuuug");
    screen.debug();

    expect(screen.getByText("560 sek")).toBeInTheDocument();

    const lanes = screen.getByTestId("lanes-input");
    const people = screen.getByTestId("people-input");
    expect(lanes).toBeInTheDocument();
    expect(lanes).toHaveValue("2");
    expect(people).toBeInTheDocument();
    expect(people).toHaveValue("3");
  });
});
