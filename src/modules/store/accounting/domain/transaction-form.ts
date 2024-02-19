import { Aligned, Draw, Padding } from "@form/domain/draw";
import { Store } from "@shared/domain/store";

import {
  TransactionRecord,
  TransactionRecordFormatted,
} from "./transaction-record";

export class TransactionForm extends Draw<
  TransactionRecord,
  TransactionRecordFormatted
> {
  constructor(store: Store, data: TransactionRecord) {
    super(store, "S-24-S.pdf", data, "f8fc2a3345e648a07d80e3184ae79aea", {
      date: { point: { x: 85, y: 43 } },
      donation: { point: { x: 362, y: 43 } },
      pay: { point: { x: 178, y: 43 } },
      cashAvance: { point: { x: 178, y: 56 } },
      cashBoxDeposit: { point: { x: 362, y: 56 } },
      worldwideWorkDonations: {
        point: { x: 45, y: 90 },
        aligned: Aligned.RIGHT,
      },
      congregationExpenses: {
        point: { x: 45, y: 104 },
        aligned: Aligned.RIGHT,
      },
      otherTransactionsDescription: {
        point: { x: 358, y: 119 },
        padding: [{ type: Padding.TOP, value: 14 }],
      },
      otherTransactionsAmount: {
        point: { x: 45, y: 119 },
        padding: [{ type: Padding.TOP, value: 14 }],
        aligned: Aligned.RIGHT,
      },
      total: {
        point: { x: 45, y: 161 },
        aligned: Aligned.RIGHT,
      },
    });
  }

  fillForm(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.createDocument()
        .then(async () => {
          for (const [key, value] of Object.entries(this.formatted)) {
            let setting = this.mapper[key];
            if (typeof value === "string" && key === "type") {
              setting = this.mapper[this.formatted.type];
              const SVG_PATH_DONE =
                "m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z";
              this.drawSvgPath(setting.point, SVG_PATH_DONE);
            }

            if (typeof value === "string" && key === "date") {
              await this.drawText(value, setting.point);
            }

            if (typeof value === "string" && key !== "type" && key !== "date") {
              await this.drawTextWithSetting(value, setting);
            }

            if (typeof value !== "string" && value !== undefined) {
              const descriptonSetting =
                this.mapper["otherTransactionsDescription"];
              const amountSetting = this.mapper["otherTransactionsAmount"];
              for (const [index, another] of value.entries()) {
                if (another !== undefined) {
                  const descriptonText = another.descripton;
                  const amountText = another.amount;

                  await this.drawTextWithSetting(
                    descriptonText,
                    descriptonSetting,
                    index,
                  );
                  await this.drawTextWithSetting(
                    amountText,
                    amountSetting,
                    index,
                  );
                }
              }
            }
          }

          const setting = this.mapper["total"];
          const total = this.formatted.total;
          await this.drawTextWithSetting(total, setting);

          resolve(await this.document.saveAsBase64());
        })
        .catch((error) => reject(error));
    });
  }
}
