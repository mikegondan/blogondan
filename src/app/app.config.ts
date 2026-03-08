import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp, getApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';

const firebaseConfig = {
  apiKey: "AIzaSyCCez7L7KkcteW03ush60-qwbbQ7zWXFjY",
  authDomain: "blogondan.firebaseapp.com",
  projectId: "blogondan",
  storageBucket: "blogondan.firebasestorage.app",
  messagingSenderId: "649005601918",
  appId: "1:649005601918:web:de65368d2165e75d7e342f",
  measurementId: "G-NJGDZVTH6Q"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAppCheck(() => {
      if (typeof window !== 'undefined') {
        (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
      
      const provider = new ReCaptchaV3Provider('6Lf-KIQsAAAAAF3Urb0g2CWpL9Kawa8eJZ-pzGlo');
      return initializeAppCheck(getApp(), {
        provider,
        isTokenAutoRefreshEnabled: true
      });
    })
  ]
};
