import * as pdf from 'pdf-parse';
import fs from 'fs';

console.log(pdf);

const dataBuffer = fs.readFileSync('/Users/xiaoyuchen/Downloads/antigravity/18 天義大利旅遊手冊.pdf');

// Check if there is a default export that is a function
if (typeof pdf.default === 'function') {
    pdf.default(dataBuffer).then(data => console.log(data.text)).catch(console.error);
} else {
    console.log("No default function found");
}
