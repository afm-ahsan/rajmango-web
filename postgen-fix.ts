// postgen-fix.ts
import fs from 'fs';
import path from 'path';

const API_DIR = 'src/app/services'; // adjust path if needed

function fixObservableThrow(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');

    const original = `return throwError(error);`;
    const replacement = `return throwError(() => error);`;

    if (content.includes(original)) {
        content = content.replace(original, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
    }
}

function walkDir(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.ts')) {
            fixObservableThrow(fullPath);
        }
    }
}

walkDir(API_DIR);
