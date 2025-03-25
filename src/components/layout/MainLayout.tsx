
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="flex-grow"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;
