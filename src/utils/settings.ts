import os from "os";
import config, { my_peer_id as peer_id } from "../../config.json";
import logger from "./logger";

// Extract network interface from configuration
const {
  network: { network_interface },
} = config;

const IPV4 = "IPv4";

/**
 * Get network configuration for the specified interface in the config.
 * @returns {Object} The IP and broadcast address of the network interface.
 * @throws Will throw an error if the network interface is not found or if no active IPv4 address is found.
 */
function getNetworkConfig() {
  // Get all network interfaces
  const interfaces = os.networkInterfaces();

  // Throw an error if the specified interface is not found
  if (!interfaces[network_interface]) {
    throw new Error(`No interface found with name: ${network_interface}`);
  }

  // Find the first non-internal IPv4 address
  const iface = interfaces[network_interface].find(
    ({ internal, family }) => !internal && family === IPV4
  );

  // Throw an error if no active IPv4 address is found
  if (!iface) {
    throw new Error(`No active IPv4 address found for interface: ${network_interface}`);
  }

  // Extract IP and netmask
  const { address: ip, netmask: mask } = iface;

  // Calculate broadcast address
  const broadcast = getBroadcastAddress(ip, mask);

  // Log the found IP and broadcast address
  logger.success(
    "Settings",
    `(Network) : Found active IPv4 address: ${ip} with broadcast: ${broadcast}`
  );

  // Return IP and broadcast address
  return { ip, broadcast };
}

/**
 * Calculate the broadcast address for a given IP and netmask.
 * @param {string} ip - The IP address.
 * @param {string} mask - The netmask.
 * @returns {string} The broadcast address.
 */
function getBroadcastAddress(ip: string, mask: string) {
  const ipParts = ip.split(".").map(Number);
  const maskParts = mask.split(".").map(Number);

  // Calculate broadcast address parts by applying bitwise OR to IP and inverted netmask
  const broadcastParts = ipParts.map(
    (ipPart, i) => ipPart | (~maskParts[i] & 255)
  );

  // Join broadcast address parts into a string
  return broadcastParts.join(".");
}

// Get network configuration
const network = getNetworkConfig();

// Get peer ID or use hostname if peer ID is not set
const my_peer_id = peer_id || os.hostname();

// Combine config, network, and my_peer_id into settings
const settings = { ...config, network, my_peer_id };

export default settings;