import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Booking from "./Booking";
import { MemoryRouter } from "react-router-dom";

// 3.Användaren ska kunna reservera ett eller flera banor beroende på antal spelare.
// kollar de i 2 test, ett error för de är för många personer registrerade beroende på antalet banor
// sen ett där de fungerar och inget felmeddelande kommer fram
describe("Booking component", () => {
  it("shows error if there are more players then max amount on a lane", async () => {
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

  it("accepterar bokning om spelare ryms på banor", async () => {
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
  });
});
