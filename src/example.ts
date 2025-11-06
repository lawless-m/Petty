/**
 * Example usage of the pivot table
 */

import { createPivot, pivotToTable, pivotToCsv, pivotToHtml, DataSet, PivotConfig } from './pivot-table';
import * as fs from 'fs';
import * as path from 'path';

// Load example data
const exampleData: DataSet = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../example.json'), 'utf-8')
);

console.log('='.repeat(80));
console.log('EXAMPLE 1: Year as columns, Revenue as value, all others as rows');
console.log('='.repeat(80));

const config1: PivotConfig = {
  rows: ['country', 'territory'],
  columns: ['year'],
  values: [{ field: 'revenue', aggregation: 'sum' }]
};

const pivot1 = createPivot(exampleData, config1);
const table1 = pivotToTable(pivot1);

// Display first few rows
console.log('\nFirst 10 rows:');
table1.slice(0, 10).forEach(row => {
  console.log(row.map(cell => String(cell).padEnd(20)).join(' '));
});

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 2: Territory as columns, multiple aggregations');
console.log('='.repeat(80));

const config2: PivotConfig = {
  rows: ['country'],
  columns: ['territory'],
  values: [
    { field: 'revenue', aggregation: 'sum', label: 'Total Revenue' },
    { field: 'revenue', aggregation: 'count', label: 'Count' }
  ]
};

const pivot2 = createPivot(exampleData, config2);
const table2 = pivotToTable(pivot2);

console.log('\nFirst 5 rows:');
table2.slice(0, 5).forEach(row => {
  console.log(row.map(cell => String(cell).padEnd(25)).join(' '));
});

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 3: Simple totals by territory (no columns)');
console.log('='.repeat(80));

const config3: PivotConfig = {
  rows: ['territory'],
  columns: [],
  values: [
    { field: 'revenue', aggregation: 'sum', label: 'Total Revenue' },
    { field: 'revenue', aggregation: 'count', label: 'Count' },
    { field: 'revenue', aggregation: 'average', label: 'Average' }
  ]
};

const pivot3 = createPivot(exampleData, config3);
const table3 = pivotToTable(pivot3);

console.log('\nAll rows:');
table3.forEach(row => {
  console.log(row.map((cell, i) => {
    const str = String(cell);
    return i === 0 ? str.padEnd(25) : str.padStart(20);
  }).join(' '));
});

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 4: Grand total (no rows or columns)');
console.log('='.repeat(80));

const config4: PivotConfig = {
  rows: [],
  columns: [],
  values: [
    { field: 'revenue', aggregation: 'sum', label: 'Total Revenue' },
    { field: 'revenue', aggregation: 'count', label: 'Count' },
    { field: 'revenue', aggregation: 'average', label: 'Average' },
    { field: 'revenue', aggregation: 'min', label: 'Min' },
    { field: 'revenue', aggregation: 'max', label: 'Max' }
  ]
};

const pivot4 = createPivot(exampleData, config4);
const table4 = pivotToTable(pivot4);

console.log('\nGrand totals:');
table4.forEach(row => {
  console.log(row.map(cell => String(cell).padEnd(20)).join(' '));
});

// Generate HTML output
console.log('\n' + '='.repeat(80));
console.log('Generating HTML output...');
console.log('='.repeat(80));

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Pivot Table Example</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 40px; }
    table {
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    th {
      background-color: #4CAF50;
      color: white;
      padding: 8px;
      text-align: left;
    }
    td {
      padding: 8px;
      border: 1px solid #ddd;
    }
    tbody th {
      background-color: #f2f2f2;
      color: #333;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .overflow {
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h1>TypeScript Pivot Table Examples</h1>

  <h2>Example 1: Year as columns, Revenue as value, Country/Territory as rows</h2>
  <div class="overflow">
    ${pivotToHtml(pivot1)}
  </div>

  <h2>Example 2: Territory as columns, multiple aggregations</h2>
  <div class="overflow">
    ${pivotToHtml(pivot2)}
  </div>

  <h2>Example 3: Simple totals by territory</h2>
  <div class="overflow">
    ${pivotToHtml(pivot3)}
  </div>

  <h2>Example 4: Grand total</h2>
  <div class="overflow">
    ${pivotToHtml(pivot4)}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../output.html'), html);
console.log('\nHTML output written to output.html');

// Generate CSV output
console.log('\n' + '='.repeat(80));
console.log('Generating CSV output...');
console.log('='.repeat(80));

fs.writeFileSync(path.join(__dirname, '../output.csv'), pivotToCsv(pivot3));
console.log('\nCSV output written to output.csv');
