/* eslint-disable semi */
import fs from 'node:fs/promises';
import { PdfJW } from './pdfjw/pdfjw';
import { OtherTransactions, TransactionForm, TransactionRecord, TransactionType } from './store';
import getStore, { Store } from './store/store';


(() => {
    const store = getStore({ path: '/home/nick/store'}).getValue()

    const pdfJW = new PdfJW()

    const date = new Date()
    const worldwideWorkDonations = 0.53
    const congragationExpenses = 10.12
    const form = new TransactionForm(store as Store)
    const otherTransactions: OtherTransactions = [
        { descripton: 'Gasto de mantenimiento', amount: 124 },
        { descripton: 'Compra de alimentos', amount: 2523 },
        { descripton: 'Reparacion de techo', amount: 52235.12 },
    ]
    const data = new TransactionRecord(date,
        TransactionType.PAY,
        worldwideWorkDonations,
        congragationExpenses,
        otherTransactions)
    
    pdfJW.generate(form, data).then(base64 => {
        fs.writeFile('/home/nick/store/test.pdf', base64, 'base64')
    })
        .catch(err => console.error('Error at save pdf generate', err))
})()
