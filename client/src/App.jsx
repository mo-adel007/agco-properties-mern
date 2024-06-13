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
import CreateProject from "./pages/CreateProject";
import CreateCommunity from "./pages/CreateCommunity";
import UpdateProject from "./pages/UpdateProject";
import UpdateCommunity from "./pages/UpdateCommunity";
import NewProject from "./pages/NewProject";

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
        <Route path="/new-projects" element={<NewProject />} />


        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/create-community" element={<CreateCommunity />} />

          <Route
            path="/update-listing/:listingId"
            element={<UpdateProperty />}
          />
          <Route
            path="/update-project/:projectId"
            element={<UpdateProject />}
          />
          <Route
            path="/update-community/:communityId"
            element={<UpdateCommunity />}
          />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
