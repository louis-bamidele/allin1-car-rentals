export default function Logo({ className = "h-12" }) {
  return (
    <img
      src="/logo.png"
      alt="All in 1 Car Rentals"
      className={`${className} object-contain select-none`}
      draggable="false"
    />
  );
}
