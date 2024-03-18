import * as fbAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

if (fbAdmin.apps.length === 0) {
  fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string),
    storageBucket: 'gs://parados-app.appspot.com',
  });
}

const db: fbAdmin.firestore.Firestore = fbAdmin.apps[0]!.firestore();
const textCollection = db.collection('texts');
const bucket = fbAdmin.storage().bucket();

export { 
  db,
  textCollection,
  bucket,
}