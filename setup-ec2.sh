#!/usr/bin/env bash
# ==============================================================================
# Ticket Management System (TMS) - Automated AWS EC2 Setup Script
# Works on Ubuntu 20.04 / 22.04 / 24.04 LTS
# ==============================================================================

set -e

echo "=========================================="
echo "🚀 Starting TMS Automated EC2 Deployment"
echo "=========================================="

# 1. Allocate Swap memory (crucial for t2.micro / t3.micro with 1GB RAM)
if [ ! -f /swapfile ]; then
    echo "💾 Configuring 2GB swap space to prevent memory issues during build..."
    sudo fallocate -l 2G /swapfile 2>/dev/null || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap space enabled."
fi

# 2. Update package lists
echo "📦 Updating system packages..."
sudo apt-get update -y

# 3. Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed successfully."
else
    echo "✅ Docker is already installed."
fi

# 4. Enable and start Docker service
sudo systemctl enable --now docker

# 5. Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "🔧 Installing Docker Compose plugin..."
    sudo apt-get install -y docker-compose-plugin
fi

echo "✅ Docker & Docker Compose ready:"
docker --version
docker compose version

# 6. Build and launch containers
echo "🏗️ Building and starting Docker containers..."
sudo docker compose down --remove-orphans || true
sudo docker compose up -d --build

# 7. Wait for services to become healthy
echo "⏳ Waiting for containers to initialize (15 seconds)..."
sleep 15

# 8. Check container status
echo "=========================================="
echo "📊 Container Status:"
sudo docker compose ps
echo "=========================================="

# 9. Print Access Information
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || curl -s ifconfig.me || echo "YOUR-EC2-PUBLIC-IP")

echo ""
echo "🎉 Deployment Complete!"
echo "------------------------------------------"
echo "🌐 Web Application URL : http://${PUBLIC_IP}"
echo "🔌 Health Check URL     : http://${PUBLIC_IP}/health"
echo "🔑 Default Super Admin  :"
echo "   - Username : superadmin"
echo "   - Password : admin123"
echo "------------------------------------------"
echo "To view live logs at any time, run:"
echo "   sudo docker compose logs -f"
echo "=========================================="

