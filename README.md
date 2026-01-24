# lazy-vault

![npm version](https://img.shields.io/npm/v/lazy-vault?color=blue)
![license](https://img.shields.io/badge/license-MIT-green)
![status](https://img.shields.io/badge/status-stable-brightgreen)

**Security for the lazy developer.**
Stop worrying about sharing `.env` files. `lazy-vault` encrypts your secrets so you can safely commit them to Git.

Now with **Smart Profiles** and **Project Configuration**.

---

## What is lazy-vault?

`lazy-vault` is a CLI tool for **secure environment variable management**:

- Encrypt `.env` files
- Commit encrypted secrets to Git
- Sync secrets across machines safely
- Manage multiple environments (dev, prod, staging)
- Use strong cryptography without complexity

No cloud.
No accounts.
No vendor lock-in.
Your password never leaves your machine.

---

## Core Features

- **Strong Encryption**
  AES-256-GCM + Argon2id (memory-hard key derivation)

- **Git-Safe Workflow**
  Commit `.env.enc`, never `.env`

- **Smart Profiles (v2)**
  Security modes for speed vs paranoia

- **Project Configuration (v2)**
  Multi-environment support via config file

- **Merge-Safe Syncing**
  Remote secrets override conflicts, local-only keys are preserved

- **Automation Ready**
  Headless mode for CI/CD and deployments

---

## Installation

```bash
npm install -g lazy-vault
```

Or without installing:

```bash
npx lazy-vault
```

---

# Quick Start

## Initialize (Optional)

Create a project config for multi-environment setups:

```bash
lazy-vault init
```

Creates:

```json
lazy.config.json
```

---

## Lock (Encrypt)

When you add new secrets:

```bash
lazy-vault lock
```

### What it does:

- Encrypts `.env` → `.env.enc`
- Uses **AES-256-GCM + Argon2id**
- Adds `.env` to `.gitignore`
- Safe to commit `.env.enc`

---

## Sync (Decrypt & Merge)

When pulling code or deploying:

```bash
lazy-vault sync
```

### What it does:

- Decrypts `.env.enc`
- Merges into `.env`

**Smart Merge Logic:**

- Remote keys overwrite local conflicts
- Local-only keys are preserved

---

# Configuration & Profiles (v2)

## Project Configuration

`lazy.config.json`

```json
{
  "default": {
    "source": ".env",
    "output": ".env.enc",
    "security": "light"
  },
  "production": {
    "source": ".env.prod",
    "output": ".env.prod.enc",
    "security": "heavy"
  }
}
```

Now you can run:

```bash
lazy-vault lock production
lazy-vault sync production
```

---

## Security Profiles

Trade speed for paranoia.

### Light (default)

- Fast (~0.5s)
- Optimized for frequent dev usage

### Heavy

- Slow (~1s+)
- Uses ~256MB RAM
- GPU-resistant
- Designed for production secrets

```bash
lazy-vault lock --profile heavy
```

---

# Automation & CI (Headless Mode)

For scripts, pipelines, and deployments:

```bash
export LAZY_VAULT_PASSWORD="your-secure-password"
lazy-vault sync
```

PowerShell:

```powershell
$env:LAZY_VAULT_PASSWORD="your-secure-password"
lazy-vault sync
```

No interactive prompts.
Safe for CI/CD.

---

# 🛠 CLI Reference

| Command      | Description                 |
| ------------ | --------------------------- |
| `init`       | Create `lazy.config.json`   |
| `lock [env]` | Encrypt environment         |
| `sync [env]` | Decrypt & merge environment |

### Flags

| Flag                   | Description                          |
| ---------------------- | ------------------------------------ |
| `-p, --profile <mode>` | Security profile (`light` / `heavy`) |
| `-i, --input <path>`   | Input file override                  |
| `-o, --output <path>`  | Output file override                 |

---

# Security Model

- Zero-knowledge encryption
- Local-only cryptography
- Authenticated encryption (tamper detection)
- No password storage
- No recovery backdoors

> If you lose your password, your secrets **cannot be recovered**.

This is by design.

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Open a PR

Security issues should be reported responsibly.

---

# 📄 License

MIT License © ghost

---
