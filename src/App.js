import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import Category from "./pages/Category";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectSignRoute from "./components/ProtectSignRoute";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";


function App() {
  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Explore/>} />
              <Route path='/offers' element={<Offers/>} />
              <Route path='/category/:categoryName' element={<Category/>} />
              <Route path='/profile' element={<PrivateRoute/>}>
                  <Route path='/profile' element={<Profile/>} />
              </Route>
              <Route path='/sign-in' element={<ProtectSignRoute/>}>
                  <Route path='/sign-in' element={<SignIn/>} />
              </Route>
              <Route path='/sign-up' element={<ProtectSignRoute/>}>
                  <Route path='/sign-up' element={<SignUp/>} />
              </Route>
              <Route path='/forgot-password' element={<ProtectSignRoute/>}>
                  <Route path='/forgot-password' element={<ForgotPassword/>} />
              </Route>
              <Route path='/create-listing' element={<CreateListing/>} />
              <Route path='/edit-listing/:listingId' element={<EditListing/>} />
              <Route path="/category/:categoryName/:listingId" element={<Listing/>}/>
              <Route path="/contact/:landlordId" element={<Contact/>}/>
          </Routes>
          {/*  Navbar here  */}
          <Navbar/>
      </Router>

        <ToastContainer theme="dark"/>
    </>
  );
}

export default App;
