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
import ProjectPage from "./components/ProjectPage";
import Services from "./pages/Services";
import ListYourProperty from "./pages/ListYourProperty";
import PriceIndicator from "./components/PriceIndicator";
import BudgetCalculator from "./components/BudgetCalculator";
import Results from "./pages/Results";

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
        <Route path="/services" element={<Services />} />
        <Route path="/price-indicator" element={<PriceIndicator />} />
        <Route path="/budget-calculator" element={<BudgetCalculator />} />
        <Route path="/results" element={<Results />} />

        <Route path="/list-your-property" element={<ListYourProperty />} />

        <Route path="/developer/:developer" element={<DeveloperPage />} />
        <Route path="/new-projects" element={<NewProject />} />
        <Route path="/project/:projectId" element={<ProjectPage />} />

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
