import { Data } from '../../form'

export enum TransactionType {
    DONATION = 'donation',
    PAY = 'pay',
    CASH_AVANCE = 'cashAvance',
    CASH_DEPOSIT = 'cashDeposit'
}

type AnotherTransaction = {
    descripton: string
    amount: number
}

export type OtherTransactions = [AnotherTransaction] | [AnotherTransaction, AnotherTransaction] | [AnotherTransaction, AnotherTransaction, AnotherTransaction]

type AnotherTransactionFormat = {
    descripton: string
    amount: string
}

export type OtherTransactionsFormat = [AnotherTransactionFormat] | [AnotherTransactionFormat, AnotherTransactionFormat] | [AnotherTransactionFormat, AnotherTransactionFormat, AnotherTransactionFormat]

type TransactionRecordFormat = {
    date: string
    type: string
    worldwideWorkDonations: string
    congregationExpenses: string
    otherTransactions?: OtherTransactionsFormat
    total: string
}

export class TransactionRecord implements Data {
    readonly #LOCALE = 'es-VE'
    readonly #numberFormat = Intl.NumberFormat(this.#LOCALE, { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 })
    readonly #date: Date
    readonly #type: TransactionType
    readonly #worldwideWorkDonations: number
    readonly #congregationExpenses: number
    readonly #otherTransactions?: OtherTransactions

    constructor(date: Date,
        type: TransactionType,
        worldwideWorkDonations: number,
        congregationExpenses: number,
        otherTransactions?: OtherTransactions) {
        this.#date = date
        this.#type = type
        this.#worldwideWorkDonations = worldwideWorkDonations
        this.#congregationExpenses = congregationExpenses
        this.#otherTransactions = otherTransactions
    }

    getFormattedData(): TransactionRecordFormat {
        return {
            date: this.#date.toLocaleDateString(this.#LOCALE),
            type: this.#type,
            worldwideWorkDonations: this.#numberFormat.format(this.#worldwideWorkDonations),
            congregationExpenses: this.#numberFormat.format(this.#congregationExpenses),
            otherTransactions: this.#otherFormattedTransactions(),
            total: this.#total()
        }
    }

    #otherFormattedTransactions(): OtherTransactionsFormat | undefined {
        if (typeof this.#otherTransactions === 'undefined') return undefined

        if(this.#otherTransactions.length === 1) {
            const another0 = {...this.#otherTransactions[0], amount: this.#numberFormat.format(this.#otherTransactions[0].amount)}
            return [another0]
        }

        if(this.#otherTransactions.length === 2) {
            const another0 = {...this.#otherTransactions[0], amount: this.#numberFormat.format(this.#otherTransactions[0].amount)}
            const another1 = {...this.#otherTransactions[1], amount: this.#numberFormat.format(this.#otherTransactions[1].amount)}
            return [another0, another1]
        }

        if(this.#otherTransactions.length === 3) {
            const another0 = {...this.#otherTransactions[0], amount: this.#numberFormat.format(this.#otherTransactions[0].amount)}
            const another1 = {...this.#otherTransactions[1], amount: this.#numberFormat.format(this.#otherTransactions[1].amount)}
            const another2 = {...this.#otherTransactions[2], amount: this.#numberFormat.format(this.#otherTransactions[2].amount)}
            return [another0, another1, another2]
        }
        
        return undefined
    }

    #total(): string {
        const other = (this.#otherTransactions?.map(t => t.amount).reduce((acc, value) => acc+=value)) ?? 0
        const total = this.#worldwideWorkDonations + this.#congregationExpenses + other
        return this.#numberFormat.format(total)
    }
}

