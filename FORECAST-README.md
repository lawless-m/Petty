# Pivot Table with Forecasting Demo

This is a working implementation of a pivot table with time-series forecasting capabilities!

## Features Implemented

### ✅ Core Functionality
- **Pivot Table**: Groups revenue data by territory with years as columns
- **Time-Series Forecasting**: Predicts future revenue for 1-5 years
- **Multiple Algorithms**:
  - Linear Regression
  - Exponential Smoothing (recommended)
  - Moving Average
- **Confidence Intervals**: Shows uncertainty bounds (80%, 95%, or 99%)
- **Visual Indicators**: Clear distinction between actual and forecasted data

### 📊 Algorithms

#### 1. Linear Regression
Fits a straight line through historical data points to project trends.
- Best for: Steady, consistent growth patterns
- Formula: y = mx + b

#### 2. Exponential Smoothing
Applies weighted averages with trend analysis.
- Best for: General-purpose forecasting with trend detection
- Adapts to recent changes in data

#### 3. Moving Average
Uses average of recent periods with growth rate adjustment.
- Best for: Stable data with minimal volatility
- Simple and interpretable

### 🎨 Visual Design
- **Beautiful gradient UI** with purple theme
- **Sticky headers** for easy navigation
- **Color-coded forecast columns** (orange with dashed border)
- **Responsive layout** works on all screen sizes
- **Confidence intervals** shown below each forecast

### 📈 Metrics Displayed
- Total Territories
- Historical Revenue (sum of all actual data)
- Forecasted Revenue (sum of all predictions)
- CAGR (Compound Annual Growth Rate)

## How to Run

### Option 1: Simple HTTP Server (Python)
```bash
python3 -m http.server 8000
```
Then open: http://localhost:8000/pivot-forecast.html

### Option 2: Node.js HTTP Server
```bash
npx serve
```

### Option 3: Direct File (may not work due to CORS)
Simply open `pivot-forecast.html` in your browser (Chrome may block local file access)

## Data

- **historical-data.json**: Generated dataset with revenue data from 2015-2018
- **example.json**: Original 2018 data
- **generate-historical-data.js**: Script to create historical data with realistic growth patterns

The historical data was generated from the 2018 baseline with:
- 5-15% annual growth rates (varying by company)
- Random noise (±10%) for realism
- Some companies starting in different years (2015-2017)

## How to Use

1. Open the HTML file in a web browser
2. Select your preferred forecasting method
3. Choose how many years to forecast (1-5)
4. Select confidence level (80%, 95%, or 99%)
5. Click "Generate Pivot & Forecast"

The table will display:
- **White columns**: Actual historical data (2015-2018)
- **Orange columns**: Forecasted data with confidence intervals
- **Bottom row**: Totals across all territories

## Example Use Cases

### Business Planning
"What will our revenue be by territory in 2019-2020?"
- Use Exponential Smoothing for balanced predictions
- 95% confidence level for planning
- Review confidence intervals for risk assessment

### Trend Analysis
"Which territories are growing fastest?"
- Compare historical CAGR with forecast projections
- Linear regression shows pure trend lines
- Identify territories exceeding/missing projections

### Budget Allocation
"How much should we invest in each territory?"
- Forecast revenue to estimate ROI
- Use confidence intervals for best/worst case scenarios
- Prioritize high-growth territories

## Technical Implementation

### Forecasting Engine (`Forecaster` class)
- `linearRegression(values)`: Least squares regression
- `exponentialSmoothing(values, alpha)`: ETS with trend
- `movingAverage(values, window)`: Simple moving average with growth
- `forecast(values, method, periods)`: Main forecasting function
- `calculateConfidenceInterval()`: Statistical uncertainty bounds
- `calculateAccuracy()`: MAPE, RMSE, MAE metrics

### Pivot Engine
- Groups data by row dimension (territory)
- Aggregates values by column dimension (year)
- Handles missing data gracefully
- Supports grand totals

## Future Enhancements

See `pivot-features.md` for the full list of 35 potential features, including:
- ARIMA forecasting
- Seasonal decomposition
- Chart visualization
- Drill-down to detail
- Excel export
- Multiple dimensions
- What-if scenarios

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled.

## License

Created as a demonstration of forecasting capabilities in pivot tables.
