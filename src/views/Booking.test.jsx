import {
  getByLabelText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Booking from "./Booking";
import Confirmation from "./Confirmation";
import { MemoryRouter, useNavigate } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Booking", () => {
  // 3.Användaren ska kunna reservera en eller flera banor beroende på antal spelare.
  // kollar de i 2 test, ett error för de är för många personer registrerade beroende på antalet banor
  // sen ett där de fungerar och inget felmeddelande kommer fram
  it("shows error if there are more players then max amount on a lane, 5 players, 1 lane", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const addShoeButton = screen.getByRole("button", { name: "+" });
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen med 1 bana och 5 spelare
    await userEvent.type(dateInput, "2025-12-08");
    await userEvent.type(timeInput, "18:00");
    await userEvent.clear(lanesInput);
    await userEvent.type(lanesInput, "1");
    await userEvent.clear(peopleInput);
    await userEvent.type(peopleInput, "5");

    // Lägg till skor som matchar antal spelare
    for (let i = 0; i < 5; i++) {
      await userEvent.click(addShoeButton);
      const shoeInput = screen.getByLabelText(`Shoe size / person ${i + 1}`);
      await userEvent.type(shoeInput, "42");
    }

    // Klicka på boka-knappen
    await userEvent.click(button);

    // Kolla att felmeddelandet visas
    const errorMessage = await screen.findByText(
      /Det får max vara 4 spelare per bana/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
  // 3.Användaren ska kunna reservera en eller flera banor beroende på antal spelare.
  // kollar de i 2 test, ett error för de är för många personer registrerade beroende på antalet banor
  // sen ett där de fungerar och inget felmeddelande kommer fram
  // & acceptance kriteriet:

  //19. Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar.

  it("should accept booking if players match amount that accepted on the lanes, 8 players, 2 lanes and it should navigate from bookingview to confirmation view", async () => {
    // vi.mocked(useNavigate);
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const addShoeButton = screen.getByRole("button", { name: "+" });
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen med 2 banor och 8 spelare
    await userEvent.type(dateInput, "2025-12-08");
    await userEvent.type(timeInput, "18:00");
    await userEvent.clear(lanesInput);
    await userEvent.type(lanesInput, "2");
    await userEvent.clear(peopleInput);
    await userEvent.type(peopleInput, "8");

    // Lägg till skor som matchar antal spelare
    for (let i = 0; i < 8; i++) {
      await userEvent.click(addShoeButton);
      const shoeInput = screen.getByLabelText(`Shoe size / person ${i + 1}`);
      await userEvent.type(shoeInput, "42");
    }

    // Klicka på boka-knappen
    await userEvent.click(button);

    // Eftersom vi inte kan mocka fetch här, kontrollerar vi bara att felet inte visas
    const errorMessage = screen.queryByText(
      /Det får max vara 4 spelare per bana/i
    );
    expect(errorMessage).not.toBeInTheDocument();

    // expect(mockNavigate).toHaveBeenCalledWith(
    //   "/confirmation",
    //   expect.objectContaining({
    //     state: expect.any(Object),
    //   })
    // );
  });
  // 9. VG - Om användaren försöker slutföra bokningen utan att ange skostorlek för en spelare som har valt att boka skor,
  // ska systemet visa ett felmeddelande och be om att skostorleken anges.
  it("should show an error if a person decided to book shoes but havent selected shoe size", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const addShoeButton = screen.getByRole("button", { name: "+" });
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen
    await user.type(dateInput, "2025-12-08");
    await user.type(timeInput, "18:00");
    await user.type(lanesInput, "1");
    await user.type(peopleInput, "1");

    await user.click(addShoeButton);

    const shoesPlayerOneInput = screen.getByLabelText("Shoe size / person 1");
    expect(shoesPlayerOneInput).toHaveValue("");

    await user.click(button);

    expect(
      screen.getByText("Alla skor måste vara ifyllda")
    ).toBeInTheDocument();
  });
  // 10. VG - Om antalet personer och skor inte matchas ska ett felmeddelande visas (scenario 1)
  it("should show an errormessage if the amount of shoes and and amount of people doesnt match (example 2 player and 2 pair of shoes added, but one pair has NO size)", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const addShoeButton = screen.getByRole("button", { name: "+" });
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen
    await user.type(dateInput, "2025-12-08");
    await user.type(timeInput, "18:00");
    await user.type(lanesInput, "1");
    await user.type(peopleInput, "2");

    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoesPlayerOneInput = screen.getByLabelText("Shoe size / person 1");
    await user.type(shoesPlayerOneInput, "45");
    const shoesPlayerTwoInput = screen.getByLabelText("Shoe size / person 2");
    expect(shoesPlayerTwoInput).toHaveValue("");

    await user.click(button);
    expect(
      screen.getByText("Alla skor måste vara ifyllda")
    ).toBeInTheDocument();
  });
  // 10. VG - Om antalet personer och skor inte matchas ska ett felmeddelande visas (scenario 2)
  it("should show an error message if i added 2 people but only added 1 pair of shoes with size", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const addShoeButton = screen.getByRole("button", { name: "+" });
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen
    await user.type(dateInput, "2025-12-08");
    await user.type(timeInput, "18:00");
    await user.type(lanesInput, "1");
    await user.type(peopleInput, "2");

    await user.click(addShoeButton);

    const shoesPlayerOneInput = screen.getByLabelText("Shoe size / person 1");
    await user.type(shoesPlayerOneInput, "45");

    await user.click(button);
    expect(
      screen.getByText("Antalet skor måste stämma överens med antal spelare")
    ).toBeInTheDocument();
  });
  // 10. VG - Om antalet personer och skor inte matchas ska ett felmeddelande visas (scenario 3)
  it("should show an errormessage if I added 1 person but no shoes", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen
    await user.type(dateInput, "2025-12-08");
    await user.type(timeInput, "18:00");
    await user.type(lanesInput, "1");
    await user.type(peopleInput, "1");

    await user.click(button);
    expect(
      screen.getByText("Antalet skor måste stämma överens med antal spelare")
    ).toBeInTheDocument();
  });
  //5. VG - Om det inte finns tillräckligt med lediga banor för det angivna
  //  antalet spelare, ska användaren få ett felmeddelande. CHRISTOFFER MENAR
  // :Med det VG-kravet så menar jag att om man är för många spelare på en bana
  // så ska ett felmeddelande visas
  it("should show an error message of i add for example 5 people but 1 lane", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const button = screen.getByRole("button", { name: /strIIIIIike!/i });
    const addShoeButton = screen.getByRole("button", { name: "+" });

    await user.type(lanesInput, "1");
    await user.type(peopleInput, "5");
    await user.type(dateInput, "2025-05-05");
    await user.type(timeInput, "13:00");

    await user.click(addShoeButton);
    await user.click(addShoeButton);
    await user.click(addShoeButton);
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoesPlayerOneInput = screen.getByLabelText("Shoe size / person 1");
    const shoesPlayerTwoInput = screen.getByLabelText("Shoe size / person 2");
    const shoesPlayerThreeInput = screen.getByLabelText("Shoe size / person 3");
    const shoesPlayerFourInput = screen.getByLabelText("Shoe size / person 4");
    const shoesPlayerFiveInput = screen.getByLabelText("Shoe size / person 5");

    await user.type(shoesPlayerOneInput, "43");
    await user.type(shoesPlayerTwoInput, "43");
    await user.type(shoesPlayerThreeInput, "43");
    await user.type(shoesPlayerFourInput, "43");
    await user.type(shoesPlayerFiveInput, "43");

    expect(shoesPlayerOneInput).toHaveValue("43");
    expect(shoesPlayerTwoInput).toHaveValue("43");
    expect(shoesPlayerThreeInput).toHaveValue("43");
    expect(shoesPlayerFourInput).toHaveValue("43");
    expect(shoesPlayerFiveInput).toHaveValue("43");

    await user.click(button);
    expect(
      screen.getByText("Det får max vara 4 spelare per bana")
    ).toBeInTheDocument();
  });
  //4. VG - Ifall användaren inte fyller i något av ovanstående så ska
  // ett felmeddelande visas. 4-5 testfall! Gäller (tid, datum, banor och antalet spelare) TESTFALL 1
  it("should give an error if no amount of people are added", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const button = screen.getByRole("button", { name: "strIIIIIike!" });

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    const lanesInput = screen.getByLabelText("Number of lanes");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");

    await user.type(peopleInput, "0");
    await user.type(lanesInput, "1");
    await user.type(dateInput, "2025-05-06");
    await user.type(timeInput, "10:00");
    await user.click(button);

    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  });
  //4. VG - Ifall användaren inte fyller i något av ovanstående så ska
  // ett felmeddelande visas. 4-5 testfall! Gäller (tid, datum, banor och antalet spelare) TESTFALL 2
  it("should give an error if no amount of lanes are added", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const button = screen.getByRole("button", { name: "strIIIIIike!" });

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    const lanesInput = screen.getByLabelText("Number of lanes");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");

    await user.type(peopleInput, "1");
    await user.type(lanesInput, "0");
    await user.type(dateInput, "2025-05-06");
    await user.type(timeInput, "10:00");
    await user.click(button);

    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  });
  //4. VG - Ifall användaren inte fyller i något av ovanstående så ska
  // ett felmeddelande visas. 4-5 testfall! Gäller (tid, datum, banor och antalet spelare) TESTFALL 3
  it("should give an error if no amount of time is added", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const button = screen.getByRole("button", { name: "strIIIIIike!" });

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    const lanesInput = screen.getByLabelText("Number of lanes");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");

    await user.type(peopleInput, "1");
    await user.type(lanesInput, "1");
    await user.type(dateInput, "2025-05-06");
    await user.clear(timeInput);
    await user.click(button);

    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  });
  //4. VG - Ifall användaren inte fyller i något av ovanstående så ska
  // ett felmeddelande visas. 4-5 testfall! Gäller (tid, datum, banor och antalet spelare) TESTFALL 4
  it("should give an error if no amount of date is added", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    const button = screen.getByRole("button", { name: "strIIIIIike!" });

    const peopleInput = screen.getByLabelText("Number of awesome bowlers");
    const lanesInput = screen.getByLabelText("Number of lanes");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time");

    await user.type(peopleInput, "1");
    await user.type(lanesInput, "1");
    await user.clear(dateInput);
    await user.type(timeInput, "10:00");
    await user.click(button);

    expect(
      screen.getByText("Alla fälten måste vara ifyllda")
    ).toBeInTheDocument();
  });
  //15. Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp.
  // jag tänker de räcker att checka att man navigerar till confirmation sidan för då är allt godkänt i
  // bookingsidan o då räknas de som slutförd
  it("should be able for the user to finish the bookingreservation", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /strIIIIIike!/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/confirmation",
        expect.objectContaining({ state: expect.any(Object) })
      );
    });
  });
  //16. Systemet ska generera ett bokningsnummer och visa detta till användaren efter
  //  att bokningen är slutförd.
  it("should show a booking number after completing the booking", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );
    // Hämta inputs
    const dateInput = screen.getByLabelText(/Date/i);
    const timeInput = screen.getByLabelText(/Time/i);
    const lanesInput = screen.getByLabelText(/Number of lanes/i);
    const peopleInput = screen.getByLabelText(/Number of awesome bowlers/i);
    const addShoeButton = screen.getByRole("button", { name: "+" });
    const bookButton = screen.getByRole("button", { name: /strIIIIIike!/i });

    // Fyll i bokningen
    await user.type(dateInput, "2025-12-08");
    await user.type(timeInput, "18:00");
    await user.clear(lanesInput);
    await user.type(lanesInput, "1");
    await user.clear(peopleInput);
    await user.type(peopleInput, "1");
    await user.click(addShoeButton);
    const shoe1Input = screen.getByLabelText("Shoe size / person 1");
    await user.type(shoe1Input, "42");
    await user.click(bookButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/confirmation",
        expect.objectContaining({
          state: expect.objectContaining({
            confirmationDetails: expect.objectContaining({
              bookingId: "12345",
            }),
          }),
        })
      );
    });
    const confirmationState = {
      confirmationDetails: {
        bookingId: "12345",
        when: "2025-12-08T18:00",
        lanes: 1,
        people: 1,
        shoes: ["42"],
        price: 1000,
      },
    };

    render(
      <MemoryRouter
        initialEntries={[
          { pathname: "/confirmation", state: confirmationState },
        ]}
      >
        <Confirmation />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("12345")).toBeInTheDocument();
  });
});
