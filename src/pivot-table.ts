/**
 * TypeScript Pivot Table Implementation
 * Similar to Excel pivot tables with flexible configuration
 */

export type AggregationFunction = 'sum' | 'count' | 'average' | 'min' | 'max' | 'first' | 'last';

export interface PivotConfig {
  /** Fields to use as row headers (outer grouping) */
  rows: string[];
  /** Fields to use as column headers (inner grouping) */
  columns: string[];
  /** Fields to aggregate as values */
  values: Array<{
    field: string;
    aggregation: AggregationFunction;
    label?: string; // Optional custom label for the value field
  }>;
}

export interface PivotResult {
  /** Row headers - each element is an array of dimension values */
  rowHeaders: string[][];
  /** Column headers - each element is an array of dimension values */
  columnHeaders: string[][];
  /** Data matrix - rows x columns */
  data: (number | null)[][];
  /** Metadata about the pivot */
  metadata: {
    rowFields: string[];
    columnFields: string[];
    valueFields: Array<{ field: string; aggregation: AggregationFunction; label: string }>;
  };
}

/**
 * Input data format matching example.json structure
 */
export interface DataSet {
  headers: string[];
  types: string[];
  rows: any[][];
}

/**
 * Aggregation functions
 */
const aggregators = {
  sum: (values: number[]) => values.reduce((a, b) => a + b, 0),
  count: (values: any[]) => values.length,
  average: (values: number[]) => values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
  min: (values: number[]) => values.length > 0 ? Math.min(...values) : null,
  max: (values: number[]) => values.length > 0 ? Math.max(...values) : null,
  first: (values: any[]) => values.length > 0 ? values[0] : null,
  last: (values: any[]) => values.length > 0 ? values[values.length - 1] : null,
};

/**
 * Convert dataset format to array of objects for easier processing
 */
function datasetToObjects(dataset: DataSet): Record<string, any>[] {
  return dataset.rows.map(row => {
    const obj: Record<string, any> = {};
    dataset.headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Convert array of objects to dataset format
 */
export function objectsToDataset(objects: Record<string, any>[]): DataSet {
  if (objects.length === 0) {
    return { headers: [], types: [], rows: [] };
  }

  const headers = Object.keys(objects[0]);
  const types = headers.map(header => {
    const value = objects[0][header];
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'number';
    }
    return typeof value;
  });

  const rows = objects.map(obj => headers.map(header => obj[header]));

  return { headers, types, rows };
}

/**
 * Get unique combinations of values for given fields
 */
function getUniqueCombinations(data: Record<string, any>[], fields: string[]): string[][] {
  const combinations = new Map<string, string[]>();

  data.forEach(row => {
    const combo = fields.map(field => String(row[field] ?? ''));
    const key = combo.join('\0'); // Use null char as separator
    if (!combinations.has(key)) {
      combinations.set(key, combo);
    }
  });

  // Sort combinations
  return Array.from(combinations.values()).sort((a, b) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return a[i].localeCompare(b[i]);
      }
    }
    return 0;
  });
}

/**
 * Create a key from dimension values
 */
function makeKey(values: string[]): string {
  return values.join('\0');
}

/**
 * Filter data for specific dimension values
 */
function filterData(
  data: Record<string, any>[],
  fields: string[],
  values: string[]
): Record<string, any>[] {
  return data.filter(row => {
    return fields.every((field, index) => String(row[field] ?? '') === values[index]);
  });
}

/**
 * Main pivot table function
 */
