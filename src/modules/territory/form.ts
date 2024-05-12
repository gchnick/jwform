import type { Setting } from "../form/domain/types";
import type { Registry } from "./schema";
import type {
  Column,
  ColumnMapper,
  ColumnRange,
  Registries,
  Row,
  RowMapper,
  RowRange,
  SettingRow,
  SettingRowWithColum,
  Territory,
} from "./types";

import { Draw } from "../form/domain/draw";
import { Form } from "../form/domain/form";
import { FolderStore } from "../jwform/folder-store";
import { Pdf } from "../jwform/pdf";
import { toLocaleDateString } from "../shared/domain/date";
import { FileName } from "../shared/domain/file-name";
import { logger } from "../shared/domain/logger";
import { LAYOUT } from "./layout";

export class TerritoryRegistryForm extends Draw implements Form {
  static formName = FileName.fromValue("S-13.pdf");
  static md5 = "54fa1de2ac8bc7286e0e742db3d1b59b";
  locale: Intl.LocalesArgument;
  data: Registry;

  constructor({
    folder,
    bufferEncode,
    data,
    locale,
  }: {
    folder: FolderStore;
    bufferEncode: BufferEncoding;
    data: Registry;
    locale: Intl.LocalesArgument;
  }) {
    super(
      new Pdf({
        folder,
        fileName: TerritoryRegistryForm.formName,
        bufferEncode,
      }),
    );
    this.data = data;
    this.locale = locale;
    // pdf.ensureIsIntegrity(); TODO: Implement integrity verification with strategy pattrem
  }

  async fill(): Promise<Uint8Array> {
    logger.info(`Filling ${TerritoryRegistryForm.formName.value} form...`);

    await this.createDocument();
    for (const [key, value] of Object.entries(this.data)) {
      if (key === "serviceYear" && typeof value === "number") {
        const setting = LAYOUT.serviceYear;
        await this.drawText(String(value), setting.point, setting.font);
      }

      if (key === "territories" && typeof value === "object") {
        await this.#writeTerritoryData(value);
      }
    }

    const result = await this.document.save();
    logger.info(`${TerritoryRegistryForm.formName.value} form filled.`);

    return result;
  }

  async #writeTerritoryData(territories: Array<Territory>) {
    for (const [i, t] of territories.entries()) {
      const indexOfTerritory = i + 1;
      const setting = this.#getSettingRow(indexOfTerritory as RowRange);

      await this.drawTextWithSetting(String(t.number), setting.numberTerritory);
      await this.drawTextWithSetting(
        toLocaleDateString(t.lastDateCompleted, this.locale),
        setting.lastDateCompleted,
      );

      await this.#writeRegistryData(t.registries, indexOfTerritory);
    }
  }

  async #writeRegistryData(registries: Registries, indexOfTerritory: number) {
    for (const [i, r] of registries.entries()) {
      const indexOfRegistry = i + 1;
      const setting = this.#getSettingRowWithColum(
        indexOfTerritory as RowRange,
        indexOfRegistry as ColumnRange,
      );

      if (r !== undefined) {
        await this.drawTextWithSetting(r.assignedTo, setting.assignedTo);
        await this.drawTextWithSetting(
          toLocaleDateString(r.dateAssigned, this.locale),
          setting.dateAssigned,
        );
        r.dateCompleted &&
          (await this.drawTextWithSetting(
            toLocaleDateString(r.dateCompleted, this.locale),
            setting.dateCompleted,
          ));
      }
    }
  }

  #getRowLayout(index: RowRange): Row {
    const mapper: RowMapper = {
      1: LAYOUT.row1,
      2: LAYOUT.row2,
      3: LAYOUT.row3,
      4: LAYOUT.row4,
      5: LAYOUT.row5,
      6: LAYOUT.row6,
      7: LAYOUT.row7,
      8: LAYOUT.row8,
      9: LAYOUT.row9,
      10: LAYOUT.row10,
      11: LAYOUT.row11,
      12: LAYOUT.row12,
      13: LAYOUT.row13,
      14: LAYOUT.row14,
      15: LAYOUT.row15,
      16: LAYOUT.row16,
      17: LAYOUT.row17,
      18: LAYOUT.row18,
      19: LAYOUT.row19,
      20: LAYOUT.row20,
    };

    return mapper[index];
  }

  #getColumnLayout(index: ColumnRange): Column {
    const mapper: ColumnMapper = {
      1: LAYOUT.column1,
      2: LAYOUT.column2,
      3: LAYOUT.column3,
      4: LAYOUT.column4,
    };

    return mapper[index];
  }

  #getSettingRow(rowIndex: RowRange): SettingRow {
    const row = this.#getRowLayout(rowIndex);

    const numberTerritory: Setting = {
      point: row.numberTerritory,
      ...LAYOUT.numberTerritory,
    };

    const lastDateCompleted: Setting = {
      point: row.lastDateCompleted,
      ...LAYOUT.lastDateCompleted,
    };

    return {
      numberTerritory,
      lastDateCompleted,
    };
  }

  #getSettingRowWithColum(
    rowIndex: RowRange,
    columnIndex: ColumnRange,
  ): SettingRowWithColum {
    const row = this.#getRowLayout(rowIndex);
    const colum = this.#getColumnLayout(columnIndex);

    const assignedTo: Setting = {
      point: { x: colum.assignedToPointX, y: row.assignedToPointY },
      ...LAYOUT.assignedTo,
    };

    const dateAssigned: Setting = {
      point: { x: colum.dateAssignedPointX, y: row.dateAssignedPointY },
      ...LAYOUT.assignedTo,
    };

    const dateCompleted: Setting = {
      point: { x: colum.dateCompletedPointX, y: row.dateCompletedPointY },
      ...LAYOUT.assignedTo,
    };

    return {
      assignedTo,
      dateAssigned,
      dateCompleted,
    };
  }
}
