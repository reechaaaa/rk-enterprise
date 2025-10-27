import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "/logo.png";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ✅ Logo + Company Name */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2 text-xl font-bold text-primary hover:text-accent transition-colors"
            >
              <img
                src={logo}
                alt="RK Enterprises Logo"
                className="w-10 h-10 rounded-md"
              />
              <span>RK Enterprises</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* 🧭 All buttons updated for no blue focus */}
            <button
              onClick={() => scrollToSection("home")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-0 active:outline-none"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-0 active:outline-none"
            >
              About Us
            </button>

            {/* Products Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  {/* 🔧 FIXED PRODUCTS BUTTON */}
                  <NavigationMenuTrigger
                    className="text-sm font-medium bg-transparent text-foreground 
                               hover:bg-transparent hover:text-foreground 
                               focus:bg-transparent focus:text-foreground 
                               active:bg-transparent active:text-foreground 
                               focus:outline-none focus:ring-0 active:outline-none 
                               shadow-none transition-none"
                  >
                    Products
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 bg-card">
                      {[
                        {
                          title: "Pipes and Fittings",
                          desc: "Quality pipes and fittings for all applications",
                        },
                        {
                          title: "Valves",
                          desc: "Industrial valves for every requirement",
                        },
                        {
                          title: "Industrial Hardware",
                          desc: "Complete range of industrial hardware",
                        },
                      ].map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <button
                              onClick={() => scrollToSection("products")}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none 
                                        transition-colors bg-transparent 
                                        hover:bg-transparent hover:text-foreground 
                                        focus:bg-transparent focus:text-foreground 
                                        focus:outline-none focus:ring-0 active:outline-none w-full text-left shadow-none"
>

                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.desc}
                              </p>
                            </button>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <button
              onClick={() => scrollToSection("services")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-0 active:outline-none"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-0 active:outline-none"
            >
              Contact Us
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-0 active:outline-none"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-0 active:outline-none"
            >
              About Us
            </button>

            <div className="px-4 py-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Products
              </div>
              {["Pipes and Fittings", "Valves", "Industrial Hardware"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection("products")}
                    className="block w-full text-left pl-4 py-1 text-sm text-foreground hover:text-primary focus:outline-none focus:ring-0 active:outline-none"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-0 active:outline-none"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md focus:outline-none focus:ring-0 active:outline-none"
            >
              Contact Us
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
