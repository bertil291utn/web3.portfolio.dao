import { Firebase } from '@utils/firebase'

export const getIPTable = (walletAddress: string) => {
  if (!walletAddress) return;
  const firebase = new Firebase();
  return firebase.firestore().collection('ips').doc(walletAddress).get();
}