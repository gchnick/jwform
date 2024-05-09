import { Aligned, Draw, Mapper, Padding } from "@form/domain/draw";
import { Form } from "@form/domain/form";
import { Pdf } from "@jwform/pdf";

import { TransactionRecordFormatted } from "./transaction-record";

// TODO: Add formatted logic of transaction record
export class TransactionForm extends Draw implements Form {
  static formName = "S-24-S.pdf";
  static md5 = "f8fc2a3345e648a07d80e3184ae79aea";
  locale?: Intl.LocalesArgument;
  data: TransactionRecordFormatted;
  mapper: Mapper = {
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
  };

  constructor({
    pdf,
    data,
    locale,
  }: {
    pdf: Pdf;
    data: TransactionRecordFormatted;
    locale?: Intl.LocalesArgument;
  }) {
    super(pdf);
    this.locale = locale;
    this.data = data;
  }

  async fill(): Promise<string> {
    await this.createDocument();
    for (const [key, value] of Object.entries(this.data)) {
      let setting = this.mapper[key];
      if (typeof value === "string" && key === "type") {
        setting = this.mapper[this.data.type];
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
        const descriptonSetting = this.mapper["otherTransactionsDescription"];
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
            await this.drawTextWithSetting(amountText, amountSetting, index);
          }
        }
      }
    }

    const setting = this.mapper["total"];
    const total = this.data.total;
    await this.drawTextWithSetting(total, setting);

    return await this.document.saveAsBase64({ dataUri: true });
  }
}
