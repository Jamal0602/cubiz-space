
import { Link } from "react-router-dom";
import { Github, Heart, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cubiz-400 to-cubiz-600 flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="text-lg font-bold">cubiz.space</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting innovative projects and communities in one seamless hub.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/cubiz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cubiz-500 transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com/cubiz" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cubiz-500 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Projects</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://mpa.cubiz.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Multiproject Association
                </a>
              </li>
              <li>
                <a href="https://team.cubiz.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Cubiz Teams
                </a>
              </li>
              <li>
                <a href="https://ja.cubiz.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  CEO & Founder
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground/50">
                  More coming soon...
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/community" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Posts
                </Link>
              </li>
              <li>
                <Link to="/community/trending" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/community/members" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Members
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">More</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-cubiz-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} cubiz.space. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-cubiz-500" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
