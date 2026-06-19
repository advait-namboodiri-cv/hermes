import { useEffect, useState } from "react";

// The UI is designed at a fixed BASE_W × BASE_H. Rather than reflow every
// screen, we scale the whole window down to fit whatever viewport it's on
// (laptop or phone), preserving the design exactly. Never scales above 1 so it
// stays crisp at its native size on large displays.

export const BASE_W = 1280;
export const BASE_H = 800;

export function useFitScale(): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const pad = window.innerWidth < 700 ? 10 : 40;
      const s = Math.min(
        1,
        (window.innerWidth - pad * 2) / BASE_W,
        (window.innerHeight - pad * 2) / BASE_H
      );
      setScale(s > 0 ? s : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return scale;
}
