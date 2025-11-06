# Monthly Pivot Table with Forecasting

This is an enhanced version of the pivot table that handles **monthly data** with **partial period detection** and **seasonal forecasting**!

## Key Features

### 🎯 Partial Period Handling
**Problem Solved**: When your most recent period is incomplete (e.g., you're 8 months into 2018), it can skew forecasts downward.

**Three Solutions**:
1. **Include As-Is**: Use the partial data as-is (may underestimate)
2. **Exclude from Forecast** ✓ (recommended): Don't use incomplete period for training
3. **Project to Full Period**: Scale up partial data to estimate full period

### 📊 Multiple Aggregation Levels
View your data at different granularities:
- **Monthly**: See every individual month
- **Quarterly**: Aggregate to Q1, Q2, Q3, Q4
- **Yearly**: Sum all months into annual totals

The pivot automatically aggregates monthly data into your chosen level!

### 🔮 Enhanced Forecasting

#### Algorithms
1. **Linear Regression**: Best for steady trends
2. **Exponential Smoothing**: General purpose
3. **Seasonal Decomposition**: Detects and applies monthly patterns (e.g., holiday spikes)

#### Seasonality Detection
When using "Seasonal Decomposition", the algorithm:
- Detects repeating patterns (e.g., December is always higher)
- Calculates seasonal factors for each month
- Applies these patterns to future forecasts

### 🎨 Visual Indicators

- **White columns**: Complete historical periods
- **Yellow columns** (marked with *): Partial/incomplete periods
- **Orange columns**: Forecasted periods with confidence intervals

### ⚠️ Smart Alerts
Automatically detects and warns you about partial periods, showing:
- Which period is partial
- Completeness percentage (e.g., "67% complete")
- Current handling strategy

## Sample Data

The included `monthly-data.json` contains:
- **2,552 rows** of monthly revenue data
- **Date range**: January 2015 through August 2018
- **Partial year**: 2018 only has 8 months (realistic scenario)
- **Seasonal patterns**: Built-in monthly seasonality
  - December: 20% above average (holiday peak)
  - January: 15% below average (post-holiday slowdown)
  - August: 12% above average (summer peak)

## How to Use

### 1. Run a Web Server
```bash
cd /home/user/Petty
python3 -m http.server 8000
```
Open: http://localhost:8000/pivot-forecast-monthly.html

### 2. Configure Your Pivot

**Aggregation Level**
- Choose "Monthly" to see all months
- Choose "Quarterly" for Q1-Q4 view
- Choose "Yearly" to sum months into years

**Partial Period Handling**
- If 2018 shows as partial (it will!), choose how to handle it
- Recommended: "Exclude from Forecast"

**Forecasting**
- Select algorithm (try "Seasonal Decomposition" for monthly data)
- Set periods to forecast (12 = one year ahead)
- Choose confidence level

### 3. Click "Generate Pivot & Forecast"

## Example Output

### Yearly View (Default)
```
Territory        | 2015    | 2016    | 2017    | 2018*   | 2019📈  | 2020📈
-----------------------------------------------------------------------------
North America    | $1.2M   | $1.4M   | $1.5M   | $1.0M*  | $1.7M   | $1.8M
Iberia           | $2.5M   | $2.7M   | $2.9M   | $1.9M*  | $3.2M   | $3.5M
...
```
*2018 is partial (8 months), excluded from forecast training

### Monthly View
```
Territory     | Jan'18 | Feb'18 | ... | Aug'18 | Sep'18📈 | Oct'18📈 | Nov'18📈
----------------------------------------------------------------------------
North America | $120K  | $125K  | ... | $145K  | $152K    | $158K    | $175K
                                                  ±$18K     ±$19K     ±$22K
```

## Why Monthly Data is Better

### More Data Points
- **Yearly**: 4 years = 4 data points
- **Monthly**: 4 years = 48 data points
- **Result**: More accurate forecasts!

### Partial Period Handling
- With yearly data, you'd lose an entire year
- With monthly data, you only lose 4 months
- **Preserves** 92% of 2018 data instead of 0%

### Seasonality Detection
- Yearly data can't detect seasonal patterns
- Monthly data reveals Christmas spikes, summer slumps, etc.
- **Better predictions** for cyclical businesses

### Granular Forecasting
- Forecast next 12 months instead of just "next year"
- See **when** growth will happen, not just how much
- Plan inventory, hiring, marketing month-by-month

## Real-World Scenario

**Situation**: It's September 2018, you have data through August

**Problem**: Need to forecast Q4 2018 and all of 2019

**Solution**:
1. Set aggregation to "Yearly" or "Quarterly"
2. Partial handling: "Exclude" (don't let Aug 2018 skew forecast)
3. Method: "Seasonal Decomposition" (captures holiday patterns)
4. Forecast periods: 16 (remaining 4 months of 2018 + 12 months of 2019)

**Result**: Accurate forecasts that account for:
- Holiday seasonality (Nov/Dec spike)
- Historical growth trends
- Territory-specific patterns
- Statistical confidence intervals

## Technical Details

### Partial Period Detection
```javascript
// Automatically compares last period to historical average
const avgCount = previousPeriods.average(dataPoints);
const lastCount = currentPeriod.dataPoints;
const isPartial = lastCount < avgCount * 0.9; // Less than 90%
const completeness = (lastCount / avgCount) * 100;
```

### Seasonality Algorithm
```javascript
// Detects 12-month patterns
for each month position (Jan, Feb, ..., Dec) {
    find all January values in history
    calculate average January revenue
    compute seasonal factor = avg_january / overall_average
}

// Apply to forecasts
forecast[future_jan] = base_forecast * seasonal_factor[jan]
```

### Aggregation
```javascript
// Monthly → Quarterly
Q1 = Jan + Feb + Mar
Q2 = Apr + May + Jun
Q3 = Jul + Aug + Sep
Q4 = Oct + Nov + Dec

// Monthly → Yearly
Year = Sum of all 12 months
```

## Files

- **generate-monthly-data.js**: Creates realistic monthly data with seasonality
- **monthly-data.json**: Generated dataset (2,552 rows, 2015-01 to 2018-08)
- **pivot-forecast-monthly.html**: Full-featured pivot with partial period handling
- **MONTHLY-README.md**: This file

## Comparison: Yearly vs Monthly

| Feature | Yearly Data | Monthly Data |
|---------|-------------|--------------|
| Data points (4 years) | 4 | 48 |
| Partial period loss | 100% of year | Only incomplete months |
| Seasonality detection | ❌ No | ✅ Yes |
| Forecast granularity | Annual | Monthly/Quarterly/Annual |
| Accuracy | Lower | Higher |

## Next Steps

Try these experiments:
1. Change aggregation from Yearly → Monthly to see the detail
2. Switch partial handling and watch 2018 numbers change
3. Compare "Linear" vs "Seasonal" forecasts
4. Adjust confidence levels to see uncertainty bounds
5. Forecast different time horizons (3 months vs 2 years)

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled.
