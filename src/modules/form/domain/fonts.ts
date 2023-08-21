import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { FileNotFound } from './errors'


export type Font = {
    name?: ExtraFonts,
    size?: number
}

type FontPath = Record<ExtraFonts, string>

export enum ExtraFonts {
    Ubuntu = 'Ubuntu',
    Roboto = 'Roboto'
}

const PATHS: FontPath = {
    'Ubuntu' : '../../../assents/fonts/ubuntu.ttf',
    'Roboto': '../../../assents/fonts/roboto.ttf'
}

export function getFont(font: ExtraFonts) {
    const fontpath = PATHS[font]
    if(!existsSync(fontpath)) throw FileNotFound(`The font -> '${font}' is not fount`)
    return fs.readFile(fontpath)
}