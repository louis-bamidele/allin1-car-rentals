import { useState } from "react";
import { MapPinIcon, ArrowIcon } from "./Icons";

const locations = [
  "Hato International Airport",
  "Willemstad Downtown",
  "Jan Thiel",
  "Mambo Beach",
  "Hotel delivery",
];

export default function BookingForm({ compact = false }) {
  const [form, setForm] = useState({
    pickup: locations[0],
    pickupDate: "",
    returnDate: "",
    vehicle: "Any",
  });

  function handleSubmit(e) {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi All in 1 Car Rentals, I would like to book a car.\nPickup: ${form.pickup}\nPickup date: ${form.pickupDate}\nReturn date: ${form.returnDate}\nVehicle class: ${form.vehicle}`
    );
    window.open(`https://wa.me/59995178686?text=${message}`, "_blank");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-card p-4 sm:p-5 md:p-6 grid gap-3 sm:gap-4 ${
        compact ? "" : "sm:grid-cols-2 lg:grid-cols-5"
      }`}
    >
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className="text-xs font-semibold text-navy-900/80 uppercase tracking-wide">
          Pickup location
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl border border-navy-100 px-3 py-2.5 focus-within:border-gold-500">
          <MapPinIcon className="w-4 h-4 text-navy-700" />
          <select
            value={form.pickup}
            onChange={(e) => setForm({ ...form, pickup: e.target.value })}
            className="w-full bg-transparent outline-none text-navy-900 text-sm"
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-navy-900/80 uppercase tracking-wide">
          Pickup date
        </label>
        <input
          type="date"
          required
          value={form.pickupDate}
          onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 text-sm outline-none focus:border-gold-500"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-navy-900/80 uppercase tracking-wide">
          Return date
        </label>
        <input
          type="date"
          required
          value={form.returnDate}
          onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 text-sm outline-none focus:border-gold-500"
        />
      </div>

      <div className={`flex items-end ${compact ? "" : "sm:col-span-2 lg:col-span-1"}`}>
        <button type="submit" className="btn-primary w-full">
          Check availability
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
