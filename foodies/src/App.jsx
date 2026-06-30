import React from 'react';
import Menubar from './components/Menubar/Menubar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact.jsx';
import ExploreFood from './pages/ExploreFood/ExploreFood';
import Market2 from "./pages/Market2/Market2.jsx";
import Market1 from "./pages/Market1/Market1.jsx";
import FoodDetails from "./pages/FoodDetails/FoodDetails.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";

const App = () => {
    return (
        <div>
            <Menubar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/explore' element={<ExploreFood />} />
                <Route path='/market1' element={<Market1 />} />
                <Route path='/market2' element={<Market2 />} />
                <Route path='/food/:id' element={<FoodDetails />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;