import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Book from './pages/book.js';
import Home from './pages/home.js'; 
import Flight from './pages/flight.js';
import DetailsProvider from './pages/context.js';
function App() {
  return (
    <DetailsProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Book />} />
        <Route path="/flight" element={<Flight />} />
      </Routes>
    </BrowserRouter>
  </DetailsProvider>
  
  );
}

export default App;
