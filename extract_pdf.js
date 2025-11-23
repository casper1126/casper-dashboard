import fs from 'fs';
import pdf from 'pdf-parse';

const dataBuffer = fs.readFileSync('/Users/xiaoyuchen/Downloads/antigravity/18 天義大利旅遊手冊.pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (error) {
    console.error(error);
});
