import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';

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
    provideFirestore(() => getFirestore())
  ]
};
