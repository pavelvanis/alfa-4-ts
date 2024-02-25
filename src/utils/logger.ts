import winston, { Logger } from "winston";

/**
 * Service types
 */
type Service = "UDP" | "TCP" | "HTTP" | "Chat" | "Settings";

/**
 * Logging levels
 */
const levels = {
  error: 0,
  success: 1,
  receive: 2,
  send: 3,
  waiting: 4,
  info: 5,
};

/**
 * Logging colors
 */
const colors = {
  error: "red bold",
  success: "green",
  receive: "blue",
  send: "cyan",
  waiting: "gray",
  info: "white",
};

winston.addColors(colors);

/**
 * Logger class
 */
class MyLogger {
  private logger: Logger;
  private padding = 7;

  /**
   * Constructor
   */
  constructor() {
    this.logger = winston.createLogger({
      levels: levels,
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${message}`)
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize()),
        }),
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new winston.transports.File({
          filename: "logs/combined.log",
          level: "info",
        }),
      ],
    });
  }

  /**
   * Log a received message
   * @param {Service} service -The service name
   * @param {string} message - The message that was received
   */
  receive = (service: Service, message: string) => {
    this.logger.log(
      "receive",
      `(${service})`.padEnd(this.padding) + `[+] : ${message}`
    );
  };

  /**
   * Log a sent message
   * @param {Service} service -The service name
   * @param {string} message - The message that was sent
   */
  send = (service: Service, message: string) => {
    this.logger.log(
      "send",
      `(${service})`.padEnd(this.padding) + `[-] : ${message}`
    );
  };

  /**
   * Log an informational message
   * @param {Service} service -The service name
   * @param {string} message - The informational message
   */
  info = (service: Service, message: string) => {
    this.logger.log(
      "info",
      `(${service})`.padEnd(this.padding) + `[x] : ${message}`
    );
  };

  /**
   * Log an error message
   * @param {Service} service -The service name
   * @param {string} message - The error message
   */
  error = (service: Service, message: string) => {
    this.logger.log(
      "error",
      `(${service})`.padEnd(this.padding) + `[!] : ${message}`
    );
  };

  /**
   * Log an error message
   * @param {Service} service -The service name
   * @param {string} message - The error message
   */
  success = (service: Service, message: string) => {
    this.logger.log(
      "success",
      `(${service})`.padEnd(this.padding) + `[*] : ${message}`
    );
  };

  /**
   * Log a waiting message
   * @param {Service} service -The service name
   * @param {string} message - The waiting message
   */
  waiting = (service: Service, message: string) => {
    this.logger.log(
      "waiting",
      `(${service})`.padEnd(this.padding) + `[?] : ${message}`
    );
  };
}

const logger = new MyLogger();

export default logger;
