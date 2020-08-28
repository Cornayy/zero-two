export class Logger {
    public static info(msg: string): void {
        console.log(`\x1b[32;49m [INFO] ${msg}\x1b[0m`);
    }

    public static warn(msg: string): void {
        console.log(`\x1b[33;49m [WARN] ${msg}\x1b[0m`);
    }

    public static error(msg: NodeJS.ErrnoException): void {
        console.error(`\x1b[31;49m [ERROR] ${msg.stack}\x1b[0m`);
    }
}
