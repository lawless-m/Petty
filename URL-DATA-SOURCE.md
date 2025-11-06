# URL Data Source - Pivot Table with Forecasting

This version (`pivot-url-source.html`) fetches data from **any URL** instead of loading from a local file.

## Perfect for Apache Hosting

Upload just **one file**:
- `pivot-url-source.html`

The data is fetched from your existing URL at runtime!

## How to Use

### 1. Deploy to Apache

```bash
# Upload to Apache
scp pivot-url-source.html user@server:/var/www/html/

# Access it
# http://yourserver.com/pivot-url-source.html
```

### 2. Enter Your Data URL

In the page, enter the URL where your JSON data is hosted:
```
https://api.yourcompany.com/revenue-data.json
https://yourserver.com/data/monthly-revenue.json
```

### 3. Click "Load Data"

The page fetches the data and validates the format.

### 4. Generate Forecasts

Configure your pivot settings and click "Generate Pivot & Forecast"

## Data Format Required

Your URL must return JSON in this format:

```json
{
  "headers": [
    "acc_code",
    "cpyname",
    "country",
    "territory",
    "year_month",
    "month_name",
    "year",
    "month",
    "revenue"
  ],
  "types": [
    "string",
    "string",
    "string",
    "string",
    "string",
    "string",
    "integer",
    "integer",
    "number"
  ],
  "rows": [
    ["001", "Company A", "USA", "North America", "2023-01", "Jan 2023", 2023, 1, 50000],
    ["001", "Company A", "USA", "North America", "2023-02", "Feb 2023", 2023, 2, 55000],
    ...
  ]
}
```

### Required Fields

The data **must** include these columns:
- `territory` - Territory/region name
- `year_month` - Format: "YYYY-MM" (e.g., "2023-01")
- `revenue` - Numeric revenue value

### Optional but Recommended Fields

- `month_name` - Display label (e.g., "Jan 2023")
- `year` - Year as integer (2023)
- `month` - Month as integer (1-12)
- `country`, `cpyname`, `acc_code` - Additional metadata

## CORS Configuration

### Important: Your data URL must allow CORS

If your data is on a different domain than the HTML, the server hosting the JSON **must** include CORS headers:

```apache
# In Apache .htaccess or config
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, OPTIONS"
</IfModule>
```

Or in your API/backend:
```javascript
// Node.js/Express
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
```

### Same-Origin Setup (No CORS Needed)

If the HTML and JSON are on the **same server**, no CORS needed:

```
https://yourserver.com/pivot-url-source.html
https://yourserver.com/data/revenue.json  ← Same domain, works!
```

Example URL:
```
/data/revenue.json  (relative URL)
https://yourserver.com/data/revenue.json  (absolute URL)
```

## Features

### ✅ Remembers Last URL
- Automatically saves your URL in browser localStorage
- Next time you visit, the URL is pre-filled

### ✅ Sample Data for Testing
- Click "use sample data" to test without a URL
- Generates realistic sample data on-the-fly

### ✅ Error Handling
- Clear error messages for:
  - Network failures
  - Invalid JSON format
  - Missing required fields
  - CORS issues

### ✅ Data Validation
- Checks for required fields
- Validates JSON structure
- Shows row count after successful load

## Example Scenarios

### Scenario 1: Static JSON File
```
Your setup:
- HTML: https://mycompany.com/pivot-url-source.html
- Data: https://mycompany.com/data/monthly-revenue.json

Steps:
1. Upload both files to Apache
2. Enter URL: /data/monthly-revenue.json
3. Load and forecast!
```

### Scenario 2: Dynamic API
```
Your setup:
- HTML: https://reports.mycompany.com/pivot-url-source.html
- Data: https://api.mycompany.com/revenue?format=json

Steps:
1. Ensure API returns correct JSON format
2. Configure CORS on API server
3. Enter full API URL
4. Load and forecast!
```

### Scenario 3: Database Export
```
Your process:
1. Export database query to JSON file
2. Upload JSON to Apache
3. Update URL in pivot page
4. Refresh forecasts

Automate:
- Cron job runs daily
- Exports fresh data to monthly-revenue.json
- Pivot always shows latest data!
```

