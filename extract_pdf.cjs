const fs = require('fs');
const pdf = require('pdf-parse');

console.log('Type of pdf:', typeof pdf);
console.log('Exports:', pdf);

try {
    const dataBuffer = fs.readFileSync('/Users/xiaoyuchen/Downloads/antigravity/18 天義大利旅遊手冊.pdf');
    // Try to call it if it's a function, or look for a method
    if (typeof pdf === 'function') {
        pdf(dataBuffer).then(data => console.log(data.text)).catch(console.error);
    } else if (pdf.default && typeof pdf.default === 'function') {
        pdf.default(dataBuffer).then(data => console.log(data.text)).catch(console.error);
    }
} catch (e) {
    console.error(e);
}
