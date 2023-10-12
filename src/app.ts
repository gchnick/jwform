import { TransactionForm } from './modules/store/accounting/domain/transaction-form';
import { TransactionRecord } from './modules/store/accounting/domain/transaction-record';
import { PublisherRecordCard } from './modules/store/publisher/publisher-record-card';
import { PublisherRecordCardForm } from './modules/store/publisher/publisher-record-card-form';
import { getStore, initStore } from './modules/store/store';
import { TerritoryRegistry } from './modules/store/territory/territory-registry';
import { TerritoryRegistryForm } from './modules/store/territory/territory-registry-form';

function globalStore(path: string) {
    const get = getStore();
    const store = get ? get.getValue() : initStore({ path }).getValue();
    return store;
}

export function fillTransactionRecord(transactionRecord: TransactionRecord, path: string) {
    const store = globalStore(path);
    const form = new TransactionForm(store, transactionRecord);
    return form.fillForm();
}

export function fillTerritoryRegistry(territoyRegistry: TerritoryRegistry, path: string) {
    const store = globalStore(path);
    const form = new TerritoryRegistryForm(store, territoyRegistry);
    return form.fillForm();
}

export function fillPublisherRecordCard(publisherRecord: PublisherRecordCard, path: string, flatten = false) {
    const store = globalStore(path);
    const form  = new PublisherRecordCardForm(store, publisherRecord, flatten);
    return form.fillForm();
}

export function getDataOfPublisherRecordCard(path: string, fileName?: string) {
    const store = globalStore(path);
    const publisherRecord = new PublisherRecordCard({});
    const form  = fileName ?
        new PublisherRecordCardForm(store, publisherRecord, false, fileName)
        : new PublisherRecordCardForm(store, publisherRecord);
    return form.getFields();
}
