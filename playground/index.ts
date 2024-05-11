import { writeFile } from "node:fs/promises";

import { logger } from "@/src/modules/shared/domain/logger";

import { JwForm } from "../src/index";
import dataJson from "./data.json";

(async () => {
  const data = JSON.stringify(dataJson);

  const app = new JwForm({
    locale: "es-VE",
    path: "/home/nick/store",
  });

  const filled = await app.fillTerritoryRegistry({ data });
  await writeFile("/home/nick/store/S-13-filled.pdf", filled);
})().catch((error) => logger.error(error));
