import { useState, useEffect } from "react";
import { MapPinIcon, ArrowIcon, CarIcon } from "./Icons";
import { useLang } from "../contexts/LanguageContext";
import { getCars } from "../lib/api";

const today = new Date().toISOString().split("T")[0];

export default function BookingForm({ compact = false }) {
  const { t } = useLang();
  const locations = t.booking.locations;

  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    pickup: locations[0],
    vehicle: "",
    pickupDate: "",
    returnDate: "",
  });

  // Keep pickup in sync if language changes and current value isn't in the new list
  const pickupValue = locations.includes(form.pickup) ? form.pickup : locations[0];

  useEffect(() => {
    getCars()
      .then((data) => setCars(data))
      .catch(() => {});
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const vehicleLabel = form.vehicle || t.booking.anyVehicle;
    const message = encodeURIComponent(
      t.booking.whatsappMsg
        .replace("{pickup}", pickupValue)
        .replace("{vehicle}", vehicleLabel)
        .replace("{pickupDate}", form.pickupDate)
        .replace("{returnDate}", form.returnDate)
    );
    window.open(`https://wa.me/59995178686?text=${message}`, "_blank");
  }

  const fieldClass =
    "mt-1 flex items-center gap-2 rounded-xl border border-navy-100 px-3 py-2.5 focus-within:border-gold-500";
  const inputClass =
    "w-full bg-transparent outline-none text-navy-900 text-sm";
  const labelClass =
    "text-xs font-semibold text-navy-900/80 uppercase tracking-wide";

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-card p-4 sm:p-5 md:p-6 grid gap-3 sm:gap-4 ${
        compact ? "" : "sm:grid-cols-2"
      }`}
    >
      {/* Pickup location */}
      <div>
        <label className={labelClass}>{t.booking.pickupLocation}</label>
        <div className={fieldClass}>
          <MapPinIcon className="w-4 h-4 text-navy-700 shrink-0" />
          <select
            value={pickupValue}
            onChange={(e) => setForm({ ...form, pickup: e.target.value })}
            className={inputClass}
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle */}
      <div>
        <label className={labelClass}>{t.booking.vehicle}</label>
        <div className={fieldClass}>
          <CarIcon className="w-4 h-4 text-navy-700 shrink-0" />
          <select
            value={form.vehicle}
            onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
            className={inputClass}
          >
            <option value="">{t.booking.anyVehicle}</option>
            {cars.map((c) => (
              <option key={c._id || c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pickup date */}
      <div>
        <label className={labelClass}>{t.booking.pickupDate}</label>
        <input
          type="date"
          required
          value={form.pickupDate}
          min={today}
          onChange={(e) => {
            const newPickup = e.target.value;
            setForm({
              ...form,
              pickupDate: newPickup,
              // clear return date only if it falls before the new pickup
              returnDate: form.returnDate >= newPickup ? form.returnDate : "",
            });
          }}
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 text-sm outline-none focus:border-gold-500"
        />
      </div>

      {/* Return date — must be at least 1 day after pickup */}
      <div>
        <label className={labelClass}>{t.booking.returnDate}</label>
        <input
          type="date"
          required
          value={form.returnDate}
          min={form.pickupDate || today}
          onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
          className="mt-1 w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 text-sm outline-none focus:border-gold-500"
        />
      </div>

      {/* Submit */}
      <div className={`flex items-end ${compact ? "" : "sm:col-span-2"}`}>
        <button type="submit" className="btn-primary w-full">
          {t.booking.checkAvailability}
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
