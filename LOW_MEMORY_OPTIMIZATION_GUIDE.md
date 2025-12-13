# Low-Memory EC2 Optimization Guide

This guide provides comprehensive optimization strategies for running 2 applications on a low-memory EC2 instance.

## 📋 Overview

The optimization package includes:
- **Swap space setup** (1-2GB if RAM < 4GB)
- **PM2 memory limits** (400MB per app)
- **Nginx worker optimization** (minimal workers)
- **Verbose logging disabled**
- **Kernel parameter tuning**
- **Scheduled restarts** (prevents memory leaks)
- **Memory monitoring tools**

## 🚀 Quick Start

### 1. Run Optimization Script

```bash
# On EC2 instance
cd ~/deployment
sudo bash optimize-low-memory-ec2.sh
```

This script will:
- ✅ Create swap file (2GB if RAM < 4GB)
- ✅ Configure PM2 with 400MB memory limits per app
- ✅ Optimize Nginx workers and enable gzip
- ✅ Disable verbose logging
- ✅ Tune kernel parameters
- ✅ Clean up caches

### 2. Setup Scheduled Restarts

```bash
# On EC2 instance
bash setup-cron-restart.sh
```

This sets up a daily restart at 3 AM to prevent memory leaks.

### 3. Monitor Memory Usage

```bash
# One-time check
bash monitor-memory.sh

# Continuous monitoring (updates every 5 seconds)
bash monitor-memory.sh --watch
```

## 📊 Optimization Details

### Memory Limits

| Component | Memory Limit | Notes |
|-----------|--------------|-------|
| Hope Physicians Backend | 400MB | Auto-restarts if exceeded |
| Ojoto Union Backend | 400MB | Auto-restarts if exceeded |
| Nginx Workers | ~50MB each | 1-2 workers (auto-detected) |
| System + Swap | ~500MB | OS and swap overhead |
| **Total** | **~1.3GB** | Safe for 2GB+ EC2 instances |

### PM2 Configuration

- **Max Memory Restart**: 400MB per app
- **Node.js Heap**: 384MB (leaves room for other processes)
- **Instances**: 1 per app (no clustering on low memory)
- **Auto-restart**: Enabled
- **Watch**: Disabled (saves CPU)

### Nginx Optimization

- **Workers**: 1-2 (based on CPU cores, max 2)
- **Connections**: 512 per worker (reduced from 1024)
- **Gzip**: Enabled (saves bandwidth)
- **Keepalive**: 65s timeout, 100 requests
- **Buffers**: Reduced sizes for low memory

### Swap Configuration

- **Size**: 2GB (if RAM < 4GB)
- **Swappiness**: 10 (prefers RAM, uses swap when needed)
- **Location**: `/swapfile`

## 🔧 Manual Optimization Steps

### 1. Setup Swap (if not done automatically)

```bash
# Create 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl vm.swappiness=10
```

### 2. Update PM2 Memory Limits

```bash
# Set memory limits for each app
pm2 restart hope-physicians-backend --update-env --max-memory-restart 400M
pm2 restart ojoto-union-backend --update-env --max-memory-restart 400M
pm2 save
```

### 3. Optimize Nginx

```bash
# Edit nginx.conf
sudo nano /etc/nginx/nginx.conf

# Set worker_processes to 1 or 2
worker_processes 2;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Disable Verbose Logging

```bash
# Set Node.js to production (error logs only)
export NODE_ENV=production

# Reduce systemd journal size
sudo journalctl --vacuum-time=1d
sudo journalctl --vacuum-size=100M

# Clean PM2 logs (keep last 3 days)
find ~/.pm2/logs -name "*.log" -type f -mtime +3 -delete
```

### 5. Free Memory Cache

```bash
# Drop page cache, dentries, and inodes
sudo sync
sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'
```

## 📈 Monitoring

### Real-time Monitoring

```bash
# System memory
watch -n 5 free -h

# PM2 processes
pm2 monit

# Top memory consumers
top -o %MEM

# Disk usage
df -h
```

### Memory Alerts

The `monitor-memory.sh` script provides:
- ✅ System memory usage
- ✅ Swap usage
- ✅ PM2 process memory
- ✅ Top memory consumers
- ✅ Disk usage
- ✅ Recommendations when memory is high

### Log Files

- **PM2 Restart Log**: `~/pm2-restart.log`
- **PM2 Process Logs**: `~/.pm2/logs/`
- **Nginx Logs**: `/var/log/nginx/`
- **System Logs**: `journalctl -u <service>`

## 🔄 Scheduled Tasks

### Daily Restart (3 AM)

Prevents memory leaks by restarting all PM2 processes daily.

```bash
# View cron job
crontab -l

# Edit cron job
crontab -e

# Manual restart
pm2 restart all
```

### Weekly Cleanup

Add to crontab for weekly cleanup:

```bash
0 2 * * 0 /path/to/cleanup-script.sh
```

## ⚠️ Troubleshooting

### High Memory Usage

1. **Check PM2 processes**:
   ```bash
   pm2 list
   pm2 monit
   ```

2. **Restart processes**:
   ```bash
   pm2 restart all
   ```

3. **Free memory cache**:
   ```bash
   sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'
   ```

4. **Check for memory leaks**:
   ```bash
   pm2 logs --lines 100
   ```

### Swap Not Working

1. **Check swap status**:
   ```bash
   swapon --show
   free -h
   ```

2. **Enable swap**:
   ```bash
   sudo swapon /swapfile
   ```

3. **Verify in fstab**:
   ```bash
   cat /etc/fstab | grep swapfile
   ```

### Nginx High Memory

1. **Reduce workers**:
   ```bash
   sudo nano /etc/nginx/nginx.conf
   # Set: worker_processes 1;
   ```

2. **Reduce connections**:
   ```bash
   # In nginx.conf events block:
   worker_connections 256;
   ```

3. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

## 📝 Best Practices

1. **Monitor regularly**: Use `monitor-memory.sh --watch` daily
2. **Restart weekly**: Let cron handle daily, but check weekly
3. **Keep logs small**: Clean logs regularly
4. **Update dependencies**: Outdated packages may have memory leaks
5. **Profile applications**: Use Node.js profiler to find memory leaks
6. **Use production mode**: Always set `NODE_ENV=production`
7. **Limit concurrent requests**: Configure rate limiting in Nginx

## 🎯 Expected Results

After optimization:
- ✅ **Memory usage**: ~60-70% of total RAM
- ✅ **Swap usage**: 0-20% (only when needed)
- ✅ **PM2 restarts**: 0-1 per day (only if memory limit hit)
- ✅ **Response times**: <200ms (with gzip enabled)
- ✅ **Uptime**: 99%+ (with scheduled restarts)

## 📚 Additional Resources

- [PM2 Memory Management](https://pm2.keymetrics.io/docs/usage/memory-limit/)
- [Nginx Performance Tuning](https://www.nginx.com/blog/tuning-nginx/)
- [Linux Memory Management](https://www.kernel.org/doc/Documentation/vm/)
- [EC2 Instance Types](https://aws.amazon.com/ec2/instance-types/)

## 🔗 Related Scripts

- `optimize-low-memory-ec2.sh` - Main optimization script
- `setup-cron-restart.sh` - Setup scheduled restarts
- `monitor-memory.sh` - Memory monitoring tool
- `deploy-multi-app.sh` - Deployment script (includes optimizations)

---

**Note**: These optimizations are designed for EC2 instances with 2-4GB RAM. For instances with more memory, you can increase limits accordingly.

