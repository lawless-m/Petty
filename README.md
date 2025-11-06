# TypeScript Pivot Table

A flexible TypeScript implementation of Excel-like pivot tables for data aggregation and analysis. Works in both Node.js and browser environments.

## Features

- ✨ **Excel-like pivot tables** - Configure rows, columns, and values just like Excel
- 🔢 **Multiple aggregations** - Sum, Count, Average, Min, Max, First, Last
- 🌐 **Universal** - Works in Node.js and browsers
- 📊 **Multiple output formats** - HTML, CSV, JSON, or 2D arrays
- 🎯 **TypeScript** - Fully typed for better IDE support
- 🚀 **Zero dependencies** - No external libraries required

## Installation

```bash
npm install
npm run build
```

## Quick Start

### Node.js / TypeScript

```typescript
import { createPivot, pivotToHtml } from './src/pivot-table';

// Your data in the expected format
const dataset = {
  headers: ['country', 'territory', 'year', 'revenue'],
  types: ['string', 'string', 'integer', 'number'],
  rows: [
    ['Belgium', 'Benelux', 2018, 292866],
    ['Poland', 'Eastern Europe', 2018, 59154],
    // ... more rows
  ]
};

// Configure your pivot
const config = {
  rows: ['country', 'territory'],
  columns: ['year'],
  values: [{
    field: 'revenue',
    aggregation: 'sum'
  }]
};

// Generate pivot table
const pivot = createPivot(dataset, config);
const html = pivotToHtml(pivot);
```

### Browser / HTML

Open `demo.html` in a browser to see the interactive demo:

```bash
# If you have a simple HTTP server
python -m http.server 8000
# or
npx http-server
```

Then navigate to `http://localhost:8000/demo.html`

The demo includes:
- Interactive field selection (rows, columns, values)
- Multiple aggregation options
- Live pivot table generation
- Export to CSV and JSON
- Fetches data via Ajax from `example.json`

## API Reference

### Data Format

The pivot table expects data in this format:

```typescript
interface DataSet {
  headers: string[];        // Column names
  types: string[];          // Data types for each column
  rows: any[][];           // Data rows
}
```

### Configuration

```typescript
interface PivotConfig {
  rows: string[];          // Fields to use as row headers
  columns: string[];       // Fields to use as column headers
  values: Array<{
    field: string;         // Field to aggregate
    aggregation: 'sum' | 'count' | 'average' | 'min' | 'max' | 'first' | 'last';
    label?: string;        // Optional custom label
  }>;
}
```

### Main Functions

#### `createPivot(dataset, config)`

Creates a pivot table from the dataset and configuration.

**Parameters:**
- `dataset: DataSet` - Your data
- `config: PivotConfig` - Pivot configuration

**Returns:** `PivotResult`

```typescript
interface PivotResult {
  rowHeaders: string[][];      // Row dimension values
  columnHeaders: string[][];   // Column dimension values
  data: (number | null)[][];   // Aggregated data matrix
  metadata: {
    rowFields: string[];
    columnFields: string[];
    valueFields: Array<{ field: string; aggregation: string; label: string }>;
  };
}
```

#### `pivotToTable(pivot)`

Converts pivot result to a 2D array for display.

**Returns:** `any[][]`

#### `pivotToHtml(pivot)`

Converts pivot result to an HTML table string.

**Returns:** `string`

#### `pivotToCsv(pivot)`

Converts pivot result to CSV format.

**Returns:** `string`

## Examples

### Example 1: Year as Columns, Multiple Dimensions as Rows

```typescript
const config = {
  rows: ['country', 'territory'],
  columns: ['year'],
  values: [{ field: 'revenue', aggregation: 'sum' }]
};
```

This creates a pivot table with:
- Each unique combination of country/territory as a row
- Each year as a column
- Sum of revenue in each cell

### Example 2: Multiple Aggregations

```typescript
const config = {
  rows: ['territory'],
  columns: [],
  values: [
    { field: 'revenue', aggregation: 'sum', label: 'Total Revenue' },
    { field: 'revenue', aggregation: 'count', label: 'Count' },
    { field: 'revenue', aggregation: 'average', label: 'Average' }
  ]
};
```

