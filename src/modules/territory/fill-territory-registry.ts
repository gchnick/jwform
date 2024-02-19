import { globalStore } from "@shared/domain/store";

import { TerritoryRegistry } from "./territory-registry";
import { TerritoryRegistryForm } from "./territory-registry-form";

export default function fillTerritoryRegistry(
  territoyRegistry: TerritoryRegistry,
  path: string,
) {
  const store = globalStore(path);
  const form = new TerritoryRegistryForm(store, territoyRegistry);
  return form.fillForm();
}
