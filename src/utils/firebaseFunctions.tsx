import { Firebase } from '@utils/firebase'

const firebase = new Firebase();
const db = firebase.firestore();

export const getIPTable = (walletAddress: string) => {
  if (!walletAddress) return;
  return db.collection('ips').doc(walletAddress).get();
}

export const addNewDevice = (walletAddresID: string, body: IPs) => {
  if (!walletAddresID) {
    throw new Error("Can't be empty wallet address")
  }
  if (!body) {
    throw new Error("Can't be empty body data")
  }
  return db.collection('ips').doc(walletAddresID).set(body);
}

interface IPs {
  isWeb3User: boolean;
}