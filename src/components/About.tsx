import { CheckCircle } from "lucide-react";

const About = () => {
  const highlights = [
    "Over 15 years of industry experience",
    "Wide range of quality products",
    "Competitive pricing and reliable supply",
    "Expert technical support",
    "Serving diverse industries nationwide",
    "Commitment to customer satisfaction"
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">About RK Enterprises</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              RK Enterprises is a leading supplier of industrial hardware solutions, dedicated to 
              providing top-quality products and exceptional service to industries across the nation. 
              With years of experience in the hardware industry, we have established ourselves as a 
              trusted partner for businesses seeking reliable and durable industrial solutions.
            </p>
            
            <p>
              Our extensive product range includes pipes, fittings, valves, and a comprehensive 
              selection of industrial hardware designed to meet the diverse needs of our clients. 
              We understand the critical role that quality hardware plays in industrial operations, 
              which is why we are committed to sourcing and supplying only the best products from 
              reputable manufacturers.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-10">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{highlight}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-foreground font-medium text-center">
              At RK Enterprises, your success is our priority. Partner with us for hardware solutions you can trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
