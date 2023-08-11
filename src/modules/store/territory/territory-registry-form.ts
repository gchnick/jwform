import { Aligned, Form, Padding } from '../../form/domain/form'
import { Store } from '../store'
import { RegistriesFormatted, TerritoriesFormatted, TerritoryRegistry, TerritoryRegistryFormatted } from './territory-registry'

export class TerritoryRegistryForm extends Form<TerritoryRegistry, TerritoryRegistryFormatted> {
    
    constructor(store: Store, data: TerritoryRegistry) {
        super(store,
            'S-13-S.pdf',
            data,
            {
                'serviceYear': {point: {x: 448, y: 95}, font: { size: 14 }},
                'numberTerritory': { 
                    point: {x: 545, y: 168},
                    padding: [{ type: Padding.TOP, value: 32}],
                    font: {size: 20 }},
                'lastDateCompleted': 
                {
                    point: {x: 498, y: 167},
                    padding: [{type: Padding.TOP, value: 30}],
                    aligned: Aligned.CENTER,
                    font: { size: 13 }
                },
                'assignedTo':
                {
                    point: {x: 410, y: 160},
                    padding: [{ type: Padding.TOP, value: 30}, { type: Padding.LEFT, value: 106}],
                    aligned: Aligned.CENTER
                },
                'dateAssigned':
                {
                    point: {x: 435, y: 173},
                    padding: [{ type: Padding.TOP, value: 31}, { type: Padding.LEFT, value: 107}],
                    aligned: Aligned.CENTER,
                    font: {size: 11} 
                },
                'dateCompleted':
                {
                    point: {x: 382, y: 173},
                    padding: [{ type: Padding.TOP, value: 31}, { type: Padding.LEFT, value: 106}],
                    aligned: Aligned.CENTER,
                    font: {size: 11}
                },
            },
            '54fa1de2ac8bc7286e0e742db3d1b59b',
            true)
    }

    fillForm(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.createDocument().then(async () => {
                Object.entries(this.formatted).forEach(([key, value]: [string, string | TerritoriesFormatted]) => {
                    if(typeof value === 'string') {
                        const setting = this.mapper[key]
                        this.drawText(value, setting.point, setting.font)
                    }

                    if(typeof value !== 'string') {
                        value.forEach((t, indexOfTerritory) => {
                            const numberSetting = this.mapper['numberTerritory']
                            const lastDateSetting = this.mapper['lastDateCompleted']

                            this.drawTextWithSetting(t.number, numberSetting, indexOfTerritory)
                            this.drawTextWithSetting(t.lastDateCompleted, lastDateSetting, indexOfTerritory)
                            this.#writeRegistries(t.registries, indexOfTerritory)
                        })
                    }
                    
                })

                resolve(await this.document.saveAsBase64())
            }).catch(err => reject(err))
        })
    }


    #writeRegistries(registries: RegistriesFormatted, indexOfTerritory: number) {
        const assignedToSetting = this.mapper['assignedTo']
        const dateAssignedPoint = this.mapper['dateAssigned']
        const dateCompletedPoint = this.mapper['dateCompleted']

        registries.forEach((r, indexOfRegistry) => {
            if(r !== undefined) {
                this.drawTextWithSetting(r.assignedTo, assignedToSetting, indexOfTerritory, indexOfRegistry)
                this.drawTextWithSetting(r.dateAssigned, dateAssignedPoint, indexOfTerritory, indexOfRegistry)
                this.drawTextWithSetting(r.dateCompleted, dateCompletedPoint, indexOfTerritory, indexOfRegistry)
            }
        })
    }
}