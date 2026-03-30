#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../js/data.js');

if (!fs.existsSync(dataPath)) {
    console.error('❌ js/data.js not found');
    process.exit(1);
}

const content = fs.readFileSync(dataPath, 'utf8');

const requiredVars = ['doctors', 'services', 'promotions'];
let missing = [];

requiredVars.forEach(v => {
    if (!content.includes(`const ${v} =`) && !content.includes(`let ${v} =`)) {
        missing.push(v);
    }
});

if (missing.length > 0) {
    console.error(`❌ Missing variables: ${missing.join(', ')}`);
    process.exit(1);
}

console.log('✅ Data validation passed');
