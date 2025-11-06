# Multi-Dimensional Pivot with Forecasting

**`pivot-multi-dimensional.html`** - Pivot by **multiple dimensions** simultaneously!

## Multiple Row Dimensions

Instead of just one dimension (like Territory), you can now group by:
- ✅ Territory **AND** Product
- ✅ Region **AND** Category **AND** Customer Type
- ✅ **Any combination** of fields!

## How It Works

### Visual Field Assignment

Drag-and-drop style interface (click-based):

```
📋 Available Fields          📊 Row Dimensions
- region                     → region
- product                    → product
- customer_type              → customer_type
- month                      📅 Time Period
- revenue                    → month

                             💰 Value Field
                             → revenue
```

### Step-by-Step

1. **Load Data** - Any JSON with multiple fields
2. **Click to Assign** - Click fields to assign them to:
   - Row Dimensions (multiple allowed)
   - Time Period (one required)
   - Value Field (one required)
3. **Generate** - Creates multi-level pivot table

## Example Output

### Single Dimension (Territory only)
```
Territory        | 2023    | 2024    | Forecast
-------------------------------------------------
North America    | $500K   | $550K   | $605K
Europe           | $300K   | $330K   | $363K
Asia             | $200K   | $220K   | $242K
```

### Two Dimensions (Territory + Product)
```
Territory        | Product      | 2023    | 2024    | Forecast
----------------------------------------------------------------
North America    | Electronics  | $200K   | $220K   | $242K
North America    | Clothing     | $150K   | $165K   | $182K
North America    | Food         | $150K   | $165K   | $182K
Europe           | Electronics  | $120K   | $132K   | $145K
Europe           | Clothing     | $90K    | $99K    | $109K
Europe           | Food         | $90K    | $99K    | $109K
```

### Three Dimensions (Territory + Product + Customer Type)
```
Territory     | Product      | Type | 2023  | 2024  | Forecast
---------------------------------------------------------------
North America | Electronics  | B2B  | $120K | $132K | $145K
North America | Electronics  | B2C  | $80K  | $88K  | $97K
North America | Clothing     | B2B  | $90K  | $99K  | $109K
North America | Clothing     | B2C  | $60K  | $66K  | $73K
...
```

## Features

### Visual Field Builder
- **Available Fields** panel shows all fields
- **Click to assign** fields to roles
- **Color-coded** chips:
  - 🟢 Green = Row Dimensions
  - 🔵 Blue = Time Period
  - 🔴 Red = Value Field

### Smart Auto-Detection
When you click a field, it auto-assigns based on name:
- Contains "date", "month", "period" → Time Period
- Contains "revenue", "sales", "amount" → Value Field
- Everything else → Row Dimension

You can always click to remove and reassign!

### Multi-Level Grouping
The pivot automatically:
- Groups by all row dimensions
- Aggregates values by time period
- Shows hierarchical structure
- Calculates totals

## Sample Data Structure

```json
{
  "columns": ["region", "product", "customer_type", "month", "revenue"],
  "rows": [
    ["North America", "Electronics", "B2B", "2024-01", 50000],
    ["North America", "Electronics", "B2C", "2024-01", 30000],
    ["North America", "Clothing", "B2B", "2024-01", 40000],
    ["Europe", "Electronics", "B2B", "2024-01", 25000],
    ...
  ]
}
```

**Field Assignment:**
- Row Dimensions: `region`, `product`, `customer_type`
- Time Period: `month`
- Value: `revenue`

Result: 3-dimensional pivot grouped by region → product → customer type!

## Use Cases

### Sales Analysis
**Dimensions:** Territory, Product Line, Sales Channel
**Period:** Month
**Value:** Revenue

See which products perform best in each territory and channel.

### Expense Tracking
**Dimensions:** Department, Cost Center, Expense Category
**Period:** Quarter
**Value:** Amount

Track spending across organizational hierarchies.

### Inventory Management
**Dimensions:** Warehouse, Product, Supplier
**Period:** Week
**Value:** Quantity

Monitor stock levels across multiple dimensions.

### Customer Analytics
**Dimensions:** Region, Customer Segment, Product Category
**Period:** Month
**Value:** Sales

