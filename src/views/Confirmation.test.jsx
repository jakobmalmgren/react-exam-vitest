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
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
  });
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
  //20. Om användaren navigerar till bekräftelsevyn och ingen bokning är
  //  gjord eller finns i session storage ska texten "Ingen bokning gjord visas".

  it("should show Ingen bokning gjord if no data is in the sessionstorrage", () => {
    sessionStorage.clear();
    vi.mocked(useLocation).mockReturnValue({ state: null });

    render(
      <MemoryRouter initialEntries={[{ pathname: "/confirmation" }]}>
        <Confirmation />
      </MemoryRouter>
    );

    screen.debug(); // se vad som faktiskt renderas

    expect(screen.getByText("Inga bokning gjord!")).toBeInTheDocument();
  });

  // 21. Om användaren navigerar till bekräftelsevyn och det finns en bokning
  // sparad i session storage ska denna visas.
  it("should show the booking if there are data in sessionStorage", () => {
    sessionStorage.clear();
    vi.mocked(useLocation).mockReturnValue({ state: null });

    const mockInfo = {
      when: "2025-12-08T18:00",
      people: 3,
      lanes: 1,
      bookingId: "ABC123",
      price: 360,
    };

    sessionStorage.setItem("confirmation", JSON.stringify(mockInfo));

    render(
      <MemoryRouter initialEntries={[{ pathname: "/confirmation" }]}>
        <Confirmation />
      </MemoryRouter>
    );

    screen.debug();

    expect(screen.getByDisplayValue("2025-12-08 18:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ABC123")).toBeInTheDocument();
    expect(screen.getByText("360 sek")).toBeInTheDocument();
  });
});
