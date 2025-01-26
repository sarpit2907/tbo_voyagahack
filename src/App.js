import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Book from './pages/book';
import Home from './pages/home'; 
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path='/book' element={<Book/>}/>
    </Routes>
    </BrowserRouter>

  );
}

export default App;
