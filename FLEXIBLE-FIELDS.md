# Flexible Pivot with Field Mapping

The ultimate solution: **`pivot-flexible.html`** - works with ANY data structure!

## No More Required Field Names!

Your data can have fields named **anything**:
- ✅ `region`, `territory`, `zone` - all work!
- ✅ `date`, `month`, `period`, `ym` - all work!
- ✅ `revenue`, `sales`, `amount`, `value` - all work!

You simply **map your fields** to their roles in Step 2.

## How It Works

### Step 1: Load Your Data
- Enter URL or use sample data
- Any JSON format with headers/columns and rows

### Step 2: Map Your Fields
Select which field is which:
- **Row Dimension** - What to group by (territory, region, category, etc.)
- **Time Period** - Your date/month field
- **Value Field** - What to aggregate (revenue, sales, amount, etc.)
- **Period Format** - How your dates are formatted

### Step 3: Configure Forecast
- Aggregation level (monthly/quarterly/yearly)
- Forecasting algorithm
- Periods to forecast
- Confidence level

### Step 4: Generate!

## Save/Load Configuration

### 💾 Save Config Button
Saves everything:
- Data URL
- Field mappings
- Forecast settings
- Downloads as JSON file
- Also saves to browser localStorage

### 📂 Load Config Button
Restores everything:
- Upload your saved config file
- Auto-fills all settings
- Auto-loads data if URL provided
- Fields auto-mapped when data loads

### Auto-Restore
On page reload, asks if you want to restore previous session!

## Example Configurations

### E-Commerce Data
```json
{
  "columns": ["store_id", "sales_date", "total_sales", "product"],
  "rows": [
    ["STORE-001", "2024-01", 50000, "Electronics"],
    ["STORE-002", "2024-01", 30000, "Clothing"]
  ]
}
```

**Field Mapping:**
- Row Dimension: `store_id`
- Time Period: `sales_date`
- Value Field: `total_sales`

### Financial Data
```json
{
  "headers": ["dept", "ym", "expense_amt"],
  "rows": [
    ["Engineering", "2024-01-01", 150000],
    ["Marketing", "2024-01-01", 80000]
  ]
}
```

**Field Mapping:**
- Row Dimension: `dept`
- Time Period: `ym` (will auto-convert `2024-01-01` → `2024-01`)
- Value Field: `expense_amt`

### Custom Data
```json
{
  "fields": ["loc", "when", "qty"],
  "data": [
    ["North", "2024-01", 1000],
    ["South", "2024-01", 800]
  ]
}
```

Just use `fields` and `data` - the tool detects both!

## Supported Data Formats

### Format 1: headers + rows
```json
{
  "headers": ["field1", "field2", ...],
  "rows": [[val1, val2, ...], ...]
}
```

### Format 2: columns + rows
```json
{
  "columns": ["field1", "field2", ...],
  "rows": [[val1, val2, ...], ...]
}
```

### Format 3: Auto-detect
If no headers/columns, creates `column_0`, `column_1`, etc.

## Period Format Support

### YYYY-MM
```
2024-01, 2024-02, 2024-03
```
Perfect for monthly data.

### YYYY-MM-DD
```
2024-01-15, 2024-02-20, 2024-03-10
```
Automatically extracts YYYY-MM for aggregation.

### Auto-detect
Tries to figure out your format automatically!

## Auto-Detection

The tool tries to guess your field mappings based on field names:

### Dimension Field
Looks for: `region`, `territory`, `category`, `dimension`, `zone`, `area`

### Period Field
Looks for: `date`, `month`, `period`, `time`, `year_month`, `ym`, `when`

### Value Field
Looks for: `revenue`, `sales`, `amount`, `value`, `total`, `qty`, `quantity`

You can always override the auto-detection!

## Configuration File Format

When you save, you get a JSON file like:

