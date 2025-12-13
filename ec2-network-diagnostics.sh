#!/bin/bash
# Network Diagnostics Script for EC2 Instance
# Run this ON the EC2 instance to check network configuration

echo "🔍 EC2 Network Diagnostics"
echo "=========================="
echo ""

# Check if running on EC2
if [ -f /sys/hypervisor/uuid ] || [ -f /sys/devices/virtual/dmi/id/product_uuid ]; then
    echo "✅ Running on EC2 instance"
else
    echo "⚠️  May not be running on EC2"
fi
echo ""

# Check SSH service status
echo "📡 SSH Service Status:"
if command -v systemctl &> /dev/null; then
    systemctl status sshd 2>/dev/null || systemctl status ssh 2>/dev/null || echo "   ⚠️  Could not check SSH service"
elif command -v service &> /dev/null; then
    service sshd status 2>/dev/null || service ssh status 2>/dev/null || echo "   ⚠️  Could not check SSH service"
fi
echo ""

# Check if SSH is listening on port 22
echo "🔌 Port 22 Status:"
if command -v netstat &> /dev/null; then
    netstat -tlnp | grep :22 || echo "   ⚠️  SSH not listening on port 22"
elif command -v ss &> /dev/null; then
    ss -tlnp | grep :22 || echo "   ⚠️  SSH not listening on port 22"
else
    echo "   ⚠️  Cannot check port status (netstat/ss not available)"
fi
echo ""

# Check iptables rules
echo "🔥 Firewall (iptables) Rules:"
if command -v iptables &> /dev/null; then
    echo "   INPUT chain:"
    sudo iptables -L INPUT -n -v | head -10
    echo ""
    echo "   Checking for SSH (port 22) rules:"
    sudo iptables -L INPUT -n -v | grep 22 || echo "   ⚠️  No explicit port 22 rule found"
else
    echo "   ⚠️  iptables not available"
fi
echo ""

# Check public IP
echo "🌐 Network Configuration:"
echo "   Public IP (from metadata):"
curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "   ⚠️  Could not get public IP"
echo ""
echo "   Private IP (from metadata):"
curl -s http://169.254.169.254/latest/meta-data/local-ipv4 2>/dev/null || echo "   ⚠️  Could not get private IP"
echo ""
echo "   Instance ID:"
curl -s http://169.254.169.254/latest/meta-data/instance-id 2>/dev/null || echo "   ⚠️  Could not get instance ID"
echo ""

# Check if in public subnet
echo "📡 Subnet Configuration:"
echo "   Checking if instance has public IP..."
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null)
if [ -n "$PUBLIC_IP" ] && [ "$PUBLIC_IP" != "" ]; then
    echo "   ✅ Instance has public IP: $PUBLIC_IP"
else
    echo "   ❌ Instance does NOT have a public IP"
    echo "   ⚠️  This means it's in a private subnet"
    echo "   ⚠️  You need a NAT Gateway or Elastic IP for external access"
fi
echo ""

# Check route table
echo "🗺️  Route Table:"
if command -v ip &> /dev/null; then
    echo "   Default route:"
    ip route | grep default || echo "   ⚠️  No default route found"
    echo ""
    echo "   All routes:"
    ip route | head -5
else
    echo "   ⚠️  ip command not available"
fi
echo ""

# Check security group (from metadata)
echo "🔒 Security Group Info:"
SG_ID=$(curl -s http://169.254.169.254/latest/meta-data/security-groups 2>/dev/null | head -1)
if [ -n "$SG_ID" ]; then
    echo "   Security Group ID: $SG_ID"
    echo "   ⚠️  Check AWS Console to verify inbound rules allow SSH from 0.0.0.0/0"
else
    echo "   ⚠️  Could not get security group ID"
fi
echo ""

# Check if SSH config allows connections
echo "📝 SSH Configuration:"
if [ -f /etc/ssh/sshd_config ]; then
    echo "   SSH config file exists"
    echo "   Checking key settings:"
    grep -E "^Port|^PermitRootLogin|^PasswordAuthentication|^PubkeyAuthentication" /etc/ssh/sshd_config 2>/dev/null | head -5 || echo "   Using defaults"
else
    echo "   ⚠️  SSH config file not found"
fi
echo ""

echo "✅ Diagnostics complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Verify Security Group allows SSH (22) from 0.0.0.0/0"
echo "   2. Check Network ACLs (if using VPC)"
echo "   3. Verify instance has public IP"
echo "   4. Check iptables rules (should allow port 22)"
echo "   5. Ensure SSH service is running"

