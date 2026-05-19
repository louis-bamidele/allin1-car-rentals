import { useState } from "react";
import { MapPinIcon, ArrowIcon } from "./Icons";
import { useLang } from "../contexts/LanguageContext";

export default function BookingForm({ compact = false }) {
  const { t } = useLang();
  const locations = t.booking.locations;

  const [form, setForm] = useState({
    pickup: locations[0],
    pickupDate: "",
    returnDate: "",
    vehicle: "Any",
  });

  // Keep pickup in sync if language changes and current value isn't in the new list
  const pickupValue = locations.includes(form.pickup) ? form.pickup : locations[0];

  function handleSubmit(e) {
    e.preventDefault();
    const message = encodeURIComponent(
      t.booking.whatsappMsg
        .replace("{pickup}", pickupValue)
        .replace("{pickupDate}", form.pickupDate)
        .replace("{returnDate}", form.returnDate)
        .replace("{vehicle}", form.vehicle)
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
          {t.booking.pickupLocation}
        </label>
        <div className="mt-1 flex items-center gap-2 rounded-xl border border-navy-100 px-3 py-2.5 focus-within:border-gold-500">
          <MapPinIcon className="w-4 h-4 text-navy-700" />
          <select
            value={pickupValue}
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
          {t.booking.pickupDate}
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
          {t.booking.returnDate}
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
          {t.booking.checkAvailability}
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