This creates a simple summary by territory with three metrics.

### Example 3: Multi-Dimensional Analysis

```typescript
const config = {
  rows: ['country'],
  columns: ['territory', 'year'],
  values: [{ field: 'revenue', aggregation: 'sum' }]
};
```

This creates a complex pivot with nested column headers.

### Example 4: Grand Total

```typescript
const config = {
  rows: [],
  columns: [],
  values: [
    { field: 'revenue', aggregation: 'sum', label: 'Total' },
    { field: 'revenue', aggregation: 'min', label: 'Min' },
    { field: 'revenue', aggregation: 'max', label: 'Max' }
  ]
};
```

This calculates overall statistics across the entire dataset.

## Running Examples

### Node.js Example

```bash
npm run example
```

This runs the examples in `src/example.ts` and generates:
- Console output with pivot tables
- `output.html` - HTML file with all examples
- `output.csv` - CSV export of one example

### Browser Example

Simply open `demo.html` in your browser. The demo features:

1. **Data Loading**
   - Enter any URL to load data from custom sources
   - Default loads from `example.json`
   - Validates data format automatically

2. **Interactive Configuration**
   - Select row fields (multi-select)
   - Select column fields (multi-select)
   - Choose value field and aggregation
   - Smart defaults based on field names

3. **Live Updates**
   - Click "Generate Pivot Table" to update
   - Changes reflect immediately

4. **Export Options**
   - Export CSV - Download pivot table as CSV
   - Export JSON - Download raw pivot data as JSON
   - View configuration - See current pivot settings

5. **Settings Management**
   - Save Settings - Download complete configuration including data URL, field selections, and aggregation
   - Load Settings - Upload previously saved settings to restore exact configuration
   - Settings include timestamp and are portable across sessions

## Browser Usage

Include the browser version in your HTML:

```html
<script src="pivot-table-browser.js"></script>
<script>
  // Fetch your data
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const config = {
        rows: ['category'],
        columns: ['year'],
        values: [{ field: 'sales', aggregation: 'sum' }]
      };

      const pivot = PivotTable.createPivot(data, config);
      const html = PivotTable.pivotToHtml(pivot);

      document.getElementById('result').innerHTML = html;
    });
</script>
```

## Aggregation Functions

| Function | Description | Use Case |
|----------|-------------|----------|
| `sum` | Sum of all values | Total revenue, quantities |
| `count` | Count of records | Number of transactions |
| `average` | Mean of values | Average order value |
| `min` | Minimum value | Lowest price |
| `max` | Maximum value | Highest score |
| `first` | First value in group | Initial status |
| `last` | Last value in group | Final status |

## Data Preparation

If your data is in object format, you can convert it:

```typescript
import { objectsToDataset } from './src/pivot-table';

const objects = [
  { country: 'Belgium', year: 2018, revenue: 292866 },
  { country: 'Poland', year: 2018, revenue: 59154 },
  // ...
];

const dataset = objectsToDataset(objects);
const pivot = createPivot(dataset, config);
```

## Settings File Format

When you use "Save Settings" in the browser demo, it creates a JSON file with this structure:

```json
{
  "version": "1.0",
  "dataUrl": "example.json",
  "configuration": {
    "rows": ["country", "territory"],
    "columns": ["year"],
    "valueField": "revenue",
    "aggregation": "sum"
  },
  "timestamp": "2025-01-15T10:30:00.000Z",
  "description": "Pivot table settings export"
}
```

This settings file includes:
- **dataUrl** - The URL where the data is loaded from
- **configuration** - Complete pivot configuration (rows, columns, value field, aggregation)
- **timestamp** - When the settings were saved
- **version** - Settings file format version

You can share these settings files with others or use them to quickly recreate pivot tables across sessions.

## Performance Considerations

- The pivot table performs well with datasets up to 100,000 rows
- For larger datasets, consider:
  - Pre-filtering data
  - Using fewer dimension combinations
  - Implementing pagination for display

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
