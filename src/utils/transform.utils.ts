export const IpfstoHttps = (ipfsLink: string) => {
  if (!ipfsLink) return '';

  const gatewayUrl = "https://ipfs.io/ipfs/";

  return gatewayUrl + ipfsLink.replace(/^ipfs:\/\//, "");

}