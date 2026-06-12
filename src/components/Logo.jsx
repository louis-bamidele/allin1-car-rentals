export default function Logo({ className = "h-12" }) {
  return (
    <img
      src="/logo.webp"
      alt="All in 1 Car Rentals"
      className={`${className} object-contain select-none`}
      draggable="false"
      // Logo is in the navbar — render as early as possible
      fetchPriority="high"
      decoding="async"
      width="1200"
      height="419"
    />
  );
}
