const fs = require('fs');
const { execSync } = require('child_process');

const folder = '/Users/princekhimani/Downloads/Jobs';
const files = fs.readdirSync(folder).filter(f => f !== 'Purchase Executive.docx' && f !== '.DS_Store');

let sql = `USE mutantte_rojgari_db;\n\n`;

for (const file of files) {
  let text = '';
  try {
    if (file.endsWith('.pdf')) {
      text = execSync(`pdftotext "${folder}/${file}" -`).toString();
    } else if (file.endsWith('.doc') || file.endsWith('.docx')) {
      text = execSync(`textutil -stdout -cat txt "${folder}/${file}"`).toString();
    }
    
    // Clean text and extract simple title
    let title = file.replace('.pdf', '').replace('.docx', '').replace('.doc', '');
    title = title.replace('JD-', '').replace('JD_', '').replace('JD', '').trim();
    
    let description = text.substring(0, 1500).replace(/'/g, "''").replace(/\n/g, " ");
    
    sql += `INSERT INTO jobs (id, title, description, location, status, created_at, updated_at, employment_type, salary_min, salary_max, exp_min, exp_max, contact_name, contact_number) VALUES (UUID(), '${title}', '${description}', 'Mumbai', 'Active', NOW(), NOW(), 'Full-time', 500000, 1000000, 3, 10, 'rojgari@gmail.com', '');\n\n`;
  } catch (err) {
    console.error('Error processing', file, err.message);
  }
}

fs.writeFileSync('insert_rest.sql', sql);
