import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const srcPath = path.join(process.cwd(), 'public', 'app.jsx');
const outPath = path.join(process.cwd(), 'public', 'app.js');

const source = fs.readFileSync(srcPath, 'utf8');

const result = ts.transpileModule(source, {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    removeComments: false,
  },
});

fs.writeFileSync(outPath, result.outputText, 'utf8');
console.log(`Frontend compiled successfully to public/app.js (${result.outputText.length} bytes)`);

