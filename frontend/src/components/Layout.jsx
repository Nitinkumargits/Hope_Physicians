import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Outlet /> {/* This renders the nested route content */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
