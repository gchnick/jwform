import { exec } from 'node:child_process'

export const isPdftkAvaliability = (): void => {
    const avaliabilityCommand = 'pdftk --version'

    exec(avaliabilityCommand, (error, stdout, stderr) => {
        if (error != null) {
            console.log('Please install pdftk before use this application.')
            console.error(`error: ${error.message}`)
            process.exit()
        }
        if (stderr) {
            console.log('Upss! an error occurred.')
            console.error(`error message: ${stderr}`)
            process.exit()
        }
        console.log(`stdout:\n${stdout}`)
    })
}
