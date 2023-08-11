import { TransactionForm } from '../modules/store/accounting/domain/transaction-form'
import { TransactionRecord } from '../modules/store/accounting/domain/transaction-record'
import getStore from '../modules/store/store'
import { TerritoryRegistry } from '../modules/store/territory/territory-registry'
import { TerritoryRegistryForm } from '../modules/store/territory/territory-registry-form'

export function fillTransactionRecord(transactionRecord: TransactionRecord, path: string) {
    const store = getStore({ path }).getValue()
    const form = new TransactionForm(store, transactionRecord)
    return form.fillForm()
}

export function fillTerritoryRegistry(territoyRegistry: TerritoryRegistry, path: string) {
    const store = getStore({ path }).getValue()
    const form = new TerritoryRegistryForm(store, territoyRegistry)
    return form.fillForm()
}
