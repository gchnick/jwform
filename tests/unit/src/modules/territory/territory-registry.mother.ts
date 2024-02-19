import { ServiceYear, Territories } from "@territory/territory-registry";

export const TerritoryRegistryMother = {
  dataToFill(): {
    serviceYear: ServiceYear;
    territories: Territories;
  } {
    return {
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
    };
  },
};
