import { useEffect, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import Hls from 'hls.js';
import { ArrowUpRight, Play, Zap, Palette, BarChart3, Shield } from 'lucide-react';

const BlurText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const words = text.split(' ');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.35, ease: 'easeOut' as const },
    },
    hidden: {
      opacity: 0,
      y: 50,
      filter: 'blur(10px)',
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-2 mb-2 inline-block">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const HlsVideo = ({ src, desaturate = false }: { src: string; desaturate?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={`absolute inset-0 w-full h-full object-cover  z-0 ${desaturate ? 'saturate-0' : ''}`}
    />
  );
};

function App() {
  const forwardVideoRef = useRef<HTMLVideoElement>(null);
  const reverseVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fwd = forwardVideoRef.current;
    const rev = reverseVideoRef.current;
    if (!fwd || !rev) return;

    const handleTimeUpdateFwd = () => {
      // Trigger crossfade slightly before end
      if (fwd.duration && fwd.currentTime >= fwd.duration - 0.1) {
        fwd.pause();
        fwd.style.opacity = '0';
        rev.style.opacity = '0.4'; // Match preferred opacity
        rev.currentTime = 0;
        rev.play().catch(() => {});
      }
    };

    const handleTimeUpdateRev = () => {
      if (rev.duration && rev.currentTime >= rev.duration - 0.1) {
        rev.pause();
        rev.style.opacity = '0';
        fwd.style.opacity = '0.4';
        fwd.currentTime = 0;
        fwd.play().catch(() => {});
      }
    };

    fwd.addEventListener('timeupdate', handleTimeUpdateFwd);
    rev.addEventListener('timeupdate', handleTimeUpdateRev);
    return () => {
      fwd.removeEventListener('timeupdate', handleTimeUpdateFwd);
      rev.removeEventListener('timeupdate', handleTimeUpdateRev);
    };
  }, []);

  return (
    <div className="bg-black min-h-screen w-full overflow-hidden text-white font-body">
      {/* NAVBAR */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center liquid-glass">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 22H22L12 2Z" fill="white" />
          </svg>
        </div>
        <div className="hidden md:flex items-center gap-8 liquid-glass rounded-full px-8 py-3">
          {['Home', 'Services', 'Work', 'Process', 'Pricing'].map((item) => (
            <a key={item} href="#" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <button className="bg-white text-black rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1 hover:bg-white/90 transition-colors ml-4">
            Get Started
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <button className="md:hidden bg-white text-black rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1">
          Menu
        </button>
      </nav>

      {/* HERO */}
      <section className="relative h-[1000px] w-full flex flex-col justify-start items-center pt-[150px] overflow-hidden">
        <video
          ref={forwardVideoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="fixed top-0 left-0 w-full h-full bg-cover object-cover z-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0.4 }}
          src="/video-bg2.mp4"  
        />
        <video
          ref={reverseVideoRef}
          muted
          playsInline
          preload="auto"
          className="fixed top-0 left-0 w-full h-full bg-cover object-cover z-0 pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0 }}
          src="/video-reverse.mp4"  
        />
        {/* Dark overlays for better text readability */}
        <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
          <div className="liquid-glass rounded-full px-1 py-1 pr-4 inline-flex items-center gap-3 mb-8">
            <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-medium">New</span>
            <span className="text-xs text-white/80">Introducing AI-powered web design.</span>
          </div>

          <BlurText 
            text="The Website Your Brand Deserves" 
            className="text-6xl md:text-7xl lg:text-[5.5rem] heading-main justify-center" 
          />
          
          <motion.p 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl"
          >
            Stunning design. Blazing performance. Built by AI, refined by experts. This is web design, wildly reimagined.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-6 justify-center"
          >
            <button className="liquid-glass-strong rounded-full px-8 py-4 flex items-center gap-2 text-white hover:bg-white/10 transition-colors font-medium">
              Get Started
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors font-medium">
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-white" />
              </span>
              Watch the Film
            </button>
          </motion.div>
        </div>
      </section>

      {/* PARTNERS BAR */}
      <section className="py-20 px-6 flex flex-col items-center relative z-10 w-full bg-black/20 backdrop-blur-md">
        <div className="liquid-glass rounded-full px-4 py-2 text-xs font-medium text-white mb-12">
          Trusted by the teams behind
        </div>
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60">
          {['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma'].map(partner => (
            <span key={partner} className="text-2xl md:text-3xl font-heading italic text-white">{partner}</span>
          ))}
        </div>
      </section>

   

      {/* FEATURES CHESS */}
      <section className="py-32 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative z-10">
        <div className="mb-24">
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white mb-6 inline-block">
            Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Pro features. Zero complexity.
          </h2>
        </div>

        <div className="flex flex-col gap-32">
          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl mb-6">Designed to convert. Built to perform.</h3>
              <p className="text-base text-white/60 mb-8 max-w-md">
                Every pixel is intentional. Our AI studies what works across thousands of top sites—then builds yours to outperform them all.
              </p>
              <button className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium hover:bg-white/10 transition-colors">
                Learn more
              </button>
            </div>
            <div className="liquid-glass rounded-[2rem] overflow-hidden aspect-video relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent flex justify-center items-center">
                <div className="w-24 h-24 rounded-full border border-white/20 animate-pulse bg-white/5" />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            <div className="order-2 lg:order-1 liquid-glass rounded-[2rem] overflow-hidden aspect-video relative">
               <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent flex justify-center items-center">
                <div className="w-32 h-32 rounded-lg border border-white/20 animate-pulse bg-white/5 rotate-12" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl lg:text-4xl mb-6">It gets smarter. Automatically.</h3>
              <p className="text-base text-white/60 mb-8 max-w-md">
                Your site evolves on its own. AI monitors every click, scroll, and conversion—then optimizes in real time. No manual updates. Ever.
              </p>
              <button className="text-white hover:text-white/80 transition-colors font-medium underline underline-offset-4 flex items-center gap-2">
                See how it works
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative z-10 border-t border-white/10 mt-12">
        <div className="mb-16">
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white mb-6 inline-block">
            Why Us
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            The difference is everything.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Days, Not Months", desc: "Concept to launch at a pace that redefines fast." },
            { icon: Palette, title: "Obsessively Crafted", desc: "Every detail considered. Every element refined." },
            { icon: BarChart3, title: "Built to Convert", desc: "Layouts informed by data. Decisions backed by performance." },
            { icon: Shield, title: "Secure by Default", desc: "Enterprise-grade protection comes standard." },
          ].map((feature, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-8 flex flex-col items-start hover:-translate-y-1 transition-transform cursor-default">
              <div className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
    

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <div className="liquid-glass rounded-full px-4 py-1.5 text-xs font-medium text-white mb-6 inline-block">
            What They Say
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Don't take our word for it.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Sarah Chen", role: "CEO Luminary", quote: "A complete rebuild in five days that looks like a high-end agency took six months." },
            { name: "Marcus Webb", role: "Head of Growth Arcline", quote: "Conversions up 4x within the first week. The AI optimization actually works." },
            { name: "Elena Voss", role: "Brand Director Helix", quote: "They didn't just design our site, they completely reimagined our digital presence." }
          ].map((item, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-8 flex flex-col justify-between hover:bg-white/[0.03] transition-colors">
              <p className="text-white/80 font-light text-base italic mb-8 mb-auto">"{item.quote}"</p>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white font-medium text-sm">{item.name}</p>
                <p className="text-white/50 text-xs mt-1">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="relative h-[400px] flex flex-col items-center justify-center py-24 px-6">
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        
        <div className="relative z-10 text-center flex flex-col items-center max-w-3xl pt-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] mb-6">
            Your next website starts here.
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Book a free strategy call. See what AI-powered design can do.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="liquid-glass-strong rounded-full px-8 py-4 font-medium hover:bg-white/10 transition-colors">
              Book a Call
            </button>
            <button className="bg-white text-black rounded-full px-8 py-4 font-medium hover:bg-white/90 transition-colors">
              View Pricing
            </button>
          </div>
        </div>

       
      </section>
    </div>
  );
}

export default App;
