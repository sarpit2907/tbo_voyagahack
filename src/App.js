import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Book from './pages/book';
import Home from './pages/home'; 
import Flight from './pages/flight';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='/book' element={<Book/>}/>
      <Route path='/flight' element={<Flight/>}/>
    </Routes>
    </BrowserRouter>

  );
}

export default App;
