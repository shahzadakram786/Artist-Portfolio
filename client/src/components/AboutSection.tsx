import { motion } from "framer-motion";
import { Palette, Award, Heart, Sparkles } from "lucide-react";
import profileImage from "@assets/avatar_1764443810386.png";

const highlights = [
  {
    icon: Palette,
    title: "Diverse Mediums",
    description: "Working across various artistic mediums to bring visions to life",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Recognized for creative excellence and artistic innovation",
  },
  {
    icon: Heart,
    title: "Passion Driven",
    description: "Every piece is created with deep passion and dedication",
  },
  {
    icon: Sparkles,
    title: "Unique Vision",
    description: "Bringing a distinctive perspective to every creation",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 lg:py-32 relative overflow-hidden"
      data-testid="section-about"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "hsl(var(--primary) / 0.2)" }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "hsl(var(--accent) / 0.2)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image side */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl opacity-20 blur-sm" />
              <div className="absolute -inset-2 bg-card rounded-xl" />
              
              <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                <img
                  src={profileImage}
                  alt="Shahzad Akram - Artist Portrait"
                  className="w-full h-full object-cover"
                  data-testid="img-about"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-6 -right-6 bg-card border border-card-border rounded-xl p-4 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold">Visual Artist</p>
                    <p className="text-sm text-muted-foreground">Creative Professional</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text content */}
          <div className="order-1 lg:order-2">
            <motion.span
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              About the Artist
            </motion.span>

            <motion.h2
              className="font-serif text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              data-testid="text-about-title"
            >
              Creating Art That <span className="gradient-text">Speaks</span> to the Soul
            </motion.h2>

            <motion.div
              className="space-y-4 text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p data-testid="text-about-description">
                I am Shahzad Akram, a passionate visual artist dedicated to creating works 
                that capture the essence of emotion and beauty. My journey in art began 
                with a simple love for colors and has evolved into a lifelong pursuit 
                of artistic excellence.
              </p>
              <p>
                Each piece I create is a reflection of my inner world, a dialogue between 
                imagination and reality. I believe art has the power to transform, inspire, 
                and connect people across boundaries.
              </p>
              <p>
                My work spans various mediums and styles, always seeking to push creative 
                boundaries while staying true to the emotional core that drives every brushstroke.
              </p>
            </motion.div>

            {/* Highlights grid */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="p-4 rounded-lg bg-card border border-card-border hover-elevate"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  data-testid={`card-highlight-${index}`}
                >
                  <item.icon className="w-6 h-6 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
