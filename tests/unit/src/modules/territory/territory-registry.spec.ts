import { TerritoryRegistry } from "@territory/territory-registry";

describe("Territory registry", (): void => {
  it("should", () => {
    // Arrange
    const fillForm = new TerritoryRegistry({
      serviceYear: { value: 2024 },
      territories: [
        {
          number: 1,
          lastDateCompleted: new Date(""),
          registries: [
            {
              assignedTo: "Name",
              dateAssigned: new Date(""),
              dateCompleted: new Date(""),
            },
          ],
        },
      ],
    });

    // Act
    console.log("Fill form ->", fillForm);

    //Assert
    expect(true).toBe(true);
  });
});
