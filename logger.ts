export class Logger {
    public static log(
      message: string,
      mode: "INFO" | "WARN" | "ERROR" = "INFO",
    ): void {
      switch (mode) {
        case "INFO":
          console.log(`[${this.bold(mode)}] ${message}`);
          break;
        case "WARN":
          console.log(`[${this.yellow(mode)}] ${message}`);
          break;
        case "ERROR":
          console.log(`[${this.red(mode)}] ${message}`);
          break;
      }
    }
  
    static red = (text: string) => `\x1b[31m${text}\x1b[0m`;
    static green = (text: string) => `\x1b[32m${text}\x1b[0m`;
    static blue = (text: string) => `\x1b[34m${text}\x1b[0m`;
    static yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
    static bold = (text: string) => `\x1b[1m${text}\x1b[0m`;
    static underline = (text: string) => `\x1b[4m${text}\x1b[0m`;
    static italic = (text: string) => `\x1b[3m${text}\x1b[0m`;
  }
  