## Updating Data

### Option A: Replace File
```bash
# Update the JSON file on Apache
scp new-data.json server:/var/www/html/data/revenue.json

# Users refresh the page and click "Load Data" again
```

### Option B: Dynamic URL with Version
```
URL: https://api.example.com/revenue?date=2024-11
```
Change the URL parameter to get different data snapshots.

### Option C: Cache Busting
```
URL: https://example.com/data.json?v=20241105
```
Increment version to force fresh load.

## Troubleshooting

### "Failed to fetch"
**Cause**: Network error, URL wrong, CORS blocked

**Solutions**:
- Check URL is correct
- Verify file exists (try opening URL in browser)
- Add CORS headers if different domain
- Check browser console (F12) for details

### "Invalid data format"
**Cause**: JSON structure doesn't match expected format

**Solutions**:
- Ensure JSON has "headers" and "rows" arrays
- Check your JSON is valid (use jsonlint.com)
- Compare your JSON to example above

### "Missing required fields"
**Cause**: Data doesn't have territory, year_month, or revenue

**Solutions**:
- Verify your "headers" array includes these fields
- Check spelling is exact (case-sensitive)
- Ensure rows have values in correct positions

### CORS Error in Console
```
Access to fetch at 'https://other-domain.com/data.json'
from origin 'https://your-domain.com' has been blocked by CORS policy
```

**Solutions**:
1. Add CORS headers on the data server
2. Move JSON to same server as HTML
3. Use a CORS proxy (development only)

## Performance

- **Load time**: Depends on data size and network
- **Typical**: <1 second for 1,000 rows
- **Large datasets**: 5,000+ rows load in 2-3 seconds
- **Caching**: Browser caches responses (use ?v= for updates)

## Security Considerations

### Public Data
- If your data URL is public, anyone can access it
- Don't include sensitive information in URLs

### Private Data
Use authentication:

```javascript
// Modify the fetch call in HTML to include auth header
const response = await fetch(url, {
    headers: {
        'Authorization': 'Bearer YOUR_TOKEN'
    }
});
```

### Best Practices
- Use HTTPS for data URLs
- Limit data to necessary fields only
- Consider API authentication for sensitive data
- Implement rate limiting on API endpoints

## Advanced: Multiple Data Sources

### Switch Between Datasets

```html
<!-- Add quick links -->
<a href="#" onclick="loadQuick('https://api.com/q1-data.json')">Q1 Data</a>
<a href="#" onclick="loadQuick('https://api.com/q2-data.json')">Q2 Data</a>

<script>
function loadQuick(url) {
    document.getElementById('dataUrl').value = url;
    loadDataFromUrl();
}
</script>
```

### Combine Multiple Sources

You can modify the HTML to fetch from multiple URLs and merge:

```javascript
async function loadMultipleSources() {
    const urls = [
        'https://api.com/region1.json',
        'https://api.com/region2.json'
    ];

    const allData = await Promise.all(
        urls.map(url => fetch(url).then(r => r.json()))
    );

    // Merge rows
    const merged = {
        headers: allData[0].headers,
        types: allData[0].types,
        rows: allData.flatMap(d => d.rows)
    };

    rawData = merged;
}
```

## Benefits vs File-Based Version

| Feature | URL Version | File-Based |
|---------|-------------|------------|
| Deployment | 1 file | 2 files |
| Data updates | Just update source | Upload new JSON |
| Dynamic data | ✅ API support | ❌ Static only |
| Setup | Need CORS config | No CORS needed |
| Testing | Sample data included | Need sample file |

## Questions?

**Q: Can I use relative URLs?**
A: Yes! `/data/revenue.json` works if on same server.

**Q: Does it work with API endpoints?**
A: Yes! Any URL that returns JSON in the correct format.

**Q: What if my API has different field names?**
A: You'll need to transform the data. Add a mapping function in the HTML.

**Q: Can I password-protect the data?**
A: Yes, use HTTP Basic Auth or API keys in the fetch headers.

**Q: Will it work offline?**
A: No, it needs internet to fetch from URL. Use file-based version for offline.
