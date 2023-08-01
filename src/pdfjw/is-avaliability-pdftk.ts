import { exec } from 'node:child_process'

export const isPdftkAvaliability = (): void => {
    const COMMAND = 'pdftk --version'

    exec(COMMAND, (error, stdout, stderr) => {
        if (error != null) {
            console.log('Please install pdftk before use this application.')
            console.error(`error: ${error.message}`)
            globalThis.process.exit(1)
        }
        if (stderr) {
            console.log('Upss! an error occurred.')
            console.error(`error message: ${stderr}`)
            globalThis.process.exit(1)
        }
        console.log(`stdout:\n${stdout}`)
    })
}
