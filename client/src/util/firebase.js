import {initializeApp} from 'firebase/app';
import {getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        updatePassword,
        reauthenticateWithCredential,
        EmailAuthProvider,
        signOut} from 'firebase/auth';
import {getStorage, ref, uploadBytes, getDownloadURL, updateMetadata} from 'firebase/storage';

import st from 'ryscott-st';
import {ax, helpers} from 'util';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "squawk-talk.firebaseapp.com",
  projectId: "squawk-talk",
  storageBucket: "squawk-talk.appspot.com",
  messagingSenderId: "20935253646",
  appId: "1:20935253646:web:5b2c491f158cbcd83cb3df"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const storageRef = ref(storage, 'images');

var signUp = function(user) {
  createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {
      user.uid = userCredential.user.uid;

      ax.createUser(user);
      console.log('Created firebase user.');
    })
    .catch((error) => {
      console.log(error);
    });
};

var signIn = function(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      console.log('Firebase signIn successful.');

      ax.getUser(user.uid, true);
    })
    .catch((error) => {
      helpers.alert('Login unsuccessful!');
      console.log(error);
    });
};

var updatePass = function(currentPassword, newPassword) {
  const credential = EmailAuthProvider.credential(st.user.email, currentPassword);
  const user = auth.currentUser;

  reauthenticateWithCredential(user, credential).then(() => {
    updatePassword(user, newPassword).then(() => {
      helpers.alert('Password updated!');
    }).catch((error) => {
      helpers.alert('Password update failed!');
      console.log(error);
    });
  }).catch((error) => {
    helpers.alert('Incorrect password!');
    console.log(error);
  });
};

var logOut = function() {
  signOut(auth).then(() => {
    console.log('Firebase signOut successful.');
  }).catch((error) => {
    console.log(error);
  });
};

var methods = {
  signUp,
  signIn,
  updatePass,
  logOut
};

export default methods;