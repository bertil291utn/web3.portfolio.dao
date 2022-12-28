
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { firebaseApiKey, firebaseAppID, firebaseAuthDomain, firebaseDatabaseURL, firebaseMeasurementID, firebaseMessagingInSender, firebaseProjectID, firebaseStorageBucket } from '@config/firebase';

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: firebaseApiKey,
        authDomain: firebaseAuthDomain,
        databaseURL: firebaseDatabaseURL,
        projectId: firebaseProjectID,
        storageBucket: firebaseStorageBucket,
        messagingSenderId: firebaseMessagingInSender,
        appId: firebaseAppID,
        measurementId: firebaseMeasurementID,
      })
    }
  }

  firestore() {
    return firebase.firestore()
  }
}

export { Firebase }
