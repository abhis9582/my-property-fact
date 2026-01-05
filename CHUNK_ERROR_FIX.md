# Fix for ChunkLoadError: Loading chunk failed

## Problem Analysis

The error `ChunkLoadError: Loading chunk 8746 failed` occurs because:

1. **Missing chunk file**: The JavaScript chunk file `8746-6e08cd84083af1f5.js` doesn't exist on the server
2. **Nginx serving HTML instead of JS**: When the chunk file is requested, Nginx returns HTML (404 page) instead of the JavaScript file
3. **Build mismatch**: The build on the server doesn't match what the browser expects

## Root Causes

1. **Incomplete build**: The `.next/static/chunks/` directory is missing files
2. **Nginx configuration**: All requests (including `/_next/static/`) are proxied to Next.js, which may not serve static files correctly
3. **Build not deployed**: The latest build wasn't properly deployed to the server

## Solution Steps

### Step 1: Fix Nginx Configuration

**CRITICAL**: Add this to your Nginx config **BEFORE** the `location /` block:

```nginx
server {
    listen 443 ssl;
    server_name mypropertyfact.in;
    
    # ... your SSL config ...
    
    # ADD THIS BLOCK - Serve Next.js static files directly
    location /_next/static/ {
        alias /var/www/my-property-fact/.next/static/;  # Replace with your actual path
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Your existing location / block
    location / {
        proxy_pass http://localhost:3000;
        # ... rest of your config ...
    }
}
```

**Find your app path:**
```bash
# Check PM2 processes
pm2 list
pm2 info <your-app-name>

# Or check common locations
ls -la /var/www/
ls -la /home/*/my-property-fact/
```

### Step 2: Rebuild the Application

On your server, rebuild the application:

```bash
# Navigate to your app directory
cd /path/to/your/app

# Remove old build
rm -rf .next

# Install dependencies (if needed)
npm install

# Build the application
npm run build

# Verify build output
ls -la .next/static/chunks/ | head -20
```

### Step 3: Verify Chunk Files Exist

Check if the missing chunk file exists:

```bash
# Check if the specific chunk exists
ls -la .next/static/chunks/ | grep 8746

# Or check all chunks
ls -la .next/static/chunks/
```

If the file doesn't exist, the build is incomplete. Rebuild.

### Step 4: Set Proper Permissions

Ensure Nginx can read the files:

```bash
# Set ownership (adjust user/group as needed)
sudo chown -R www-data:www-data /path/to/your/app/.next/static/
sudo chmod -R 755 /path/to/your/app/.next/static/
```

### Step 5: Restart Services

```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Next.js (if using PM2)
pm2 restart all

# Or restart Next.js directly
pm2 restart <your-app-name>
```

### Step 6: Clear Browser Cache

Users should clear their browser cache or use incognito mode to test.

## Verification

1. **Check the file directly in browser:**
   ```
   https://mypropertyfact.in/_next/static/chunks/8746-6e08cd84083af1f5.js
   ```
   - Should return JavaScript (starts with `!function` or similar)
   - Should NOT return HTML

2. **Check browser DevTools:**
   - Network tab → Look for `/_next/static/chunks/` files
   - Status should be 200 (not 404)
   - Content-Type should be `application/javascript`

3. **Check server logs:**
   ```bash
   # Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   
   # Next.js logs
   pm2 logs
   ```

## Common Issues & Fixes

### Issue: File still returns 404
**Fix**: Verify the path in Nginx `alias` matches your actual `.next/static/` location

### Issue: File returns HTML instead of JS
**Fix**: The `location /_next/static/` block must come BEFORE `location /` in Nginx config

### Issue: Permission denied
**Fix**: Run `sudo chown -R www-data:www-data /path/to/app/.next/static/`

### Issue: Build completes but chunks missing
**Fix**: Check disk space: `df -h` and ensure build completed without errors

## Prevention

1. **Always rebuild after code changes:**
   ```bash
   npm run build
   ```

2. **Verify build before deploying:**
   ```bash
   ls -la .next/static/chunks/ | wc -l  # Should show many files
   ```

3. **Test locally first:**
   ```bash
   npm run build
   npm run start
   # Test at http://localhost:3000
   ```

4. **Use CI/CD**: Automate build and deployment to prevent mismatches

## Quick Fix Script

Save this as `fix-chunks.sh` and run it:

```bash
#!/bin/bash
APP_PATH="/var/www/my-property-fact"  # Change to your path

echo "Removing old build..."
cd $APP_PATH
rm -rf .next

echo "Rebuilding..."
npm run build

echo "Setting permissions..."
sudo chown -R www-data:www-data $APP_PATH/.next/static/
sudo chmod -R 755 $APP_PATH/.next/static/

echo "Restarting services..."
sudo systemctl reload nginx
pm2 restart all

echo "Done! Check https://mypropertyfact.in"
```

Make it executable:
```bash
chmod +x fix-chunks.sh
./fix-chunks.sh
```

