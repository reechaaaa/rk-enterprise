import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // ✅ Single handleSubmit function (Google Form integration)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Replace with your Google Form POST URL
      const formURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSeSWa8EMf5zl7vGddTb-mt7T1gssCJ6r9Qah7t0ZtbFvYIuhA/formResponse"

      const formBody = new URLSearchParams();
      formBody.append("entry.1653629278", formData.name);
      formBody.append("entry.819945036", formData.email);
      formBody.append("entry.1823287760", formData.phone);
      formBody.append("entry.1826648574", formData.message);

      await fetch(formURL, {
        method: "POST",
        body: formBody,
        mode: "no-cors",
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an issue submitting your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Contact Us</h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Get in touch with us for inquiries, quotes, or any assistance you need
        </p>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Get In Touch</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Have questions about our products or services? We're here to help.
                Reach out to us through any of the channels below or fill out the form.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Address</h4>
                  <p className="text-muted-foreground">
                    D.B. road, Naya Bazar, Jugsalai<br />
                    Jamshedpur, Jharkhand - 831006
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  {/* === Line 116: Phone Hyperlink Added === */}
                  <p className="text-muted-foreground">
                    <a href="tel:+919234607632" className="hover:text-primary transition-colors">
                        +91 9234607632
                    </a>
                  </p>
                  {/* ====================================== */}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  {/* === Line 127: Email Hyperlink Added === */}
                  <p className="text-muted-foreground">
                    <a href="mailto:rke2233ts@gmail.com" className="hover:text-primary transition-colors">
                        rke2233ts@gmail.com
                    </a>
                  </p>
                  {/* ====================================== */}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h4 className="font-semibold mb-4">Business Hours</h4>
              <div className="space-y-2 text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg border shadow-sm">
            <h3 className="text-2xl font-semibold mb-6">Inquiry</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Product you want to inquire about *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your requirements..."
                  className="mt-1.5 min-h-[120px]"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Contact;