import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">RK Enterprises</h3>
            <p className="text-muted-foreground leading-relaxed">
              Enquiry at 
              <br />
              <a
                href="mailto:rke2233ts@gmail.com"
                className="hover:text-primary transition-colors"
               >
                  rke2233ts@gmail.com
               </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("products")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Services
                </button>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Pipes and Fittings</li>
              <li className="text-muted-foreground">Valves</li>
              <li className="text-muted-foreground">Industrial Hardware</li>
              <li className="text-muted-foreground">Tools & Accessories</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">D.B. Road, Naya Bazar, Jugsalai, Jamshedpur, Jharkhand - 831006</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a 
                    href="tel:+919234607632" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    +91 9234607632
                </a>
                
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a 
                    href="mailto:rke2233ts@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    rke2233ts@gmail.com
                </a>
                
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {2025} RK Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
