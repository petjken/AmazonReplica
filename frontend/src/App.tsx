import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import BooksPage from './pages/BooksPage';
import BuyPage from "./pages/BuyPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import SiteRating from "./components/SiteRating";


function App() {
  
  return (
    <>
      <CartProvider>
        <Router>
          <SiteRating />
          <Routes>
            <Route path='/' element={<BooksPage/>}/>
            <Route path='/buy/:title/:bookID' element={<BuyPage/>}/>
            <Route path='/books' element={<BooksPage/>}/>
            <Route path='/cart' element={<CartPage/>}/>
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
