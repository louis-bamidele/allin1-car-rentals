import { motion } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function Reveal({
  children,
  className,
  variants = fadeUp,
  amount = 0.2,
  as = "div",
  ...rest
}) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants}
      {...rest}
    >
      {children}
    </Tag>
  );
}
