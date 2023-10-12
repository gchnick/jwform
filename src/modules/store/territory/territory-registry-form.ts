import { Aligned, Draw, Point, Setting } from '../../form/domain/draw';
import { Store } from '../store';
import { RegistriesFormatted, TerritoriesFormatted, TerritoryRegistry, TerritoryRegistryFormatted } from './territory-registry';


 type Row = { 
    numberTerritory: Point; 
    lastDateCompleted: Point;
    assignedToPointY: number;
    dateAssignedPointY: number;
    dateCompletedPointY: number;
 }

 type Column = {
    assignedToPointX: number,
    dateAssignedPointX: number,
    dateCompletedPointX: number,
 }

type RowRange = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20
type RowMapper = Record<RowRange, Row>

type ColumnRange = 1 | 2 | 3 | 4 
type ColumnMapper = Record<ColumnRange, Column>

type SettingRow = {
    numberTerritory: Setting; 
    lastDateCompleted: Setting;
}

type SettingRowWithColum = {
    assignedTo: Setting;
    dateAssigned: Setting;
    dateCompleted: Setting;
}

 type Layout = {
    serviceYear: Setting,
    numberTerritory: Omit<Setting, 'point'>
    lastDateCompleted: Omit<Setting, 'point'>
    assignedTo: Omit<Setting, 'point'>
    dateAssigned: Omit<Setting, 'point'>
    dateCompleted: Omit<Setting, 'point'>
    column1: Column
    column2: Column
    column3: Column
    column4: Column
    row1: Row
    row2: Row
    row3: Row
    row4: Row
    row5: Row
    row6: Row
    row7: Row
    row8: Row
    row9: Row
    row10: Row
    row11: Row
    row12: Row
    row13: Row
    row14: Row
    row15: Row
    row16: Row
    row17: Row
    row18: Row
    row19: Row
    row20: Row
 }


