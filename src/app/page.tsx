import Hero from "@/components/home/Hero";
import CameraSection from "@/components/home/CameraSection";
import WorkReel from "@/components/home/WorkReel";
import Capabilities from "@/components/home/Capabilities";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

/**
 * Homepage rhythm: impact, breathe, impact, breathe.
 *   Hero (impact) > Camera (impact) > Work > Capabilities (still)
 *   > About (still) > Contact (one clear moment)
 * The loader is mounted once in layout.tsx.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <CameraSection />
      <WorkReel />
      <Capabilities />
      <About />
      <Contact />
    </>
  );
}