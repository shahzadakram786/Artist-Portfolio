import { motion } from "framer-motion";
import { Download, Heart, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const [isDownloading, setIsDownloading] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/download-source");
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "shahzad-akram-portfolio-source.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <footer className="relative bg-card border-t border-card-border" data-testid="footer">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {/* About Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl font-bold gradient-text mb-4">
              Shahzad Akram
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A passionate visual artist dedicated to creating works that capture 
              the essence of emotion and beauty. Each piece is a reflection of 
              imagination meeting canvas.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>and creativity</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-foreground transition-colors text-left"
                  whileHover={{ x: 4 }}
                  data-testid={`link-footer-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Download Section
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg mb-6">Download</h4>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Want to explore the code behind this portfolio? Download the complete 
              source code and customize it for your own projects.
            </p>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full sm:w-auto"
              data-testid="button-download-source"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Preparing..." : "Download Source"}
            </Button>
          </motion.div> */}
        </div>

        {/* Bottom section */}
        <motion.div
          className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} Shahzad Akram. All rights reserved.
          </p>

          {/* Back to top button */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ y: -2 }}
            data-testid="button-scroll-top"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUp className="w-4 h-4 text-primary" />
            </div>
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
