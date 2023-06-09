import { exec } from 'node:child_process';

export const isPdftkAvaliability = (): void => {
    const avaliability_command = 'pdftk --version';

    exec(avaliability_command, (error, stdout, stderr) => {

        if (error) {
            console.log('Please install pdftk before use this application.');
            console.error(`error: ${error.message}`);
            process.exit();
        }
        if (stderr) {
            console.log('Upss! an error occurred.');
            console.error(`error message: ${stderr}`);
            process.exit();
        }
        console.log(`stdout:\n${stdout}`);
    });

}