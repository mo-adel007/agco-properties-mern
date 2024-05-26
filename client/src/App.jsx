import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ListProperty from "./pages/ListProperty";
export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateRoute /> }>
        <Route path="/profile" element={<Profile /> }/>
        <Route path='/list-property' element={<ListProperty />} />
        {/* <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
