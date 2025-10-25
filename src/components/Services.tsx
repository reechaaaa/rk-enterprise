import { Wrench, Truck, HeadphonesIcon, ShieldCheck } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description: "All products undergo rigorous quality checks to ensure they meet industry standards and your expectations."
    },
    {
      icon: Truck,
      title: "Timely Delivery",
      description: "Efficient logistics and supply chain management ensure your orders reach you on time, every time."
    },
    {
      icon: Wrench,
      title: "Technical Support",
      description: "Our experienced team provides expert guidance to help you select the right products for your specific needs."
    },
    {
      icon: HeadphonesIcon,
      title: "Customer Service",
      description: "Dedicated customer support team ready to assist you with inquiries, orders, and after-sales service."
    }
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Our Services</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          We provide comprehensive services to ensure your complete satisfaction
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg border hover:border-primary transition-colors group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
