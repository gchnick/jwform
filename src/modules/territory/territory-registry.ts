import { DataDraw } from "@shared/domain/data";

type Registry = {
  assignedTo: string;
  dateAssigned: Date;
  dateCompleted?: Date;
};

type Registries = readonly [Registry, Registry?, Registry?, Registry?];

type Territory = {
  number: number;
  lastDateCompleted: Date;
  registries: Registries;
};

export type Territories = Territory[];

export type ServiceYear = {
  value: number;
};

type RegistryFormatted = {
  assignedTo: string;
  dateAssigned: string;
  dateCompleted: string;
};

export type RegistriesFormatted = [
  RegistryFormatted,
  RegistryFormatted?,
  RegistryFormatted?,
  RegistryFormatted?,
];

type TerritoryFormatted = {
  number: string;
  lastDateCompleted: string;
  registries: RegistriesFormatted;
};

export type TerritoriesFormatted = TerritoryFormatted[];

export type TerritoryRegistryFormatted = {
  serviceYear: string;
  territories: TerritoriesFormatted;
};

export class TerritoryRegistry implements DataDraw<TerritoryRegistryFormatted> {
  readonly #LOCALE = "es-VE";
  readonly serviceYear: ServiceYear;
  readonly territories: Territories;

  constructor({
    serviceYear,
    territories,
  }: {
    serviceYear: ServiceYear;
    territories: Territories;
  }) {
    this.serviceYear = serviceYear;
    this.territories = territories;
  }

  getFormattedData(): TerritoryRegistryFormatted {
    return {
      serviceYear: String(this.serviceYear.value),
      territories: this.territories.map((t, i) => {
        return {
          number: String(t.number),
          lastDateCompleted: t.lastDateCompleted.toLocaleDateString(
            this.#LOCALE,
            { year: "2-digit", month: "2-digit", day: "2-digit" },
          ),
          registries: this.#getRegistriesFormatted(i),
        };
      }),
    };
  }

  #getRegistriesFormatted(index: number): RegistriesFormatted {
    const registries = this.territories[index].registries;
    const registriesFormatted: RegistriesFormatted = [
      {
        assignedTo: "",
        dateAssigned: "",
        dateCompleted: "",
      },
    ];

    for (const [i, r] of registries.entries()) {
      if (r !== undefined) {
        registriesFormatted[i] = {
          assignedTo: r.assignedTo,
          dateAssigned: r.dateAssigned.toLocaleDateString(this.#LOCALE, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          }),
          dateCompleted:
            r.dateCompleted?.toLocaleDateString(this.#LOCALE, {
              year: "2-digit",
              month: "2-digit",
              day: "2-digit",
            }) ?? "",
        };
      }
    }

    return registriesFormatted;
  }
}
