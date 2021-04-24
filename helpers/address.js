export function shortenAddress(address) {
  if (!address) return "N/A";
  return `${address.substring(0, 6)}...${address.substring(36)}`;
}