const layout: Layout = {
    serviceYear: { point: {x: 448, y: 95}, font: { size: 14 }},
    numberTerritory: { font: {size: 20 }, aligned: Aligned.CENTER },
    lastDateCompleted: { aligned: Aligned.CENTER, font: { size: 13 } },
    assignedTo: { aligned: Aligned.CENTER },
    dateAssigned: { aligned: Aligned.CENTER, font: {size: 11} },
    dateCompleted: { aligned: Aligned.CENTER, font: {size: 11} },
    column1: {
        assignedToPointX: 410,
        dateAssignedPointX: 438,
        dateCompletedPointX: 385,
    },
    column2: {
        assignedToPointX: 300,
        dateAssignedPointX: 332,
        dateCompletedPointX: 279,
    },
    column3: {
        assignedToPointX: 197,
        dateAssignedPointX: 225,
        dateCompletedPointX: 172,
    },
    column4: {
        assignedToPointX: 96,
        dateAssignedPointX: 118,
        dateCompletedPointX: 65,
    },
    row1: {
        numberTerritory: { x: 545, y: 169},
        lastDateCompleted: { x: 500 , y: 168},
        assignedToPointY: 160,
        dateAssignedPointY: 175,
        dateCompletedPointY: 175
    },
    row2: {
        numberTerritory: { x: 545, y: 200},
        lastDateCompleted: { x: 500 , y: 199},
        assignedToPointY: 191,
        dateAssignedPointY: 206,
        dateCompletedPointY: 206
    },
    row3: {
        numberTerritory: { x: 545, y: 232},
        lastDateCompleted: { x: 500 , y: 230},
        assignedToPointY: 223,
        dateAssignedPointY: 238,
        dateCompletedPointY: 238
    },
    row4: {
        numberTerritory: { x: 545, y: 263},
        lastDateCompleted: { x: 500 , y: 262},
        assignedToPointY: 254,
        dateAssignedPointY: 269,
        dateCompletedPointY: 269
    },
    row5: {
        numberTerritory: { x: 545, y: 294},
        lastDateCompleted: { x: 500 , y: 292},
        assignedToPointY: 285,
        dateAssignedPointY: 300,
        dateCompletedPointY: 300
    },
    row6: {
        numberTerritory: { x: 545, y: 325},
        lastDateCompleted: { x: 500 , y: 323},
        assignedToPointY: 316,
        dateAssignedPointY: 331,
        dateCompletedPointY: 331
    },
    row7: {
        numberTerritory: { x: 545, y: 356},
        lastDateCompleted: { x: 500 , y: 354},
        assignedToPointY: 347,
        dateAssignedPointY: 362,
        dateCompletedPointY: 362
    },
    row8: {
        numberTerritory: { x: 545, y: 387},
        lastDateCompleted: { x: 500, y: 385},
        assignedToPointY: 378,
        dateAssignedPointY: 393,
        dateCompletedPointY: 393
    },
    row9: {
        numberTerritory: { x: 545, y: 418},
        lastDateCompleted: { x: 500, y: 416},
        assignedToPointY: 409,
        dateAssignedPointY: 424,
        dateCompletedPointY: 424
    },
    row10: {
        numberTerritory: { x: 545, y: 450},
        lastDateCompleted: { x: 500, y: 447},
        assignedToPointY: 440,
        dateAssignedPointY: 455,
        dateCompletedPointY: 455
    },
    row11: {
        numberTerritory: { x: 545, y: 482},
        lastDateCompleted: { x: 500, y: 480}, // 2 menos
        assignedToPointY: 473, // 9 menos
        dateAssignedPointY: 488, // 15 mas
        dateCompletedPointY: 488
    },
    row12: {
        numberTerritory: { x: 545, y: 513},
        lastDateCompleted: { x: 500, y: 511},
        assignedToPointY: 504,
        dateAssignedPointY: 519,
        dateCompletedPointY: 519
    },
    row13: {
        numberTerritory: { x: 545, y: 544},
        lastDateCompleted: { x: 500, y: 542},
        assignedToPointY: 535,
        dateAssignedPointY: 550,
        dateCompletedPointY: 550
    },
    row14: {
        numberTerritory: { x: 545, y: 575},
        lastDateCompleted: { x: 500, y: 573},
        assignedToPointY: 564,
        dateAssignedPointY: 579,
        dateCompletedPointY: 579
    },
    row15: {
        numberTerritory: { x: 545, y: 607},
        lastDateCompleted: { x: 500, y: 605},
        assignedToPointY: 598,
        dateAssignedPointY: 613,
        dateCompletedPointY: 613
    },
    row16: {
        numberTerritory: { x: 545, y: 638},
        lastDateCompleted: { x: 500, y: 636},
        assignedToPointY: 627,
        dateAssignedPointY: 642,
        dateCompletedPointY: 642
    },
    row17: {
        numberTerritory: { x: 545, y: 669},
        lastDateCompleted: { x: 500, y: 667},
        assignedToPointY: 660,
        dateAssignedPointY: 675,
        dateCompletedPointY: 675
    },
    row18: {
        numberTerritory: { x: 545, y: 701},
        lastDateCompleted: { x: 500, y: 699},
        assignedToPointY: 692,
        dateAssignedPointY: 707,
        dateCompletedPointY: 707
    },
    row19: {
        numberTerritory: { x: 545, y: 732},
        lastDateCompleted: { x: 500, y: 730},
        assignedToPointY: 723,
        dateAssignedPointY: 738,
        dateCompletedPointY: 738
    },
    row20: {
        numberTerritory: { x: 545, y: 763},
        lastDateCompleted: { x: 500, y: 761},
        assignedToPointY: 754,
        dateAssignedPointY: 769,
        dateCompletedPointY: 769
    },
};


export class TerritoryRegistryForm extends Draw<TerritoryRegistry, TerritoryRegistryFormatted> {
    
