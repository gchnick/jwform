"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPdftkAvaliability = void 0;
const node_child_process_1 = require("node:child_process");
function isPdftkAvaliability() {
    const avaliability_command = 'pdftk --version';
    (0, node_child_process_1.exec)(avaliability_command, (error, stdout, stderr) => {
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
exports.isPdftkAvaliability = isPdftkAvaliability;
//# sourceMappingURL=avaliability.js.map