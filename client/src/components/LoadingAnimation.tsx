import { motion } from "framer-motion";

interface LoadingAnimationProps {
  onComplete?: () => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.5 }}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 100);
      }}
      data-testid="loading-animation"
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Artistic Paint Brush Animation */}
        <div className="relative w-64 h-64">
          {/* Paint palette circle */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                from 0deg,
                hsl(var(--primary)),
                hsl(var(--accent)),
                hsl(var(--secondary)),
                hsl(var(--primary))
              )`,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Inner circle */}
          <motion.div
            className="absolute inset-8 rounded-full bg-background"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* SA initials */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span className="font-serif text-5xl font-bold gradient-text">SA</span>
          </motion.div>

          {/* Orbiting paint dots */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full"
              style={{
                background: `hsl(var(--${i % 2 === 0 ? "primary" : i % 3 === 0 ? "accent" : "secondary"}))`,
                left: "50%",
                top: "50%",
              }}
              initial={{ x: "-50%", y: "-50%", scale: 0 }}
              animate={{
                x: `calc(-50% + ${Math.cos((i * Math.PI) / 3) * 100}px)`,
                y: `calc(-50% + ${Math.sin((i * Math.PI) / 3) * 100}px)`,
                scale: [0, 1.2, 1],
              }}
              transition={{
                duration: 0.8,
                delay: 0.5 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Rotating brush strokes */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, hsl(var(--${i === 0 ? "primary" : i === 1 ? "accent" : "secondary"})))`,
                  width: "40px",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "left center",
                  rotate: `${i * 120}deg`,
                  translate: "0 -50%",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>

        {/* Loading text with paint brush effect */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.h2
            className="font-serif text-2xl text-muted-foreground"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.6 }}
          >
            Creating Art...
          </motion.h2>
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 1.8 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
