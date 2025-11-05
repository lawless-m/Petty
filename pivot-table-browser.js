/**
 * TypeScript Pivot Table - Browser Version
 * Similar to Excel pivot tables with flexible configuration
 */

(function(global) {
  'use strict';

  /**
   * Aggregation functions
   */
  const aggregators = {
    sum: (values) => values.reduce((a, b) => a + b, 0),
    count: (values) => values.length,
    average: (values) => values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    min: (values) => values.length > 0 ? Math.min(...values) : null,
    max: (values) => values.length > 0 ? Math.max(...values) : null,
    first: (values) => values.length > 0 ? values[0] : null,
    last: (values) => values.length > 0 ? values[values.length - 1] : null,
  };

  /**
   * Convert dataset format to array of objects for easier processing
   */
  function datasetToObjects(dataset) {
    return dataset.rows.map(row => {
      const obj = {};
      dataset.headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }

  /**
   * Convert array of objects to dataset format
   */
  function objectsToDataset(objects) {
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
  function getUniqueCombinations(data, fields) {
    const combinations = new Map();

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
   * Filter data for specific dimension values
   */
  function filterData(data, fields, values) {
    return data.filter(row => {
      return fields.every((field, index) => String(row[field] ?? '') === values[index]);
    });
  }

  /**
   * Main pivot table function
   */
  function createPivot(dataset, config) {
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
      const expandedColumnCombinations = [];
      config.values.forEach(valueConfig => {
        expandedColumnCombinations.push([valueConfig.label || `${valueConfig.aggregation}(${valueConfig.field})`]);
      });

      // Calculate data for each row and value field
      const dataMatrix = [];

      rowCombinations.forEach(rowCombo => {
        const rowData = [];

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
    const dataMatrix = [];

    rowCombinations.forEach(rowCombo => {
      const rowData = [];

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
  function pivotToTable(pivot) {
    const table = [];

    // Header row
    const headerRow = [
      ...pivot.metadata.rowFields,
      ...pivot.columnHeaders.map(col => col.join(' / '))
    ];
    table.push(headerRow);

    // Data rows
    pivot.rowHeaders.forEach((rowHeader, rowIndex) => {
      const row = [
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
  function pivotToCsv(pivot) {
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
  function pivotToHtml(pivot) {
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

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  // Export to global namespace
  global.PivotTable = {
    createPivot,
    pivotToTable,
    pivotToCsv,
    pivotToHtml,
    objectsToDataset,
    datasetToObjects
  };

})(typeof window !== 'undefined' ? window : global);
