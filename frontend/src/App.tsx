import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import BooksPage from './pages/BooksPage';
import BuyPage from "./pages/BuyPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import SiteRating from "./components/SiteRating";
import AdminBooksPage from "./pages/AdminBooksPage";


function App() {
  
  return (
    <>
      <CartProvider>
        <Router>
          <SiteRating />
          <Routes>
            <Route path='/' element={<BooksPage/>}/>
            <Route path='/buy/:bookID' element={<BuyPage/>}/>
            <Route path='/books' element={<BooksPage/>}/>
            <Route path='/cart' element={<CartPage/>}/>
            <Route path='/adminbooks' element={<AdminBooksPage/>} />
          </Routes>
          
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
