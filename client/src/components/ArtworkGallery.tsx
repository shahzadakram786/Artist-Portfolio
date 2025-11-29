import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Artwork } from "@shared/schema";

interface ArtworkGalleryProps {
  artworks: Artwork[];
  isLoading?: boolean;
}

export function ArtworkGallery({ artworks, isLoading }: ArtworkGalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const openLightbox = (artwork: Artwork, index: number) => {
    setSelectedArtwork(artwork);
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedArtwork(null);
    document.body.style.overflow = "unset";
  };

  const goToPrevious = () => {
    const newIndex = (selectedIndex - 1 + artworks.length) % artworks.length;
    setSelectedIndex(newIndex);
    setSelectedArtwork(artworks[newIndex]);
  };

  const goToNext = () => {
    const newIndex = (selectedIndex + 1) % artworks.length;
    setSelectedIndex(newIndex);
    setSelectedArtwork(artworks[newIndex]);
  };

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 lg:py-32" data-testid="section-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="gradient-text">Artwork</span> Gallery
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              A collection of creative expressions and visual stories
            </motion.p>
          </div>

          {/* Loading skeleton */}
          <div className="masonry-grid">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="masonry-item animate-pulse"
                style={{ height: `${250 + (i % 3) * 100}px` }}
              >
                <div className="w-full h-full rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (artworks.length === 0) {
    return (
      <section id="gallery" className="py-24 lg:py-32" data-testid="section-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="gradient-text">Artwork</span> Gallery
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              A collection of creative expressions and visual stories
            </motion.p>
          </div>

          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ZoomIn className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-xl text-muted-foreground">
              Artworks coming soon...
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="gallery" className="py-24 lg:py-32" data-testid="section-gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Portfolio
            </motion.span>
            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="gradient-text">Artwork</span> Gallery
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              A collection of creative expressions and visual stories
            </motion.p>
          </div>

          {/* Masonry Grid */}
          <div className="masonry-grid">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                className="masonry-item group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openLightbox(artwork, index)}
                data-testid={`card-artwork-${artwork.id}`}
              >
                <div className="relative overflow-hidden rounded-lg bg-card border border-card-border">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-serif text-xl text-white font-semibold mb-1">
                        {artwork.title}
                      </h3>
                      {artwork.medium && (
                        <p className="text-white/70 text-sm">{artwork.medium}</p>
                      )}
                    </motion.div>
                    
                    <motion.div
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            data-testid="lightbox"
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
              data-testid="button-lightbox-close"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation arrows */}
            {artworks.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  data-testid="button-lightbox-prev"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  data-testid="button-lightbox-next"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Image container */}
            <motion.div
              className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                data-testid="img-lightbox"
              />
              
              {/* Artwork info */}
              <div className="mt-6 text-center text-white">
                <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
                  {selectedArtwork.title}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-4 text-white/70">
                  {selectedArtwork.medium && (
                    <span>{selectedArtwork.medium}</span>
                  )}
                  {selectedArtwork.dimensions && (
                    <span>{selectedArtwork.dimensions}</span>
                  )}
                </div>
                {selectedArtwork.description && (
                  <p className="mt-4 text-white/60 max-w-2xl">
                    {selectedArtwork.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
