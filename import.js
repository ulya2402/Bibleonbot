const fs = require('fs');

console.log("Starting CSV to SQL conversion...");

const text = fs.readFileSync('tb.csv', 'utf-8');

let rows = [];
let currentRow = [];
let currentCell = '';
let inQuotes = false;

for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let nextChar = text[i+1];

    if (char === '"' && inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
    } else if (char === '"') {
        inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
        currentRow.push(currentCell);
        currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
            i++;
        }
        currentRow.push(currentCell);
        if (currentRow.length > 1) {
            rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
    } else {
        currentCell += char;
    }
}

if (currentRow.length > 0 || currentCell !== '') {
    currentRow.push(currentCell);
    rows.push(currentRow);
}

let sql = 'DELETE FROM bible_verses;\n';

for (let i = 1; i < rows.length; i++) {
    let row = rows[i];
    if (row.length < 5) continue;

    let id = row[0];
    let book = row[1].replace(/'/g, "''").trim();
    let chapter = row[2].trim();
    let verse = row[3].trim();
    let content = row[4].replace(/'/g, "''").trim();

    sql += `INSERT INTO bible_verses (id, book, chapter, verse, content, translation) VALUES (${id}, '${book}', ${chapter}, ${verse}, '${content}', 'TB');\n`;
}

fs.writeFileSync('seed.sql', sql);
console.log(`Success! seed.sql created with ${rows.length - 1} verses ready for Database D1.`);