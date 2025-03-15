
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ChevronDown,
  Github,
  LogIn,
  Menu,
  X
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Community", path: "/community" },
    { name: "About", path: "/about" },
  ];

  const projectLinks = [
    { name: "Multiproject Association", url: "https://multiprojectassociation.lovable.app" },
    { name: "Cubiz Teams", url: "https://cubiz3teams.lovable.app" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cubiz-400 to-cubiz-600 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
            </motion.div>
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-xl font-bold text-foreground"
            >
              cubiz.space
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                {link.name === "Projects" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-1 px-3">
                        <span>Projects</span>
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56 glass-panel animate-scale-in">
                      <DropdownMenuLabel>Cubiz Projects</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {projectLinks.map((project) => (
                        <DropdownMenuItem key={project.name} asChild>
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cursor-pointer hover-lift"
                          >
                            {project.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/projects" className="text-cubiz-500 font-medium">
                          View All Projects
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-sm font-medium ${
                      location.pathname === link.path
                        ? "text-cubiz-600"
                        : "text-foreground hover:text-cubiz-500 transition-colors"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Button asChild variant="outline" size="sm" className="hover-lift">
                <a href="https://github.com/cubiz" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </motion.div>
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Button asChild size="sm" className="bg-cubiz-500 hover:bg-cubiz-600 hover-lift">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 py-4 space-y-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg"
          >
            {navLinks.map((link) => (
              <div key={link.name} className="px-4">
                {link.name === "Projects" ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Projects
                    </p>
                    <div className="pl-4 space-y-2 border-l-2 border-cubiz-100">
                      {projectLinks.map((project) => (
                        <a
                          key={project.name}
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-muted-foreground hover:text-cubiz-500 transition-colors"
                        >
                          {project.name}
                        </a>
                      ))}
                      <Link
                        to="/projects"
                        className="block text-sm font-medium text-cubiz-500"
                      >
                        View All Projects
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    className={`block text-sm font-medium ${
                      location.pathname === link.path
                        ? "text-cubiz-600"
                        : "text-foreground hover:text-cubiz-500 transition-colors"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="px-4 pt-2 flex items-center space-x-4 border-t border-gray-100">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <a href="https://github.com/cubiz" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button asChild size="sm" className="flex-1 bg-cubiz-500 hover:bg-cubiz-600">
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
