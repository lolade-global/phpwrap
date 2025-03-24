// src/cli.ts
import { spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { program } from "commander";

const BIN_NAME = os.platform() === "darwin" ? "php-mac" : os.platform() === "win32" ? "php-win.exe" : "php-linux";
const BIN_PATH_IN_PKG = path.join(__dirname, "../bin", BIN_NAME);
const COMPOSER_PATH_IN_PKG = path.join(__dirname, "../bin", "composer.phar");
const CONFIG_FILE_NAME = ".phpwraprc.json";

// extract binary to tmp dir
const extractBinary = (source: string, filename: string) => {
  const dest = path.join(os.tmpdir(), `phpwrap-${filename}`);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(source, dest);
    fs.chmodSync(dest, 0o755);
  }
  return dest;
};

const phpBinary = extractBinary(BIN_PATH_IN_PKG, BIN_NAME);
const composerBinary = extractBinary(COMPOSER_PATH_IN_PKG, "composer.phar");

function runPHP(args: string[]) {
  const php = spawn(phpBinary, args, { stdio: "inherit" });
  php.on("exit", (code) => process.exit(code || 0));
}

function detectFramework(): "laravel" | "symfony" | "codeigniter" | null {
  if (fs.existsSync("artisan") && fs.existsSync("public/index.php")) return "laravel";
  if (fs.existsSync("bin/console") && fs.existsSync("config/bootstrap.php")) return "symfony";
  if (fs.existsSync("public/index.php") && fs.existsSync("app/Config")) return "codeigniter";
  return null;
}

function readConfig(): any {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE_NAME);
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (err) {
      console.error("Failed to parse config file:", err);
    }
  }
  return {};
}

const config = readConfig();

program
  .name("phpwrap")
  .description("Run PHP apps without installing PHP")
  .version("1.0.0");

program
  .command("run <script>")
  .description("Run a PHP script")
  .action((script) => {
    runPHP([script]);
  });

program
  .command("serve")
  .option("-p, --port <port>", "Port", config.port || "8000")
  .action((opts) => {
    const detected = detectFramework();
    const entry =
      detected === "laravel" || detected === "codeigniter"
        ? "public/index.php"
        : detected === "symfony"
        ? "public/index.php"
        : "index.php";

    runPHP(["-S", `localhost:${opts.port}`, entry]);
  });

program
  .command("composer [args...]")
  .description("Run composer command")
  .action((args) => {
    runPHP([composerBinary, ...(args || [])]);
  });

program
  .command("laravel [args...]")
  .description("Run Laravel artisan command")
  .action((args) => {
    runPHP(["artisan", ...(args || [])]);
  });

program
  .command("symfony [args...]")
  .description("Run Symfony console commands")
  .action((args) => {
    runPHP(["bin/console", ...(args || [])]);
  });

program
  .command("ci [args...]")
  .description("Run CodeIgniter CLI commands")
  .action((args) => {
    runPHP(["spark", ...(args || [])]);
  });

program
  .command("init <framework>")
  .description("Scaffold a new PHP project (laravel, symfony, codeigniter)")
  .action((framework) => {
    if (framework === "laravel") {
      runPHP([composerBinary, "create-project", "laravel/laravel", "."]);
    } else if (framework === "symfony") {
      runPHP([composerBinary, "create-project", "symfony/skeleton", "."]);
    } else if (framework === "codeigniter") {
      runPHP([composerBinary, "create-project", "codeigniter4/appstarter", "."]);
    } else {
      console.error("Unsupported framework. Supported: laravel, symfony, codeigniter");
    }
  });

program.parse(process.argv);