```json
{
  "version": "1.0",
  "dataUrl": "https://api.example.com/data.json",
  "fieldMapping": {
    "dimensionIdx": 3,
    "periodIdx": 4,
    "valueIdx": 5,
    "periodFormat": "YYYY-MM"
  },
  "forecastSettings": {
    "aggregation": "yearly",
    "partialHandling": "exclude",
    "forecastMethod": "exponential",
    "forecastPeriods": 12,
    "confidenceLevel": 0.95
  },
  "timestamp": "2024-11-05T10:30:00.000Z"
}
```

## Use Cases

### Daily Downloads
**Scenario**: Export from database daily, upload to server

**Setup**:
1. Export query results to JSON (any field names)
2. Upload to `https://yourserver.com/data/latest.json`
3. Map fields once, save config
4. Every day: Load config, data auto-loads!

### Multi-Region Teams
**Scenario**: Different regions use different field names

**Setup**:
1. Create separate config for each region
   - `config-north-america.json`
   - `config-emea.json`
   - `config-apac.json`
2. Team members load their region's config
3. Same pivot, different data sources/mappings!

### A/B Testing
**Scenario**: Compare different data sources

**Setup**:
1. Save config for Source A
2. Save config for Source B
3. Quickly switch between configs to compare forecasts!

## Benefits

| Feature | Old Version | Flexible Version |
|---------|-------------|------------------|
| Field names | Must be exact | Any names work |
| Setup | Hardcoded | Visual mapping |
| Reusability | Manual setup each time | Save/load configs |
| Teams | Must coordinate names | Each team uses own names |
| Data sources | One format | Unlimited formats |

## Tips

### Best Practices
1. **Save config after first setup** - Never map fields again!
2. **Name configs clearly** - `config-monthly-revenue.json`
3. **Share configs with team** - Everyone uses same mappings
4. **Version your configs** - Track changes over time

### Workflow
```
First Time:
1. Load data from URL
2. Map fields (tool tries to auto-detect)
3. Configure forecast
4. Save config ← Important!
5. Generate pivot

Every Time After:
1. Load config
2. Generate pivot ← That's it!
```

### Multiple Datasets
Keep separate configs for:
- Different time periods
- Different product lines
- Different regions
- Different data sources

## Troubleshooting

### Fields Not Auto-Detected
**Problem**: Tool didn't guess your fields correctly

**Solution**: Manually select from dropdowns - works fine!

### Config Not Restoring
**Problem**: Config file won't load

**Solution**:
- Check it's valid JSON
- Ensure field indices exist in your data
- Try clearing browser localStorage

### Period Format Issues
**Problem**: Dates not parsing correctly

**Solution**:
- Try "Auto-detect" option
- Or manually specify format
- Ensure dates are in YYYY-MM or YYYY-MM-DD format

## For Apache

Upload just ONE file:
```
pivot-flexible.html
```

Your data stays at its URL. Config files are local (downloads to user's computer).

## Example Session

```
User: Opens pivot-flexible.html

1. Clicks "Load Config"
2. Selects: quarterly-forecast-config.json

System:
   ✅ Configuration loaded! Saved on 11/4/2024
   ✅ Click "Load from URL" to fetch data

User: Waits 1 second

System:
   📥 Auto-loading from https://api.company.com/q4-data.json
   ✅ Data loaded & field mappings auto-applied!

User: Clicks "Apply Mapping"

System:
   ✅ Fields mapped! Ready to forecast

User: Clicks "Generate Pivot & Forecast"

System:
   📊 Displays pivot table with Q4 forecasts
```

Total time: 5 seconds!

## Configuration Storage

### LocalStorage
- Automatically saves last config
- Restores on page reload
- Per-browser storage

### Downloaded Files
- Portable between browsers
- Shareable with team
- Version controllable

Both methods work together!

## Comparison

| File | Required Fields | Field Mapping | Config Save |
|------|----------------|---------------|-------------|
| pivot-forecast-monthly.html | ✅ Yes (hardcoded) | ❌ No | ❌ No |
| pivot-url-source.html | ✅ Yes (hardcoded) | ❌ No | ❌ No |
| **pivot-flexible.html** | ❌ No | ✅ Yes | ✅ Yes |

**Recommendation**: Use `pivot-flexible.html` - it's the most powerful!
