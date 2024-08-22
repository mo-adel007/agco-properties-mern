import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/userPages/Home";
import SignIn from "./pages/auth/SignIn";
import Profile from "./pages/adminDashboard/Profile";
import Header from "./components/layouts/Header";
import PrivateRoute from "./components/PrivateRoute";
import ListProperty from "./pages/adminDashboard/ListProperty";
import UpdateProperty from "./pages/adminDashboard/UpdateProperty";
import Property from "./pages/userPages/Property";
import Buy from "./pages/userPages/Buy";
import Rent from "./pages/userPages/Rent";
import Commercial from "./pages/userPages/Commercial";
import Developer from "./pages/userPages/Developer";
import DeveloperPage from "./pages/userPages/DeveloperPage";
import Footer from "./components/layouts/Footer";
import CreateProject from "./pages/adminDashboard/CreateProject";
import CreateCommunity from "./pages/adminDashboard/CreateCommunity";
import UpdateProject from "./pages/adminDashboard/UpdateProject";
import UpdateCommunity from "./pages/adminDashboard/UpdateCommunity";
import NewProject from "./pages/userPages/NewProject";
import ProjectPage from "./components/Project/ProjectPage";
import Services from "./pages/userPages/Services";
import ListYourProperty from "./pages/userPages/ListYourProperty";
import PriceIndicator from "./pages/userPages/PriceIndicator";
import BudgetCalculator from "./pages/userPages/BudgetCalculator";
import ListingResults from "./pages/userPages/ListingResultsPage";
import ProjectsResultsPage from "./pages/userPages/ProjectsResultsPage";
import OurProperties from "./pages/userPages/OurProperties";
import SeoDashboard from "./pages/seoDashboard/SeoDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import SuperAdminDashboard from "./pages/superAdminDashboard/SuperAdminDashboard";
import CreatePost from "./pages/seoDashboard/CreatePost";
import EditPost from "./pages/seoDashboard/EditPost";
import Blogs from "./pages/userPages/Blogs";
import PostDetails from "./pages/userPages/PostDetails";
import MediaGallery from "./pages/seoDashboard/MediaGallery";
import { HelmetProvider } from "react-helmet-async";
import ShowListings from "./pages/seoDashboard/ShowListings";
import EditListing from "./pages/seoDashboard/EditListing";
import ShowProjects from "./pages/seoDashboard/ShowProjects";
import EditProject from "./pages/seoDashboard/EditProject";
import SeoEditPage from "./pages/seoDashboard/SeoEditPage";
import Page from "./components/Page"; // Create a new component for handling pages
import ManageUsers from "./pages/superAdminDashboard/ManageUsers";
import CreateUser from "./pages/superAdminDashboard/CreateUser";
import EditListings from "./pages/superAdminDashboard/EditListings";
import EditCommunities from "./pages/superAdminDashboard/EditCommunities";
import EditBlogs from "./pages/superAdminDashboard/EditBlogs";
import EditProjects from "./pages/superAdminDashboard/EditProjects";
import OurTeam from "./pages/userPages/OurTeam";
import WhyDubai from "./pages/userPages/WhyDubai";
import Overview from "./pages/userPages/Overview";
import Agents from "./pages/userPages/Agents";

export default function App() {
  const helmetContext = {};

  const routes = [
    { path: "", element: <Home />, slug: "home" },

    // {
    //   path: "listing/:listingId",
    //   element: <Property />,
    //   slug: "listing/:listingId",
    // },
    { path: "buy", element: <Buy />, slug: "buy" },
    { path: "rent", element: <Rent />, slug: "rent" },
    { path: "commercial", element: <Commercial />, slug: "commercial" },
    { path: "developer", element: <Developer />, slug: "developer" },
    { path: "services", element: <Services />, slug: "services" },

    {
      path: "price-indicator",
      element: <PriceIndicator />,
      slug: "price-indicator",
    },
    {
      path: "budget-calculator",
      element: <BudgetCalculator />,
      slug: "budget-calculator",
    },
    { path: "results", element: <ListingResults />, slug: "results" },
    {
      path: "projects-results",
      element: <ProjectsResultsPage />,
      slug: "projects-results",
    },
    {
      path: "our-properties",
      element: <OurProperties />,
      slug: "our-properties",
    },
    {
      path: "list-your-property",
      element: <ListYourProperty />,
      slug: "list-your-property",
    },
    // {
    //   path: "developer/:developer",
    //   element: <DeveloperPage />,
    //   slug: "developer/:developer",
    // },
    { path: "new-projects", element: <NewProject />, slug: "new-projects" },
    // {
    //   path: "project/:projectId",
    //   element: <ProjectPage />,
    //   slug: "project/:projectId",
    // },
    { path: "blogs", element: <Blogs />, slug: "blogs" },
    // { path: "blog/:postId", element: <PostDetails />, slug: "blog/:postId" },
    { path: "our-team", element: <OurTeam />, slug: "our-team" },
    { path: "why-dubai", element: <WhyDubai />, slug: "why-dubai" },
    { path: "agents", element: <Agents />, slug: "agents" },
    { path: "overview", element: <Overview />, slug: "overview" },



  ];

  return (
    <HelmetProvider context={helmetContext}>
      <BrowserRouter>
        <Header />

        <Routes>
          {routes.map(({ path, element }, index) => (
            <Route
              key={index}
              path={path}
              element={<Page element={element} path={path} />}
            />
          ))}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/blog/:postId" element={<PostDetails />} />
          <Route path="project/:projectId" element={<ProjectPage />} />
          <Route path="developer/:developer" element={<DeveloperPage />} />
          <Route path="listing/:listingId" element={<Property />} />
          {/* Other routes with private and role-based access */}
          <Route element={<PrivateRoute roles={["Admin"]} />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/create-community" element={<CreateCommunity />} />
            <Route
              path="/update-listings/:listingId"
              element={<UpdateProperty />}
            />
            <Route
              path="/update-projects/:projectId"
              element={<UpdateProject />}
            />
            <Route
              path="/update-community/:communityId"
              element={<UpdateCommunity />}
            />
          </Route>
          <Route element={<PrivateRoute roles={["SEO"]} />}>
            <Route path="/seo-dashboard" element={<SeoDashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:postId" element={<EditPost />} />
            <Route path="/media-gallery" element={<MediaGallery />} />
            <Route path="/seo-listings" element={<ShowListings />} />
            <Route
              path="/seo-edit-listing/:listingId"
              element={<EditListing />}
            />
            <Route path="/seo-projects" element={<ShowProjects />} />
            <Route
              path="/seo-edit-project/:projectId"
              element={<EditProject />}
            />
            <Route path="/seo-edit" element={<SeoEditPage />} />
          </Route>
          <Route element={<PrivateRoute roles={["Supervisor"]} />}>
            <Route
              path="/supervisor-dashboard"
              element={<SupervisorDashboard />}
            />
          </Route>
          <Route element={<PrivateRoute roles={["Super Admin"]} />}>
            <Route
              path="/super-admin-dashboard"
              element={<SuperAdminDashboard />}
            />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/manage-user" element={<ManageUsers />} />
            <Route
              path="/update-listing/:listingId"
              element={<EditListings />}
            />
            <Route
              path="/update-blog/:postId"
              element={<EditBlogs />}
            />{" "}
            <Route
              path="/update-project/:projectId"
              element={<EditProjects />}
            />{" "}
            <Route
              path="/update-communitie/:communityId"
              element={<EditCommunities />}
            />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}
