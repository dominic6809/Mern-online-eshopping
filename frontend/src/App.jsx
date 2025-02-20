import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navigation />

      <main className="">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default App;
