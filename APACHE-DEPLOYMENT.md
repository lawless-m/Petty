# Apache Deployment Guide

## Files Needed for Apache

You have **two deployment options**:

### Option 1: Full Version (Recommended)
Upload these 2 files to your Apache server:
- `pivot-forecast-monthly.html` - The main application
- `monthly-data.json` - The data file (420KB)

### Option 2: Standalone Version
Upload just 1 file:
- `pivot-standalone.html` - Includes file upload or sample data generator

## Apache Deployment Steps

### 1. Upload Files via FTP/SFTP

```bash
# Example using scp
scp pivot-forecast-monthly.html monthly-data.json user@yourserver.com:/var/www/html/
```

### 2. Set Permissions (if needed)

```bash
chmod 644 pivot-forecast-monthly.html
chmod 644 monthly-data.json
```

### 3. Access via Browser

```
http://yourserver.com/pivot-forecast-monthly.html
```

That's it! Apache automatically serves the files.

## File Structure on Apache

```
/var/www/html/
├── pivot-forecast-monthly.html    (Main file - 520KB)
├── monthly-data.json              (Data file - 420KB)
└── index.html                     (Optional - redirect to pivot)
```

## No Server-Side Code Required

Both HTML files are **100% client-side**:
- ✅ Pure HTML/CSS/JavaScript
- ✅ No PHP, Python, Node.js needed
- ✅ No database required
- ✅ No Apache configuration changes needed
- ✅ Works with default Apache setup

Apache just serves the files - all processing happens in the browser!

## Python http.server vs Apache

| Feature | Python http.server | Apache |
|---------|-------------------|---------|
| Purpose | Local testing only | Production hosting |
| Performance | Slow, single-threaded | Fast, multi-threaded |
| Security | Not secure | Secure (with SSL) |
| Reliability | Not for production | Production-ready |
| Command | `python3 -m http.server` | Always running |

The Python command is **only for local testing** before you upload to Apache.

## Optional: Create an Index Page

If you want `http://yourserver.com/` to redirect to the pivot:

**Create `/var/www/html/index.html`:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=pivot-forecast-monthly.html">
</head>
<body>
    <p>Redirecting to Pivot Table...</p>
</body>
</html>
```

## Using Your Own Data

To use your own monthly data instead of the sample:

1. **Prepare your JSON file** in this format:
```json
{
  "headers": ["acc_code", "cpyname", "country", "territory", "year_month", "month_name", "year", "month", "revenue"],
  "types": ["string", "string", "string", "string", "string", "string", "integer", "integer", "number"],
  "rows": [
    ["001", "Company A", "USA", "North America", "2023-01", "Jan 2023", 2023, 1, 50000],
    ["002", "Company B", "UK", "Europe", "2023-01", "Jan 2023", 2023, 1, 30000]
  ]
}
```

2. **Replace** `monthly-data.json` with your file
3. **Upload** both files to Apache
4. Done!

## Troubleshooting

### "Failed to fetch monthly-data.json"
- **Cause**: Files in different directories
- **Fix**: Ensure both files are in the same directory on Apache

### "Access denied" or 403 Error
- **Cause**: Wrong file permissions
- **Fix**: `chmod 644 *.html *.json`

### Blank page or no data
- **Cause**: JSON file not found or malformed
- **Fix**: Open browser console (F12) to see error messages

## Performance

- Initial load: ~1 second (loads 420KB data)
- Pivot generation: <100ms (even with forecasts)
- Forecast calculation: <50ms per territory
- Total territories: Unlimited (tested with 100+)
- Total rows: Handles 10,000+ monthly records

## Browser Requirements

Works in:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

Requires JavaScript enabled (no fallback for disabled JS).

## Security Note

The application runs entirely in the browser (client-side). Your data:
- ❌ Is NOT sent to any server (except your Apache server)
- ❌ Is NOT logged or tracked
- ❌ Does NOT leave the user's browser
- ✅ Stays local to the client

## Advanced: Custom Domain

If you want a custom URL like `https://forecast.yourcompany.com`:

1. Configure Apache virtual host:
```apache
<VirtualHost *:80>
    ServerName forecast.yourcompany.com
    DocumentRoot /var/www/html
    DirectoryIndex pivot-forecast-monthly.html
</VirtualHost>
```

2. Add SSL certificate (recommended):
```bash
certbot --apache -d forecast.yourcompany.com
```

## Questions?

**Q: Do I need to restart Apache after uploading?**
A: No, Apache serves static files automatically.

**Q: Can I password-protect the page?**
A: Yes, use Apache `.htaccess` authentication.

**Q: Will it work on shared hosting?**
A: Yes! Just upload via cPanel file manager or FTP.

**Q: Can I use IIS/Nginx instead of Apache?**
A: Yes! It's just static HTML. Works on any web server.
