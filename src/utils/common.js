export const getIPAddress = async () => {
  const res = await fetch('https://api.ipify.org?format=json');
  return res.json();
}