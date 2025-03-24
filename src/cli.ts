// src/cli.ts
import { spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { program } from "commander";

const BIN_NAME = os.platform() === "darwin"
  ? "php-mac"
  : os.platform() === "win32"
  ? "php-win.exe"
  : "php-linux";

const BIN_PATH_IN_PKG = path.join(__dirname, "../bin", BIN_NAME);
const COMPOSER_PATH_IN_PKG = path.join(__dirname, "../bin", "composer.phar");

// Robust extractBinary for pkg snapshot
function extractBinary(sourcePath: string, filename: string): string {
    const targetPath = path.join(os.tmpdir(), `phpwrap-${filename}`);
  
    if (!fs.existsSync(targetPath)) {
      const buffer = fs.readFileSync(sourcePath);
      fs.writeFileSync(targetPath, buffer, { mode: 0o755 });
      fs.chmodSync(targetPath, 0o755); // Ensure executable
    }
  
    return targetPath;
  }
  

const phpBinary = extractBinary(BIN_PATH_IN_PKG, BIN_NAME);
const composerBinary = extractBinary(COMPOSER_PATH_IN_PKG, "composer.phar");

function runPHP(args: string[]) {
  const php = spawn(phpBinary, args, { stdio: "inherit" });
  php.on("exit", (code) => process.exit(code || 0));
}

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
  .option("-p, --port <port>", "Port", "8000")
  .action((opts) => {
    runPHP(["-S", `localhost:${opts.port}`, "index.php"]);
  });

program
  .command("composer [args...]")
  .description("Run composer command")
  .action((args) => {
    runPHP([composerBinary, ...(args || [])]);
  });

program
.command('artisan [args...]')
.description('Run Laravel artisan command')
.action((args) => {
    const artisanPath = path.resolve('artisan');
    if (!fs.existsSync(artisanPath)) {
      console.error("Artisan script not found in current directory.");
      process.exit(1);
    }
    runPHP([artisanPath, ...(args || [])]);
});

program.parse(process.argv);
