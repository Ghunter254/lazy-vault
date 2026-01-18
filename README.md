# Lazy Env

![npm version](https://img.shields.io/npm/v/lazy-env?color=blue)
![license](https://img.shields.io/badge/license-MIT-green)
![status](https://img.shields.io/badge/status-stable-brightgreen)

**Stop leaking secrets & Start committing safely.**

`lazy-env` is a simple CLI tool that lets you **encrypt `.env` files**, commit them to Git safely, and **sync secrets across machines** using a password you control.

No cloud. No accounts. No lock-in.

---

## Why Lazy Env?

Environment variables are:

- Critical
- Sensitive
- Painful to share across machines and teams

`.env` files don’t belong in Git — but **encrypted `.env` files do**.

`lazy-env` solves this by giving you a **password-based, zero-trust workflow**.

---

## Core Features

- **Strong Encryption**
  Uses modern, authenticated encryption with a password-derived key.

- **Git-Friendly**
  Encrypt once → commit `.env.enc` → safely sync anywhere.

- **Simple CLI Workflow**
  Two commands. No config files. No magic.

- **Merge-Aware Syncing**
  Remote secrets override conflicts, local-only keys are preserved.

- **Safe by Default**
  Automatically adds `.env` to `.gitignore`.

---

## Installation

```bash
npm install -g lazy-env
```

Or use without installing:

```bash
npx lazy-env
```

---

## Quick Start

### Encrypt Your `.env`

```bash
lazy-env lock
```

You will be prompted for a password.

This will:

- Encrypt `.env` → `.env.enc`
- Add `.env` to `.gitignore`
- Leave `.env.enc` safe to commit

```bash
git add .env.enc
git commit -m "Add encrypted env"
```

---

### Sync on Another Machine

```bash
lazy-env sync
```

- Enter the same password
- `.env` will be created or merged automatically

---

## How It Works (High Level)

1. Your password is converted into a cryptographic key using a memory-hard algorithm
2. `.env` is encrypted using authenticated encryption
3. The encrypted file (`.env.enc`) contains:
   - A random salt
   - A random IV
   - An authentication tag
   - The encrypted payload

4. On sync, the file is decrypted and merged safely

**Your password is never stored. Ever.**

---

## Security Model

- **Zero-Knowledge**:
  `lazy-env` cannot recover your password.

- **Authenticated Encryption**:
  Tampered or corrupted files will fail to decrypt.

- **Local-Only Secrets**:
  All encryption happens on your machine.

**Important**
If you lose your password, your secrets cannot be recovered.

---

## Supported `.env` Format

- Simple `KEY=value` pairs
- Comments (`#`) are ignored
- Quotes are supported

```env
DATABASE_URL="postgres://localhost/db"
API_KEY=super-secret
```

Advanced `.env` features (multiline values, shell expansion) are intentionally not supported.

---

## Commands

### `lazy-env lock`

Encrypts `.env` into `.env.enc`.

```bash
lazy-env lock
```

---

### `lazy-env sync`

Decrypts `.env.enc` and merges it into `.env`.

```bash
lazy-env sync
```

---

## Contributing

Contributions are welcome.

1. Fork the repo
2. Create a feature branch
3. Open a pull request

Security-related issues should be reported responsibly.

---

## 📄 License

MIT License © ghost
