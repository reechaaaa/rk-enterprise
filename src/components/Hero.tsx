import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

// --- ADD YOUR IMAGE IMPORTS HERE ---
// UNCOMMENT THESE LINES:
import myImage1 from '@/assets/hero-bg.jpg';
import myImage2 from '@/assets/360_F_487195094_Nk7bDMyl2BcNhXoPpbheXKpWoaOz2yUt.jpg';
import myImage3 from '@/assets/im.jpg';
// --- Carousel Images (FIXED) ---
// ...
// ...
const carouselImages = [
  { src: myImage1, alt: "Industrial hardware" },
  { src: myImage2, alt: "Construction tools" },  
  { src: myImage3, alt: "Metal pipe fittings" }, 
];
// --- --- --- --- --- --- --- --- ---
// --- --- --- --- --- --- --- --- ---

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  // Function to reset the autoplay timer
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Change image every 5 seconds
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        ),
      5000 
    );
  };

  // Start the autoplay timer on mount and reset on index change
  useEffect(() => {
    resetTimeout();
    // Clear timeout on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);

  // Go to a specific slide
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* --- Carousel Background --- */}
      <div className="absolute inset-0 z-0">
        {carouselImages.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            // Handle image load error
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://placehold.co/1920x1080/111827/4b5563?text=Image+Not+Found`;
              target.alt = "Image not found";
            }}
          />
        ))}
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      </div>

      {/* --- Carousel Dots --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* --- Content --- */}
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            RK Enterprises
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Reliable Hardware Solutions for Every Industry
          </p>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl">
            Your trusted partner for quality industrial hardware, pipes, fittings, and valves. 
            Delivering excellence in every product, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => scrollToSection("products")}
              className="text-base"
            >
              View Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("contact")}
              className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;





