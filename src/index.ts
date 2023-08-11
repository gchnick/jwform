/* eslint-disable semi */
import fs from 'node:fs/promises';
import { OtherTransactions, TransactionRecord, TransactionType } from './modules/store/accounting/domain/transaction-record';
import { fillTransactionRecord } from './pdfjw/pdfjw';


const transaction = () => {
    const date = new Date()
    const worldwideWorkDonations = 0.53
    const congragationExpenses = 10.12
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

    fillTransactionRecord(data, '/home/nick/store')
        .then(base64 => {
            fs.writeFile('/home/nick/store/transactionRecord.pdf', base64, 'base64')
        })
        .catch(err => console.error('Error at save pdf generate', err))
}

// const territory = () => {
//     const data = new TerritoryRegistry({
//         serviceYear: { value: 2023 },
//         territories: [
//             {
//                 number: 1,
//                 lastDateCompleted: new Date('2023-7-12'),
//                 registries: [
//                     {
//                         assignedTo: 'Juan Leal',
//                         dateAssigned: new Date('2023-8-1'),
//                         dateCompleted: new Date('2023-8-20'),
//                     },
//                     {
//                         assignedTo: 'Luis Amado',
//                         dateAssigned: new Date('2023-8-30'),
//                         dateCompleted: new Date('2023-9-10'),
//                     },
//                     {
//                         assignedTo: 'Jual Leal',
//                         dateAssigned: new Date('2023-9-15'),
//                         dateCompleted: new Date('2023-9-30'),
//                     },
//                     {
//                         assignedTo: 'Marco Feliz',
//                         dateAssigned: new Date('2023-10-10'),
//                         dateCompleted: new Date('2023-10-25'),
//                     }
//                 ]
//             },
//             {
//                 number: 2,
//                 lastDateCompleted: new Date('2023-7-1'),
//                 registries: [
//                     {
//                         assignedTo: 'Lucas Paciente',
//                         dateAssigned: new Date('2023-7-30'),
//                         dateCompleted: new Date('2023-8-15'),
//                     },
//                 ]
//             },
//             {
//                 number: 3,
//                 lastDateCompleted: new Date('2023-7-3'),
//                 registries: [
//                     {
//                         assignedTo: 'Carlos Cantor',
//                         dateAssigned: new Date('2023-7-30'),
//                     },
//                 ]
//             }
//         ]})
    
//     fillTerritoryRegistry(data, '/home/nick/store')
//         .then(base64 => {
//             fs.writeFile('/home/nick/store/territoryRegistry.pdf', base64, 'base64')
//         })
//         .catch(err => console.error('Error at save pdf generate', err))
// }

transaction()