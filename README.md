
<div align="center">

# ⚡ SYNAPSE-X ⚡

<p align="center">
  <img src="https://img.shields.io/github/stars/Davy7000/SYNAPSE-X?style=for-the-badge&color=ff3e3e&logo=github" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/Davy7000/SYNAPSE-X?style=for-the-badge&color=22c55e&logo=git" alt="Forks"/>
  <img src="https://img.shields.io/github/license/Davy7000/SYNAPSE-X?style=for-the-badge&color=3b82f6" alt="License"/>
  <img src="https://img.shields.io/badge/Language-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="JS"/>
</p>

A lightweight WhatsApp bot framework with multi-session support and extensive configuration options. Complete rewrite of the original Synapse project for better stability and performance.

---

<a href="https://files.catbox.moe/yy99ny.jpg">
  <img src="https://files.catbox.moe/yy99ny.jpg" alt="menu" border="0" width="700" style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.3);"/>
</a>

</div>

## 🚀 Get Started

### 1. Get Your Session String
<p align="center">
  <a href="https://ossynapse.netlify.app/" target="_blank">
    <img src="https://i.ibb.co/fVWcycPc/get-session.png" alt="Get Session" width="220" style="transition: transform .2s; cursor: pointer;"/>
  </a>
</p>

> ⚠️ **Important for Cloud Deployments:** If you're deploying on platforms like **Render, Koyeb, Railway**, or similar cloud services, you'll need a `DATABASE_URL` (PostgreSQL) for persistent storage. VPS deployments can use local file storage.

### 2. Deploy and Setup Your Bot
<p align="center">
  <a href="https://ossynapse.netlify.app/" target="_blank">
    <img src="https://i.ibb.co/fVsfPsjk/deploy-bot.png" alt="Deploy Bot" width="220" style="transition: transform .2s; cursor: pointer;"/>
  </a>
</p>

---

## ✨ Features

* 🚀 **Lightweight & Fast** – Optimized core engine for instant responses.
* 👥 **Multi-Session Support** – Run single or multiple sessions simultaneously.
* 🔌 **Plugin System** – Modular system to add or remove features easily.
* 🛡️ **Group Administration** – Complete set of tools to manage your groups.
* 📥 **Media Downloader** – Download videos, audios, and documents instantly.
* 💾 **Advanced Caching** – Smart session management to prevent bans.

---

## 🛠️ Prerequisites

Make sure you have the following installed on your system or server:
* **Node.js** (v20 or higher)
* **Git**
* **FFmpeg**
* **Yarn** package manager
* **PM2** (for 24/7 background process management)

---

## 📦 Installation & Setup

### 1. Clone Repository
```bash
npm install -g yarn pm2
git clone [https://github.com/Davy7000/SYNAPSE-X.git](https://github.com/Davy7000/SYNAPSE-X.git)
cd SYNAPSE-X

```

### 2. Install Dependencies

```bash
yarn install

```

### 3. Configuration

Create a `.env` file in the root directory of the project:

#### 📊 Session Options

```env
# Single Session Mode
SESSION="RGNK~d7a5s66"

# Multi-Session Mode (Separate keys with commas)
SESSION="RGNK~d7a5s66,RGNK~7ad8cW"

```
```env
#copy and paste this selection into your raw editor

SESSION="RGNK~d7a5s66"
HANDLERS="!"
SUDO="242050336960"
LANGUAGE="en"
USE_SERVER="true"
GEMINI_API_KEY=
CMD_REACTION="true"
READ_MESSAGES="false"
ALWAYS_ONLINE="false"
DATABASE_URL=""
```

#### ⚙️ Environment Variables Layout

| Variable | Description | Default / Example |
| --- | --- | --- |
| `SESSION` | Your unique Synapse session string | `"your session"` |
| `HANDLERS` | Prefix trigger for bot commands | `!` |
| `SUDO` | Numbers authorized to control admin actions | `242050336960` |
| `LANGUAGE` | Language pack for bot responses | `en,fr,ch` |
| `USE_SERVER` | Enable/Disable web server interface | `true or false` |
| `GEMINI_API_KEY` | Your Google AI Gemini Token | `"your api key here"` |
| `CMD_REACTION` | React with emojis when running a command | `true or false` |
| `READ_MESSAGES` | Automatically mark incoming messages as read | `false or true` |
| `ALWAYS_ONLINE` | Keep WhatsApp status badge always green | `false or true` |
| `DATABASE_URL` | PostgreSQL link (Required for Cloud deployments) | `"link of your data base"` |

---

## 🎮 Running & Managing the Bot

### Start the Bot

```bash
npm start

```

### PM2 Process Controls

```bash
# Stop background process
pm2 stop SYNAPSE-X

# Restart background process
pm2 restart SYNAPSE-X

```

---

## 📜 Standard Commands Reference

> 💡 *Default prefix is set via `HANDLERS` value.*

* `!list` – Show all available commands in an interactive list.
* `!ping` – Check server response latency.
* `!restart` – Safely restart the daemon process *(Sudo Only)*.
* `!shutdown` – Turn off the framework instance *(Sudo Only)*.
* `!owner` – Sends the owner's digital vCard contact profile.

---

## 📁 File Structure Matrix

```text
SYNAPSE-X/
├── plugins/     # Custom plugins & command features (AI, Games, Moderation)
├── core/        # Core framework loaders and handlers
├── output/      # Generated multimedia outputs
├── temp/        # Volatile workspace temporary files
├── config.js    # Global environment config compiler
├── index.js     # Main engine entry point script
└── package.json # Project dependency map

```

---

## ⚖️ License & Credits

* This project is licensed under the **GPL License** - See the `LICENSE` file for details.
* Powered by [𝑻𝒘𝒊𝒍𝒊𝒈𝒉𝒕_𝑲𝒊𝒏𝒈☯❥ & K A R M A ³₆⁹ 모](https://www.google.com/search?q=)

*Note: Enjoy your life with us! 🚀*