    constructor(store: Store, data: TerritoryRegistry) {
        super(store,
            'S-13-S.pdf',
            data,
            '54fa1de2ac8bc7286e0e742db3d1b59b');
    }

    fillForm(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.createDocument().then(async () => {
                Object.entries(this.formatted).forEach(([key, value]: [string, string | TerritoriesFormatted]) => {
                    if(key === 'serviceYear' && typeof value === 'string') {
                        const setting = layout.serviceYear;
                        this.drawText(value, setting.point, setting.font);
                    }

                    if(typeof value !== 'string') {
                        this.#writeTerritoryData(value);
                    }
                    
                });

                resolve(await this.document.saveAsBase64());
            }).catch(err => reject(err));
        });
    }


    #writeTerritoryData(territories: TerritoriesFormatted) {
        territories.forEach((t, i) => {
            const indexOfTerritory = i + 1;
            const setting = this.#getSettingRow(indexOfTerritory as RowRange);

            this.drawTextWithSetting(t.number, setting.numberTerritory);
            this.drawTextWithSetting(t.lastDateCompleted, setting.lastDateCompleted);

            this.#writeRegistryData(t.registries, indexOfTerritory);
            
        });
    }

    #writeRegistryData(registries: RegistriesFormatted, indexOfTerritory: number) {
        registries.forEach((r, i) => {
            const indexOfRegistry = i + 1;
            const setting = this.#getSettingRowWithColum(indexOfTerritory as RowRange, indexOfRegistry as ColumnRange);

            if(r !== undefined) {
                this.drawTextWithSetting(r.assignedTo, setting.assignedTo);
                this.drawTextWithSetting(r.dateAssigned, setting.dateAssigned);
                this.drawTextWithSetting(r.dateCompleted, setting.dateCompleted);
            }

        });
    }

    #getRowLayout(index: RowRange): Row {
        const mapper: RowMapper = {
            1: layout.row1,
            2: layout.row2,
            3: layout.row3,
            4: layout.row4,
            5: layout.row5,
            6: layout.row6,
            7: layout.row7,
            8: layout.row8,
            9: layout.row9,
            10: layout.row10,
            11: layout.row11,
            12: layout.row12,
            13: layout.row13,
            14: layout.row14,
            15: layout.row15,
            16: layout.row16,
            17: layout.row17,
            18: layout.row18,
            19: layout.row19,
            20: layout.row20,
        };

        return mapper[index];
    }

    #getColumnLayout(index: ColumnRange): Column {
        const mapper: ColumnMapper = {
            1: layout.column1,
            2: layout.column2,
            3: layout.column3,
            4: layout.column4
        };

        return mapper[index];
    }

    #getSettingRow(rowIndex: RowRange): SettingRow {

        const row = this.#getRowLayout(rowIndex);

        const numberTerritory: Setting = {
            point: row.numberTerritory,
            ...layout.numberTerritory
                        
        };

        const lastDateCompleted: Setting = {
            point: row.lastDateCompleted,
            ...layout.lastDateCompleted
        };

        return {
            numberTerritory,
            lastDateCompleted,
        };
    }

    #getSettingRowWithColum(rowIndex: RowRange, columnIndex: ColumnRange): SettingRowWithColum {

        const row = this.#getRowLayout(rowIndex);
        const colum = this.#getColumnLayout(columnIndex);

        const assignedTo: Setting = {
            point: { x: colum.assignedToPointX, y: row.assignedToPointY },
            ...layout.assignedTo
        };

        const dateAssigned: Setting= {
            point: { x: colum.dateAssignedPointX, y: row.dateAssignedPointY },
            ...layout.assignedTo
        };

        const dateCompleted: Setting= {
            point: { x: colum.dateCompletedPointX, y: row.dateCompletedPointY },
            ...layout.assignedTo
        };

        return {
            assignedTo,
            dateAssigned,
            dateCompleted
        };
    }
}