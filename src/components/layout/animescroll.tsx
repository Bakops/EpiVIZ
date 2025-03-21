"use client";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

export function ScrollBasedVelocityDemo() {
  return (
    <div className="min-h-[15vh] w-full relative mt-20">
      <div className="inset-0 flex items-center justify-center pointer-events-none flex-col">
        <VelocityScroll
          text={
            <>
              <span className="scroll-item">#DataViz</span>
              <span className="scroll-item">Épidémies en temps réel</span>
              <span className="scroll-item">Analyse des tendances</span>
              <span className="scroll-item">Visualisation des données</span>
              <span className="scroll-item">Prévisions épidémiques</span>
              <span className="scroll-item">Cartographie des infections</span>
            </>
          }
          default_velocity={2}
          className="font-display text-center text-4xl font-bold tracking-[-0.02em] dark:text-white md:text-7xl md:leading-[5rem] pointer-events-auto"
        />
      </div>
    </div>
  );
}
