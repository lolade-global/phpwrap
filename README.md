
# PHPWrap

**Run PHP apps on any system without installing PHP!**
PHPWrap bundles the PHP runtime and Composer so you can build, run, and manage PHP projects seamlessly.

---

## 🚀 Features

- ✅ Run PHP apps and scripts without installing PHP
- ✅ Supports Laravel, Symfony, CodeIgniter, and other major PHP frameworks
- ✅ Built-in PHP web server (`php -S`)
- ✅ Composer support out-of-the-box
- ✅ CLI-based and platform-independent (macOS, Linux, Windows)
- ✅ Zero-setup: just clone and start using

---

## 📦 Project Structure

```
phpwrap/
├── bin/
│   ├── php-mac
│   ├── php-linux
│   ├── php-win.exe
│   └── composer.phar
├── src/
│   └── cli.ts
├── templates/
│   └── default-php.ini
├── package.json
└── README.md
```

---

## 🛠️ Installation

1. Clone this repo:

```bash
git clone https://github.com/yourname/phpwrap.git
cd phpwrap
```

2. Install dependencies:

```bash
npm install
```

3. Make CLI executable (Linux/macOS):

```bash
chmod +x src/cli.ts
```

4. Run with:

```bash
node src/cli.ts
```

Or add a symlink to run globally:

```bash
npm link
```

---

## ⚙️ Usage

### Run PHP script

```bash
phpwrap run script.php
```

### Start built-in PHP server

```bash
phpwrap serve --port 8080
```

### Laravel Artisan

```bash
phpwrap artisan migrate
```

### Composer (built-in)

```bash
phpwrap composer install
phpwrap composer create-project laravel/laravel myApp
```

---

## 📄 Notes

- `phpwrap` detects your OS and runs the appropriate PHP binary (`php-linux`, `php-mac`, or `php-win.exe`).
- Composer support is included via `composer.phar`.

---

## 📌 Requirements

- Node.js 16+
- Git (for cloning)

---

## 📬 Contact

Created by Lolade. Contributions welcome!
