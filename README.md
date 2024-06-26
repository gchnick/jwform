# JWForm

This library help to fill forms of Jehovah's Witnesses. The forms is not contanied into this library. You should provider the files .pdf to work.

## Currently supported forms

- **S-21** Publisher Record Card
- **S-24** Transaction Record
- **S-13** Territory Registry

## How use JWForm

Firth, install npm library into project of nodejs.

    npm install jwform@latest

After, create object with data to fill form. This libary provides objects that wrap the information that will be stored within the form.

For example, to fill a **Transaction Record Form** should create an object as follows:

```ts
const date = new Date("2023-7-12");
const worldwideWorkDonations = 0.53;
const congragationExpenses = 10.12;
const otherTransactions: OtherTransactions = [
  { descripton: "Maintenance expense", amount: 124 },
  { descripton: "Purchase of consumables for Hall", amount: 2523 },
  { descripton: "Others expenses", amount: 52235.12 },
];
const data = new TransactionRecord(
  date,
  TransactionType.PAY,
  worldwideWorkDonations,
  congragationExpenses,
  otherTransactions,
);

fillTransactionRecord(data, "/path/to/store")
  .then((base64) => {
    fs.writeFile("/path/to/create/transactionRecord.pdf", base64, "base64");
  })
  .catch((err) => console.error("Error at save pdf generate", err));
```

As you can see, the data will then be passed to a method that will handle filling and creating the new form. The path to store should contain all the branch forms empty and ready to fill. These will be copies to fill out.

## Territory Registry Form

```json
{
  "serviceYear": 2023,
  "territories": [
    {
      "number": 1,
      "lastDateCompleted": "2023-7-12",
      "registries": [
        {
          "assignedTo": "Juan Leal",
          "dateAssigned": "2023-8-1",
          "dateCompleted": "2023-8-20"
        },
        {
          "assignedTo": "Luis Amado",
          "dateAssigned": "2023-8-30",
          "dateCompleted": "2023-9-10"
        },
        {
          "assignedTo": "Jual Leal",
          "dateAssigned": "2023-9-15",
          "dateCompleted": "2023-9-30"
        },
        {
          "assignedTo": "Marco Feliz",
          "dateAssigned": "2023-10-10",
          "dateCompleted": "2023-10-25"
        }
      ]
    },
    {
      "number": 2,
      "lastDateCompleted": "2023-7-1",
      "registries": [
        {
          "assignedTo": "Lucas Paciente",
          "dateAssigned": "2023-7-30",
          "dateCompleted": "2023-8-15"
        }
      ]
    },
    {
      "number": 3,
      "lastDateCompleted": "2023-7-3",
      "registries": [
        {
          "assignedTo": "Carlos Cantor",
          "dateAssigned": "2023-7-30"
        }
      ]
    }
  ]
}
```

```ts
import { writeFile } from "node:fs/promises";

import { JwForm } from "../src/index";
import dataJson from "./data.json";

(async () => {
  const data = JSON.stringify(dataJson);
  const bufferEncode = "base64";

  const app = new JwForm({
    locale: "es-VE",
    path: "/path/to/folder", // S-13.pdf folder path
  });

  const filled = await app.fillTerritoryRegistry({ data });
  await writeFile("/path/to/create/S-13-filled.pdf", filled);
})().catch((error) => console.error(error));
```

## Publisher Record Card

```ts
const publisher = () => {
  const data = new PublisherRecordCard({
    serviceYear: ["2023"],
    data: {
      name: "Julio Publisher",
      birth: new Date(),
      gender: Gender.MALE,
    },
    records: [
      {
        1: { hours: "10", places: "25", remarks: "Remark edited" },
      },
    ],
  });

  fillPublisherRecordCard(data, "/home/nick/store", true)
    .then((base64) => {
      fs.writeFile("/home/nick/store/publisherRecord.pdf", base64, "base64");
    })
    .catch((err) => console.error(`Error at save pdf generate ${err}\n`));
};
```
