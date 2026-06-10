#
<div align="center">
<h1 style='coloe:red;'>SYNAPSE-X
</h1>
  </div>
<p align="center">
  <a href="https://files.catbox.moe/yy99ny.jpg"><img src="https://files.catbox.moe/yy99ny.jpg" alt="menu" border="0"></a>
</p>

A lightweight WhatsApp bot framework with multi-session support and extensive configuration options. Complete rewrite of the original Synapse project for better stability and performance.

## Get Started

#### 1. Get Your Session String 

<p align="center">
  <a href="https://ossynapse.netlify.app/">
    <img src="https://i.ibb.co/fVWcycPc/get-session.png" alt="Get Session" width="200"/>
  </a>
</p>

**Important for Cloud Deployments:** If you're deploying on platforms like Render, Koyeb, Railway, or similar cloud services, you'll need a `DATABASE_URL` (PostgreSQL) for persistent storage. VPS deployments can use local file storage.

#### 2. Deploy and setup your bot 

<p align="center">
  <a href="https://ossynapse.netlify.app/">
    <img src="https://i.ibb.co/fVsfPsjk/deploy-bot.png" alt="Get Session" width="200"/>
  </a>
</p>

## Features

* Lightweight and fast performance
* Single and multi-session capabilities
* Extensive plugin system
* Group management tools
* Media download functionality
* Excellent caching and session management

## Prerequisites

* Node.js (version 20 or higher)
* Git
* FFmpeg
* Yarn package manager
* PM2 (for process management)
* Database URL (postgreSQL - for cloud deployments)

## Installation

### Clone Repository

```bash
npm install -g yarn pm2
git clone https://github.com/Davy7000/SYNAPSE-X.git
cd SYNAPSE-X
````

### Install Dependencies

```bash
yarn install
```

### Configuration

Create a `.env` file in the root directory:

#### Session Configuration

Single session:

```
SESSION=RGNK~d7a5s66
```

Multi-session:

```
SESSION=RGNK~d7a5s66,RGNK~7ad8cW
```

#### Required Variables

```
SESSION=""
HANDLERS="!"
SUDO="242050336960"
LANGUAGE="en"
USE_SERVER=true
GEMINI_API_KEY=
CMD_REACTION=true
READ_MESSAGES=false
ALWAYS_ONLINE=false
#for railway, koyeb and replit
DATABASE_URL=
```

## Running the Bot

```bash
npm start
```

## Process Management

```bash
# Stop bot
pm2 stop SYNAPSE-X

# Restart bot
pm2 restart SYNAPSE-X
```

## Commands

Default prefix: `!`

* `!list` – Show available commands
* `!ping` – Check response time
* `!restart` – Restart bot (sudo only)
* `!shutdown` – Stop bot (sudo only)
* `!owner` - To send me a message

## File Structure

```
SYNAPSE-X/
├── plugins/     # Bot plugins
├── core/        # Core libraries
├── output/      # Operational outputs
├── temp/        # Temporary files
├── config.js    # Configuration handler
├── index.js     # Main entry point
└── package.json # Dependencies
```
* Powered by [𝑻𝒘𝒊𝒍𝒊𝒈𝒉𝒕_𝑲𝒊𝒏𝒈☯❥ & K A R M A ³₆⁹ 모]()

## License

* GPL License - See LICENSE file for details.

---

* Note: Enjoy your life witch us

