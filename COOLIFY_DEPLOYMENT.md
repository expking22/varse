# SPLAX Coolify Deployment

Use this path for hosting SPLAX from your Proxmox server.

```text
Proxmox
  -> Ubuntu 24.04 LTS VM
  -> Docker
  -> Coolify
  -> SPLAX from GitHub
```

## 1. Prepare Ubuntu

Run these commands in the Ubuntu VM:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw ca-certificates
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8000/tcp
sudo ufw --force enable
```

## 2. Install Coolify

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

After install, open:

```text
http://YOUR-VM-IP:8000
```

Create the Coolify owner account.

## 3. Deploy SPLAX

1. In Coolify, create a new project.
2. Add a new resource.
3. Choose GitHub repository.
4. Select `expking22/varse`.
5. Choose Dockerfile build.
6. Port: `3000`.
7. Add environment variables:

```text
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
```

8. Deploy.

## 4. Router Port Forwarding

Forward these from your router to the Ubuntu VM static LAN IP:

```text
External 80  -> VM 80
External 443 -> VM 443
```

Only expose Coolify port `8000` publicly if you really need it. Safer: keep it LAN-only or use VPN.

## 5. Important Data Note

The current SPLAX demo storage uses temporary server storage and browser storage. For real business use, connect a database before accepting real orders.

Recommended:

- PostgreSQL in Coolify for orders, products, templates, and settings.
- Real payment gateway integration for bKash, Nagad, and Rocket.
- Email provider for order confirmation messages.