Understand purchasing patterns by segment and location.

## Benefits vs Single Dimension

| Feature | Single Dimension | Multi-Dimensional |
|---------|------------------|-------------------|
| Grouping levels | 1 (e.g., Territory) | Unlimited (Territory + Product + ...) |
| Analysis depth | Surface level | Deep drill-down |
| Insights | Basic totals | Cross-dimensional patterns |
| Forecasting | Per territory | Per combination |
| Flexibility | Limited | Complete freedom |

## How Forecasting Works

Forecasts are generated **for each unique combination** of dimensions:

```
North America + Electronics + B2B → Forecast based on that specific combo
North America + Electronics + B2C → Different forecast
North America + Clothing + B2B → Different forecast
...
```

Each combination gets its own trend analysis and prediction!

## Visual Interface

### Available Fields Panel
Shows all fields from your data. Click any field to assign it.

### Row Dimensions Area (Green)
Shows fields you've assigned as row dimensions.
- Multiple fields allowed
- Click ✕ to remove
- Order matters (first field is primary grouping)

### Time Period Area (Blue)
Shows your selected time field.
- Only one allowed
- Required for forecasting

### Value Field Area (Red)
Shows your selected numeric field to aggregate.
- Only one allowed
- Must be numeric

## Limitations & Future

**Current:**
- Row dimensions: ✅ Multiple
- Column dimensions: ❌ Not yet (always time periods)
- Value fields: ❌ Single only

**Future Enhancements:**
- Column dimensions (e.g., pivot years as rows, products as columns)
- Multiple value fields (e.g., revenue AND quantity)
- Subtotals between dimension levels
- Expand/collapse hierarchical groups

## Technical Details

### Data Grouping
Internally creates a composite key:
```javascript
key = "North America|Electronics|B2B"
```

Then aggregates all rows matching that key by time period.

### Forecasting Per Group
Each unique combination gets independent forecast:
- Analyzes historical pattern for that combo only
- Generates predictions specific to that combo
- Confidence intervals per combo

### Table Structure
Displays all dimension fields as sticky left columns, then periods across.

## Tips

### Dimension Order Matters
```
Good: Region → Product → Type
(Regional view with product breakdown)

Also Good: Product → Region → Type
(Product view with regional breakdown)
```

Order determines hierarchy!

### Start Simple
Begin with 1-2 dimensions, then add more as needed.

### Watch Data Volume
More dimensions = more rows in output.
- 3 regions × 5 products × 2 types = 30 rows
- 10 regions × 20 products × 3 types = 600 rows

Table might get large!

## Comparison to Other Versions

| File | Dimensions | Field Mapping | Best For |
|------|------------|---------------|----------|
| pivot-forecast-monthly.html | 1 (hardcoded) | No | Simple, fixed structure |
| pivot-flexible.html | 1 (flexible) | Yes | Single dimension, any fields |
| **pivot-multi-dimensional.html** | **Multiple** | **Yes** | **Complex analysis** |

## For Apache

Upload just one file:
```bash
scp pivot-multi-dimensional.html user@server:/var/www/html/
```

Works standalone!

## Example Workflow

```
1. User loads data with: region, product, category, customer, month, revenue

2. User clicks to assign:
   - Row: region, product
   - Time: month
   - Value: revenue

3. Generates pivot table:
   Region       | Product     | Jan-24 | Feb-24 | Mar-24 | Forecast
   North America| Electronics | $100K  | $110K  | $120K  | $132K
   North America| Clothing    | $50K   | $55K   | $60K   | $66K
   Europe       | Electronics | $80K   | $88K   | $96K   | $106K
   ...

4. User can re-assign:
   - Row: product, region (reverse order)
   - See product-first view instead!
```

## When to Use

Use **multi-dimensional** when you need to:
- Analyze across multiple groupings simultaneously
- Compare combinations (e.g., "West + Electronics" vs "East + Clothing")
- Drill down into hierarchies
- Forecast for specific segment combinations

Use **single dimension** when you just need:
- Simple totals by one category
- Faster, simpler analysis
- Cleaner, smaller output tables

Both are powerful - choose based on your needs!
