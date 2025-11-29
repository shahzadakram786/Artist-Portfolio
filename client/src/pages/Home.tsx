import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ArtworkGallery } from "@/components/ArtworkGallery";
import { AboutSection } from "@/components/AboutSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { AdminUpload } from "@/components/AdminUpload";
import type { Artwork, Certification } from "@shared/schema";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin session exists
    const adminSession = sessionStorage.getItem("adminSession");
    if (adminSession) {
      setIsAdmin(true);
    }
  }, []);

  const { data: artworks = [], isLoading: artworksLoading } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks"],
  });

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      
      if (response.ok) {
        setIsAdmin(true);
        sessionStorage.setItem("adminSession", "true");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("adminSession");
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Content */}
      <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        <Navigation />
        
        <main>
          <HeroSection />
          <ArtworkGallery artworks={artworks} isLoading={artworksLoading} />
          <AboutSection />
          <CertificationsSection certifications={certifications} isLoading={certificationsLoading} />
          <ContactSection />
        </main>

        <Footer />

        {/* Admin Upload FAB - Only visible to admin */}
        <AdminUpload
          isAuthenticated={isAdmin}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
      </div>
    </>
  );
}
