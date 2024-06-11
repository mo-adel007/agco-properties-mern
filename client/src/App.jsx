import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ListProperty from "./pages/ListProperty";
import UpdateProperty from "./pages/UpdateProperty";
import Property from "./pages/Property";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Commercial from "./pages/Commercial";
import Developer from "./pages/Developer";
import DeveloperPage from "./pages/DeveloperPage";
import Footer from "./components/Footer";

export default function App() {
  return (

    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/listing/:listingId" element={<Property />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/developer" element={<Developer />} />
        <Route path="/developer/:developer" element={<DeveloperPage />} />

        <Route element={<PrivateRoute /> }>
        <Route path="/profile" element={<Profile /> }/>
        <Route path='/list-property' element={<ListProperty />} />
        <Route
            path='/update-listing/:listingId'
            element={<UpdateProperty />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
