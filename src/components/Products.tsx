import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pipesImage from "@/assets/pipes-fittings.jpg";
import valvesImage from "@/assets/valves.jpg";
import hardwareImage from "@/assets/hardware.jpg";

const Products = () => {
  const products = [
    {
      title: "Pipes and Fittings",
      description: "Comprehensive range of high-quality pipes and fittings for industrial, commercial, and residential applications. Available in various materials and sizes.",
      image: pipesImage,
      features: [
        "Steel pipes",
        "PVC & CPVC pipes",
        "Elbows & connectors",
        "Couplings & adapters"
      ]
    },
    {
      title: "Valves",
      description: "Premium industrial valves engineered for reliability and performance. From ball valves to gate valves, we have the right solution for your needs.",
      image: valvesImage,
      features: [
        "Ball valves",
        "Gate valves",
        "Check valves",
        "Butterfly valves"
      ]
    },
    {
      title: "Industrial Hardware",
      description: "Complete selection of industrial-grade hardware including fasteners, tools, and accessories for all your industrial requirements.",
      image: hardwareImage,
      features: [
        "Bolts & nuts",
        "Industrial fasteners",
        "Clamps & brackets",
        "Tools & accessories"
      ]
    }
  ];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Our Products</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our comprehensive range of industrial hardware products designed to meet your specific requirements
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{product.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
