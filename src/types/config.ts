/**
 * Interface for the application configuration.
 */
export interface Config {
  /**
   * Configuration for the ports used by the application.
   */
  ports: {
    /**
     * The port used by the HTTP server.
     */
    http_port: number;
    /**
     * The port used by the UDP server.
     */
    udp_port: number;
    /**
     * The port used by the TCP server.
     */
    tcp_port: number;
  };
  /**
   * Configuration for broadcasting.
   */
  broadcast: {
    /**
     * The interval at which broadcasts are sent (in milliseconds).
     */
    interval: number;
    /**
     * The address to which broadcasts are sent.
     */
    address: string;
  };
  /**
   * Configuration for timeouts.
   */
  timeouts: {
    /**
     * The timeout for TCP connections (in milliseconds).
     */
    tcp_timeout: number;
  };
  /**
   * The peer ID of the current instance.
   */
  my_peer_id: string;
}
