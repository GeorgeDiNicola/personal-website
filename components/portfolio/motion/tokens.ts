import type { Transition, Variants } from "framer-motion";

export const motionEasing = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const
};

export const sectionTransition: Transition = {
  duration: 0.72,
  ease: motionEasing.outExpo
};

export const itemTransition: Transition = {
  duration: 0.5,
  ease: motionEasing.outSoft
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 210,
  damping: 24,
  mass: 0.55
};

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: sectionTransition
  }
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: itemTransition
  }
};

export const timelineLineVariants: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: {
      duration: 0.9,
      ease: motionEasing.outExpo
    }
  }
};

export function createStagger(staggerChildren = 0.08, delayChildren = 0.08): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren
      }
    }
  };
}
