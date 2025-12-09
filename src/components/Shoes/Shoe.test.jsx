import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Shoes from "./Shoes";
import { render, screen } from "@testing-library/react";

describe("Shoe", () => {
  // 6. Användaren ska kunna ange skostorlek för varje spelare.
  it("should work for the user to select shoe size for every player", async () => {
    const user = userEvent.setup();

    const mockUpdatedSize = vi.fn();
    // const mockAddShoe = vi.fn();
    // const mockRemoveShoe = vi.fn();

    const shoes = [
      { id: "shoe-1", size: "" },
      { id: "shoe-2", size: "" },
    ];
    render(
      <Shoes
        shoes={shoes}
        updateSize={mockUpdatedSize}
        // addShoe={mockAddShoe}
        // removeShoe={mockRemoveShoe}
      />
    );

    const shoe1Input = screen.getByLabelText("Shoe size / person 1");
    const shoe2Input = screen.getByLabelText("Shoe size / person 2");

    await user.type(shoe1Input, "42");
    await user.type(shoe2Input, "39");

    expect(mockUpdatedSize).toHaveBeenCalled();
    expect(shoe1Input).toHaveValue("42");
    expect(shoe2Input).toHaveValue("39");
  });
  // 7. Användaren ska kunna ändra skostorlek för varje spelare
  it("should allow the player to change shoe size", async () => {
    const user = userEvent.setup();
    const mockUpdatedSize = vi.fn();
    const shoes = [
      {
        id: "shoe-1",
        size: "43",
      },
      { id: "shoe-2", size: "41" },
    ];

    render(<Shoes shoes={shoes} updateSize={mockUpdatedSize} />);

    const shoe1Input = screen.getByLabelText("Shoe size / person 1");
    const shoe2Input = screen.getByLabelText("Shoe size / person 2");

    await user.clear(shoe1Input);
    await user.type(shoe1Input, "46");

    await user.clear(shoe2Input);
    await user.type(shoe2Input, "52");

    expect(shoe1Input).toHaveValue("46");
    expect(shoe2Input).toHaveValue("52");
    expect(mockUpdatedSize).toHaveBeenCalled();
  });
  // 8. Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen.
  // samma som som nummer 6 acceptance väl?
  it("should allow selecting shoesize for all players in the booking", async () => {
    const user = userEvent.setup();
    const mockUpdatedSize = vi.fn();
    const shoes = [
      { id: "shoe-1", size: "" },
      { id: "shoe-2", size: "" },
      { id: "shoe-3", size: "" },
    ];
    render(<Shoes shoes={shoes} updateSize={mockUpdatedSize} />);
    shoes.forEach((shoes, index) => {
      const input = screen.getByLabelText(`Shoe size / person ${index + 1}`);
      expect(input).toBeInTheDocument();
    });
    ///................
    // Fyll i alla skostorlekar
    await user.type(screen.getByLabelText("Shoe size / person 1"), "42");
    await user.type(screen.getByLabelText("Shoe size / person 2"), "39");
    await user.type(screen.getByLabelText("Shoe size / person 3"), "44");

    // Kontrollera att input-fälten har rätt värden
    expect(screen.getByLabelText("Shoe size / person 1")).toHaveValue("42");
    expect(screen.getByLabelText("Shoe size / person 2")).toHaveValue("39");
    expect(screen.getByLabelText("Shoe size / person 3")).toHaveValue("44");

    // Kontrollera att updateSize-funktionen har anropats
    expect(mockUpdatedSize).toHaveBeenCalled();
  });

  //12. Användaren ska kunna ta bort ett tidigare valt fält för skostorlek
  // genom att klicka på en "-"-knapp vid varje spelare.
  it("should work if the user click on the - button, then the shoes dissapears", async () => {
    const user = userEvent.setup();
    const mockRemoveShoes = vi.fn();
    const shoes = [{ id: "shoe-1", size: "45" }];
    render(<Shoes removeShoe={mockRemoveShoes} shoes={shoes} />);

    const removeBtn = screen.getByRole("button", { name: "-" });
    await user.click(removeBtn);

    expect(mockRemoveShoes).toHaveBeenCalledWith("shoe-1");
  });
});
