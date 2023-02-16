import { collections } from '@keys/firebase';
import { Firebase } from '@utils/firebase'

const firebase = new Firebase();
const db = firebase.firestore();

export const addNewDevice = (walletAddresID: string, body: IPs) => {
  if (!walletAddresID) {
    throw new Error("Can't be empty wallet address")
  }
  if (!body) {
    throw new Error("Can't be empty body data")
  }
  return db.collection(collections.wallets).doc(walletAddresID).set(body);
}

export const getNFTs = async() => {
  return db.collection(collections.nfts).get();
}

interface IPs {
  isWeb3User: boolean;
}