export function createPivot(dataset: DataSet, config: PivotConfig): PivotResult {
  const data = datasetToObjects(dataset);

  // Get unique combinations for rows and columns
  const rowCombinations = config.rows.length > 0
    ? getUniqueCombinations(data, config.rows)
    : [[]]; // Single row if no row fields

  const columnCombinations = config.columns.length > 0
    ? getUniqueCombinations(data, config.columns)
    : [[]]; // Single column if no column fields

  // Build metadata
  const metadata = {
    rowFields: config.rows,
    columnFields: config.columns,
    valueFields: config.values.map(v => ({
      field: v.field,
      aggregation: v.aggregation,
      label: v.label || `${v.aggregation}(${v.field})`
    }))
  };

  // If we have multiple value fields and no column fields, use value fields as columns
  if (config.columns.length === 0 && config.values.length > 1) {
    // Each value field becomes a column
    const expandedColumnCombinations: string[][] = [];
    config.values.forEach(valueConfig => {
      expandedColumnCombinations.push([valueConfig.label || `${valueConfig.aggregation}(${valueConfig.field})`]);
    });

    // Calculate data for each row and value field
    const dataMatrix: (number | null)[][] = [];

    rowCombinations.forEach(rowCombo => {
      const rowData: (number | null)[] = [];

      config.values.forEach(valueConfig => {
        const filteredData = config.rows.length > 0
          ? filterData(data, config.rows, rowCombo)
          : data;

        const values = filteredData
          .map(row => row[valueConfig.field])
          .filter(v => v != null && v !== '');

        const result = values.length > 0
          ? aggregators[valueConfig.aggregation](values)
          : null;

        rowData.push(result);
      });

      dataMatrix.push(rowData);
    });

    return {
      rowHeaders: rowCombinations,
      columnHeaders: expandedColumnCombinations,
      data: dataMatrix,
      metadata
    };
  }

  // Standard case: calculate aggregations for each row/column intersection
  const dataMatrix: (number | null)[][] = [];

  rowCombinations.forEach(rowCombo => {
    const rowData: (number | null)[] = [];

    columnCombinations.forEach(colCombo => {
      // For multiple value fields with columns, we need to expand
      if (config.values.length > 1) {
        config.values.forEach(valueConfig => {
          let filteredData = data;

          if (config.rows.length > 0) {
            filteredData = filterData(filteredData, config.rows, rowCombo);
          }

          if (config.columns.length > 0) {
            filteredData = filterData(filteredData, config.columns, colCombo);
          }

          const values = filteredData
            .map(row => row[valueConfig.field])
            .filter(v => v != null && v !== '');

          const result = values.length > 0
            ? aggregators[valueConfig.aggregation](values)
            : null;

          rowData.push(result);
        });
      } else {
        // Single value field
        const valueConfig = config.values[0];
        let filteredData = data;

        if (config.rows.length > 0) {
          filteredData = filterData(filteredData, config.rows, rowCombo);
        }

        if (config.columns.length > 0) {
          filteredData = filterData(filteredData, config.columns, colCombo);
        }

        const values = filteredData
          .map(row => row[valueConfig.field])
          .filter(v => v != null && v !== '');

        const result = values.length > 0
          ? aggregators[valueConfig.aggregation](values)
          : null;

        rowData.push(result);
      }
    });

    dataMatrix.push(rowData);
  });

  // Expand column headers if multiple value fields
  let finalColumnHeaders = columnCombinations;
  if (config.values.length > 1 && config.columns.length > 0) {
    finalColumnHeaders = [];
    columnCombinations.forEach(colCombo => {
      config.values.forEach(valueConfig => {
        finalColumnHeaders.push([
          ...colCombo,
          valueConfig.label || `${valueConfig.aggregation}(${valueConfig.field})`
        ]);
      });
    });
  }

  return {
    rowHeaders: rowCombinations,
    columnHeaders: finalColumnHeaders,
    data: dataMatrix,
    metadata
  };
}

/**
 * Helper function to format pivot result as a 2D array for display
 */
export function pivotToTable(pivot: PivotResult): any[][] {
  const table: any[][] = [];

  // Header row
  const headerRow: any[] = [
    ...pivot.metadata.rowFields,
    ...pivot.columnHeaders.map(col => col.join(' / '))
  ];
  table.push(headerRow);

  // Data rows
  pivot.rowHeaders.forEach((rowHeader, rowIndex) => {
    const row: any[] = [
      ...rowHeader,
      ...pivot.data[rowIndex].map(val => val === null ? '' : val)
    ];
    table.push(row);
  });

  return table;
}

/**
 * Helper function to format pivot result as CSV
 */
export function pivotToCsv(pivot: PivotResult): string {
  const table = pivotToTable(pivot);
  return table.map(row =>
    row.map(cell => {
      const str = String(cell ?? '');
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  ).join('\n');
}

/**
 * Helper function to format pivot result as HTML table
 */
export function pivotToHtml(pivot: PivotResult): string {
  const table = pivotToTable(pivot);

  let html = '<table border="1" cellpadding="5" cellspacing="0">\n';

  // Header row
  html += '  <thead>\n    <tr>\n';
  table[0].forEach(cell => {
    html += `      <th>${escapeHtml(String(cell ?? ''))}</th>\n`;
  });
  html += '    </tr>\n  </thead>\n';

  // Data rows
  html += '  <tbody>\n';
  for (let i = 1; i < table.length; i++) {
    html += '    <tr>\n';
    table[i].forEach((cell, index) => {
      const tag = index < pivot.metadata.rowFields.length ? 'th' : 'td';
      const align = index < pivot.metadata.rowFields.length ? '' : ' align="right"';
      html += `      <${tag}${align}>${escapeHtml(String(cell ?? ''))}</${tag}>\n`;
    });
    html += '    </tr>\n';
  }
  html += '  </tbody>\n';

  html += '</table>';
  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
