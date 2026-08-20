const fs = require('fs');
const path = require('path');

const BIBLE_BOOKS = [
  'Kej', 'Kel', 'Ima', 'Bil', 'Ula', 'Yos', 'Hak', 'Rut', '1Sa', '2Sa',
  '1Ra', '2Ra', '1Ta', '2Ta', 'Ezr', 'Neh', 'Est', 'Ayb', 'Mzm', 'Ams',
  'Pkh', 'Kid', 'Yes', 'Yer', 'Rat', 'Yeh', 'Dan', 'Hos', 'Yoe', 'Amo',
  'Oba', 'Yun', 'Mik', 'Nah', 'Hab', 'Zef', 'Hag', 'Zak', 'Mal',
  'Mat', 'Mrk', 'Luk', 'Yoh', 'Kis', 'Rom', '1Ko', '2Ko', 'Gal', 'Efe',
  'Flp', 'Kol', '1Te', '2Te', '1Ti', '2Ti', 'Tit', 'Flm', 'Ibr', 'Yak',
  '1Pt', '2Pt', '1Yo', '2Yo', '3Yo', 'Yud', 'Why'
];

function findFile(possiblePaths) {
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function parseCsv(text) {
  let rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let nextChar = text[i + 1];

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
    if (currentRow.length > 1) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function processBibleCsv(filePath, translationCode) {
  if (!filePath || !fs.existsSync(filePath)) {
    console.log(`[SKIPPED] File not found for: ${translationCode}`);
    return '';
  }

  console.log(`[PROCESSING] Reading ${path.basename(filePath)} for translation: ${translationCode}...`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parseCsv(content);

  let headerIndex = -1;
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const r = rows[i].map(c => c.trim().toLowerCase());
    if (r.includes('verse id') || r.includes('book name') || r.includes('kitab') || r.includes('firman')) {
      headerIndex = i;
      break;
    }
  }

  let sqlStatements = '';
  const startIndex = headerIndex >= 0 ? headerIndex + 1 : 0;
  let count = 0;

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 5) continue;

    let book = '';
    let chapter = 0;
    let verse = 0;
    let textContent = '';

    if (row.length >= 6) {
      const bookNum = parseInt(row[2].trim(), 10);
      if (!isNaN(bookNum) && bookNum >= 1 && bookNum <= BIBLE_BOOKS.length) {
        book = BIBLE_BOOKS[bookNum - 1];
      } else {
        book = row[1].trim();
      }
      chapter = parseInt(row[3].trim(), 10);
      verse = parseInt(row[4].trim(), 10);
      textContent = row[5].trim();
    } else {
      book = row[1].trim();
      chapter = parseInt(row[2].trim(), 10);
      verse = parseInt(row[3].trim(), 10);
      textContent = row[4].trim();
    }

    if (!book || isNaN(chapter) || isNaN(verse)) continue;

    const cleanContent = textContent.replace(/'/g, "''");
    sqlStatements += `INSERT INTO bible_verses (book, chapter, verse, content, translation) VALUES ('${book}', ${chapter}, ${verse}, '${cleanContent}', '${translationCode}');\n`;
    count++;
  }

  console.log(`[SUCCESS] Processed ${count} verses for [${translationCode}].`);
  return sqlStatements;
}

function main() {
  console.log("=== BIBLE CSV TO SQL CONVERTER ===");

  const translations = [
    {
      code: 'TB',
      paths: [
        path.join(__dirname, 'tb.csv'),
        path.join(__dirname, 'alkitab', 'id', 'tb.csv')
      ]
    },
    {
      code: 'TL',
      paths: [
        path.join(__dirname, 'indo_tm.csv'),
        path.join(__dirname, 'tl.csv'),
        path.join(__dirname, 'alkitab', 'id', 'tl.csv'),
        path.join(__dirname, 'alkitab', 'id', 'indo_tm.csv')
      ]
    },
    {
      code: 'JVN',
      paths: [
        path.join(__dirname, 'jv_jvn.csv'),
        path.join(__dirname, 'jvn.csv'),
        path.join(__dirname, 'alkitab', 'jv', 'jv_jvn.csv'),
        path.join(__dirname, 'alkitab', 'jv', 'jvn.csv')
      ]
    },
    {
      code: 'KJV',
      paths: [
        path.join(__dirname, 'kjv.csv'),
        path.join(__dirname, 'alkitab', 'en', 'kjv.csv')
      ]
    },
    {
      code: 'KJVS',
      paths: [
        path.join(__dirname, 'kjv_strongs.csv'),
        path.join(__dirname, 'kjvs.csv'),
        path.join(__dirname, 'alkitab', 'en', 'kjv_strongs.csv'),
        path.join(__dirname, 'alkitab', 'en', 'kjvs.csv')
      ]
    },
    {
      code: 'TR',
      paths: [
        path.join(__dirname, 'tr.csv'),
        path.join(__dirname, 'alkitab', 'grc', 'tr.csv')
      ]
    },
    {
      code: 'TRP',
      paths: [
        path.join(__dirname, 'trparsed.csv'),
        path.join(__dirname, 'tr_parsed.csv'),
        path.join(__dirname, 'alkitab', 'grc', 'tr_parsed.csv'),
        path.join(__dirname, 'alkitab', 'grc', 'trparsed.csv')
      ]
    }
  ];

  let headerSql = 'CREATE TABLE IF NOT EXISTS bible_verses (id INTEGER PRIMARY KEY AUTOINCREMENT, book TEXT, chapter INTEGER, verse INTEGER, content TEXT, translation TEXT);\n';
  headerSql += 'CREATE INDEX IF NOT EXISTS idx_bible_lookup ON bible_verses(translation, book, chapter, verse);\n';
  headerSql += 'DELETE FROM bible_verses;\n';

  let fullSql = headerSql;
  let totalCount = 0;

  for (const item of translations) {
    const filePath = findFile(item.paths);
    if (!filePath) {
      console.warn(`[WARNING] File for ${item.code} not found! Check your file placement.`);
      continue;
    }
    const sql = processBibleCsv(filePath, item.code);
    if (sql) {
      fullSql += sql;
      const count = (sql.match(/INSERT INTO/g) || []).length;
      totalCount += count;
      fs.writeFileSync(path.join(__dirname, `seed_${item.code.toLowerCase()}.sql`), sql);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'seed.sql'), fullSql);
  console.log(`=============================================`);
  console.log(`ALL DONE! Created seed.sql with ${totalCount} total verses.`);
  console.log(`Also generated individual files: seed_tb.sql, seed_tl.sql, seed_tr.sql, seed_trp.sql`);
  console.log(`=============================================`);
}

main();