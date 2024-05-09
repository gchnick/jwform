export type TerritoryRegistryData = {
  serviceYear: number;
  territories: Territory[];
};

export type Territory = {
  number: number;
  lastDateCompleted: Date;
  registries: Registries;
};

export type Registries = readonly [Registry, Registry?, Registry?, Registry?];

type Registry = {
  assignedTo: string;
  dateAssigned: Date;
  dateCompleted?: Date;
};
