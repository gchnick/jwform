import type { Point, Setting } from "../form/domain/types";

type Registry = {
  assignedTo: string;
  dateAssigned: Date;
  dateCompleted?: Date;
};

export type Territory = {
  number: number;
  lastDateCompleted: Date;
  registries: Registries;
};

export type Registries = Registry[];

export type Row = {
  numberTerritory: Point;
  lastDateCompleted: Point;
  assignedToPointY: number;
  dateAssignedPointY: number;
  dateCompletedPointY: number;
};

export type Column = {
  assignedToPointX: number;
  dateAssignedPointX: number;
  dateCompletedPointX: number;
};

export type RowRange =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20;

export type RowMapper = Record<RowRange, Row>;

export type ColumnRange = 1 | 2 | 3 | 4;
export type ColumnMapper = Record<ColumnRange, Column>;

export type SettingRow = {
  numberTerritory: Setting;
  lastDateCompleted: Setting;
};

export type SettingRowWithColum = {
  assignedTo: Setting;
  dateAssigned: Setting;
  dateCompleted: Setting;
};

export type Layout = {
  serviceYear: Setting;
  numberTerritory: Omit<Setting, "point">;
  lastDateCompleted: Omit<Setting, "point">;
  assignedTo: Omit<Setting, "point">;
  dateAssigned: Omit<Setting, "point">;
  dateCompleted: Omit<Setting, "point">;
  column1: Column;
  column2: Column;
  column3: Column;
  column4: Column;
  row1: Row;
  row2: Row;
  row3: Row;
  row4: Row;
  row5: Row;
  row6: Row;
  row7: Row;
  row8: Row;
  row9: Row;
  row10: Row;
  row11: Row;
  row12: Row;
  row13: Row;
  row14: Row;
  row15: Row;
  row16: Row;
  row17: Row;
  row18: Row;
  row19: Row;
  row20: Row;
};
