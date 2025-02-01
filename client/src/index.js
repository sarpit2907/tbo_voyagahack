import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import Footer from './components/footer.js';
import Header from './components/header.js';
import Trip from './components/trip.js';
import DetailsProvider from './pages/context.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DetailsProvider>
    <Header />
    <div className="flex flex-col min-h-screen">
      <App />
      <Footer />
    </div>
    <Trip />
    </DetailsProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
