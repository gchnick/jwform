import { DataDraw } from '../../../shared/domain/data';

export enum TransactionType {
    DONATION = 'donation',
    PAY = 'pay',
    CASH_AVANCE = 'cashAvance',
    CASH_BOX_DEPOSIT = 'cashBoxDeposit'
}

type AnotherTransaction = {
    descripton: string
    amount: number
}

export type OtherTransactions = [AnotherTransaction, AnotherTransaction?, AnotherTransaction?]

type AnotherTransactionFormatted = {
    descripton: string
    amount: string
}

export type OtherTransactionsFormatted = [AnotherTransactionFormatted, AnotherTransactionFormatted?, AnotherTransactionFormatted?]

export type TransactionRecordFormatted = {
    date: string
    type: string
    worldwideWorkDonations: string
    congregationExpenses: string
    otherTransactions?: OtherTransactionsFormatted
    total: string
}

export class TransactionRecord implements DataDraw<TransactionRecordFormatted> {
    readonly #LOCALE = 'es-VE';
    readonly #numberFormat = Intl.NumberFormat(this.#LOCALE, { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 });
    readonly #date: Date;
    readonly #type: TransactionType;
    readonly #worldwideWorkDonations: number;
    readonly #congregationExpenses: number;
    readonly #otherTransactions?: OtherTransactions;

    constructor(date: Date,
        type: TransactionType,
        worldwideWorkDonations: number,
        congregationExpenses: number,
        otherTransactions?: OtherTransactions) {
        this.#date = date;
        this.#type = type;
        this.#worldwideWorkDonations = worldwideWorkDonations;
        this.#congregationExpenses = congregationExpenses;
        this.#otherTransactions = otherTransactions;
    }

    getFormattedData(): TransactionRecordFormatted {
        return {
            date: this.#date.toLocaleDateString(this.#LOCALE),
            type: this.#type,
            worldwideWorkDonations: this.#numberFormat.format(this.#worldwideWorkDonations),
            congregationExpenses: this.#numberFormat.format(this.#congregationExpenses),
            otherTransactions: this.#otherFormattedTransactions(),
            total: this.#total()
        };
    }

    #otherFormattedTransactions(): OtherTransactionsFormatted | undefined {
        if (typeof this.#otherTransactions === 'undefined') return undefined;

        const otherTransactionsFormatted: OtherTransactionsFormatted = [
            {
                ...this.#otherTransactions[0],
                amount: this.#numberFormat.format(this.#otherTransactions[0].amount)
            }
        ];

        this.#otherTransactions?.forEach((other, i) => {
            if(other !== undefined && this.#otherTransactions !== undefined) {
                otherTransactionsFormatted[i] = {
                    ...other,
                    amount: this.#numberFormat.format(other.amount)
                };
            }
        });
        
        return otherTransactionsFormatted;
    }

    #total(): string {
        let acc = 0;
        this.#otherTransactions?.forEach(t => { if(t) acc += t.amount; });
        const total = this.#worldwideWorkDonations + this.#congregationExpenses + acc;
        return this.#numberFormat.format(total);
    }
}
