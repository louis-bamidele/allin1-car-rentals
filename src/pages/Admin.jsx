import { useState, useEffect, useRef } from "react";
import { login, getAdminCars, addCar, updateCar, deleteCar, toggleAvailability, setUnauthorizedHandler } from "../lib/api";

const CATEGORIES = ["Economy", "Comfort", "SUV"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];

const PHOTO_LABELS = [
  "Photo 1: Front 3/4 angle (hero shot)",
  "Photo 2: Rear 3/4 angle",
  "Photo 3: Interior, dashboard & front seats",
  "Photo 4: Interior, rear seats or boot",
];

const YEAR_RE = /^\d{4}(\s*-\s*\d{4})?$/;

// One-shot canvas resize + JPEG encode
function _encodeOnce(file, maxWidth, quality) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    // Hard timeout — if the browser can't decode the image format (e.g. HEIC
    // on older Chrome) onload may never fire and we'd hang forever.
    const decodeTimer = setTimeout(() => {
      URL.revokeObjectURL(url);
      reject(new Error("Image decode timed out — try a JPEG or PNG version"));
    }, 15_000);
    img.onload = () => {
      clearTimeout(decodeTimer);
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported by this browser"));
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("toBlob returned null"));
          const compressed = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg", lastModified: Date.now() }
          );
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      clearTimeout(decodeTimer);
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image (format may be unsupported — try JPEG)"));
    };
    img.src = url;
  });
}

// Resize + re-encode an image in the browser before upload.
// Iteratively tries lower JPEG qualities until the result is under ~1 MB, so
// even very high-resolution photos end up small enough to upload quickly.
// Cloudinary downscales to 1200×750 anyway, so 1920 px source is plenty.
async function compressImage(file, opts = {}) {
  const { maxWidth = 1920, targetBytes = 1_000_000 } = opts;
  if (!file.type.startsWith("image/")) return file;
  if (file.size < 400 * 1024) {
    console.log(`[compress] ${file.name}: ${(file.size / 1024).toFixed(0)} KB — skipping (already small)`);
    return file;
  }

  const original = file.size;
  console.log(`[compress] ${file.name}: starting, original ${(original / 1024).toFixed(0)} KB`);

  // Try progressively lower quality until we hit the size target. Stops at
  // the first acceptable size or the lowest quality, whichever comes first.
  const qualitySteps = [0.92, 0.85, 0.78, 0.70];
  let best = null;
  for (const q of qualitySteps) {
    try {
      const result = await _encodeOnce(file, maxWidth, q);
      console.log(`[compress] ${file.name}: q=${q} → ${(result.size / 1024).toFixed(0)} KB`);
      best = result;
      if (result.size <= targetBytes) break;
    } catch (err) {
      console.warn(`[compress] ${file.name}: encode failed at q=${q}:`, err.message);
      // If the first attempt failed, the browser/format is unsupported — give up
      if (best === null) throw err;
      break;
    }
  }

  // If compression somehow made it bigger or never produced output, use original
  if (!best || best.size >= original) {
    console.log(`[compress] ${file.name}: keeping original (compression didn't help)`);
    return file;
  }
  console.log(`[compress] ${file.name}: final ${(best.size / 1024).toFixed(0)} KB (${((1 - best.size / original) * 100).toFixed(0)}% smaller)`);
  return best;
}

const EMPTY_FORM = {
  name: "", category: "Economy", year: String(new Date().getFullYear()),
  color: "", seats: 5, doors: 5, transmission: "Automatic",
  fuel: "Petrol", consumption: "", bags: 2,
  dailyRate: "", weeklyRate: "", monthlyRate: "",
  description: "", longDescription: "",
  features: ["", "", "", "", "", "", "", ""],
  highlights: ["", "", ""],
  photos: [null, null, null, null],
  previews: ["", "", "", ""],
  existingUrls: ["", "", "", ""],
};

function carToForm(car) {
  return {
    name: car.name, category: car.category, year: car.year,
    color: car.color, seats: car.seats, doors: car.doors,
    transmission: car.transmission, fuel: car.fuel, consumption: car.consumption,
    bags: car.bags, dailyRate: car.dailyRate, weeklyRate: car.weeklyRate,
    monthlyRate: car.monthlyRate, description: car.description,
    longDescription: car.longDescription,
    features: [...(car.features || ["", "", "", "", "", "", "", ""])],
    highlights: [...(car.highlights || ["", "", ""])],
    photos: [null, null, null, null],
    previews: [...(car.gallery || ["", "", "", ""])],
    existingUrls: [...(car.gallery || ["", "", "", ""])],
  };
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("admin_token", data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 pt-32">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <h1 className="text-xl font-bold text-navy-900">Admin sign in</h1>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-900/70 mb-1">Email</label>
            <input type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-navy-900/70 mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary justify-center disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────
function Field({ label, required = false, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-navy-900/70 mb-1">
        {label}
        {required
          ? <span className="text-red-500 ml-0.5">*</span>
          : <span className="text-slate-400 ml-1 font-normal normal-case tracking-normal">(optional)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-navy-100 px-3 py-2.5 text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-sm";
const selectCls = inputCls + " bg-white";

// ─── Car Form (add + edit) ────────────────────────────────────────────────────
function CarForm({ token, editCar, onDone }) {
  const isEdit = !!editCar;
  const [form, setForm] = useState(isEdit ? carToForm(editCar) : EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [yearError, setYearError] = useState("");
  const [processing, setProcessing] = useState([false, false, false, false]);
  const fileRefs = [useRef(), useRef(), useRef(), useRef()];

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    // Clear the field-level error for this key as soon as the user edits it
    if (fieldErrors[key]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
    }
  }

  function setFeature(i, val) {
    const features = [...form.features]; features[i] = val; set("features", features);
  }
  function setHighlight(i, val) {
    const highlights = [...form.highlights]; highlights[i] = val; set("highlights", highlights);
  }

  async function handlePhoto(i, file) {
    if (!file) return;
    setProcessing((p) => { const next = [...p]; next[i] = true; return next; });
    try {
      const compressed = await compressImage(file);
      const previewUrl = URL.createObjectURL(compressed);
      setForm((f) => {
        const photos = [...f.photos];
        const previews = [...f.previews];
        photos[i] = compressed;
        previews[i] = previewUrl;
        return { ...f, photos, previews };
      });
    } catch (err) {
      setError(`Could not process photo ${i + 1}: ${err.message}`);
      if (fileRefs[i].current) fileRefs[i].current.value = "";
    } finally {
      setProcessing((p) => { const next = [...p]; next[i] = false; return next; });
    }
  }

  function clearPhoto(i) {
    const photos = [...form.photos];
    const previews = [...form.previews];
    photos[i] = null;
    previews[i] = isEdit ? form.existingUrls[i] : "";
    setForm((f) => ({ ...f, photos, previews }));
    if (fileRefs[i].current) fileRefs[i].current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess(false); setFieldErrors({});

    // Don't submit while we're still compressing a photo
    if (processing.some(Boolean)) {
      setError("Please wait for photos to finish optimizing.");
      return;
    }

    // ── Client-side validation — collect all errors before touching the API ──
    const clientErrors = {};

    if (!form.description.trim())
      clientErrors.description = "Short description is required.";
    if (!form.longDescription.trim())
      clientErrors.longDescription = "Full description is required.";

    const filledFeatures = form.features.filter((f) => f.trim() !== "");
    if (filledFeatures.length < 3)
      clientErrors.features = `At least 3 features are required (${filledFeatures.length} filled in so far).`;

    const filledHighlights = form.highlights.filter((h) => h.trim() !== "");
    if (filledHighlights.length < 1)
      clientErrors.highlights = "At least 1 highlight is required.";

    if (!isEdit && form.photos.some((p) => !p))
      clientErrors._photos = "Please select all 4 photos before submitting.";

    if (Object.keys(clientErrors).length > 0) {
      const { _photos, ...fieldErrs } = clientErrors;
      setFieldErrors(fieldErrs);
      setError(_photos || "Please fix the errors below before submitting.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      ["name","category","year","color","seats","doors","transmission","fuel",
       "consumption","bags","dailyRate","weeklyRate","monthlyRate","description","longDescription"]
        .forEach((k) => fd.append(k, form[k]));
      fd.append("features", JSON.stringify(form.features));
      fd.append("highlights", JSON.stringify(form.highlights));

      ["photo1","photo2","photo3","photo4"].forEach((name, i) => {
        if (form.photos[i]) {
          fd.append(name, form.photos[i]);
        } else if (isEdit && form.existingUrls[i]) {
          fd.append(`${name}_url`, form.existingUrls[i]);
        }
      });

      if (isEdit) {
        await updateCar(editCar._id, fd, token);
      } else {
        await addCar(fd, token);
      }

      setSuccess(true);
      if (!isEdit) {
        setForm(EMPTY_FORM);
        fileRefs.forEach((r) => { if (r.current) r.current.value = ""; });
      }
      // Show success banner briefly before navigating away
      setTimeout(() => onDone(), 1500);
    } catch (err) {
      setError(err.message);
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Full-screen loading overlay — shown while photos are uploading */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center gap-4 max-w-xs w-full mx-4">
            <div className="w-12 h-12 rounded-full border-4 border-navy-100 border-t-gold-500 animate-spin" />
            <p className="font-semibold text-navy-900 text-center text-sm">
              {isEdit ? "Saving changes…" : "Uploading photos and saving car…"}
            </p>
            <p className="text-xs text-slate-400 text-center leading-relaxed">
              Photos are being uploaded to the server.<br />Please wait and do not close this tab.
            </p>
          </div>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">{isEdit ? "Car updated successfully." : "Car added successfully."}</div>}

      {/* Basic info */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-4">Basic Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Car Name" required error={fieldErrors.name}>
            <input
              required
              className={`${inputCls} ${fieldErrors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Kia Picanto"
            />
          </Field>
          <Field label="Category" required error={fieldErrors.category}>
            <select
              required
              className={`${selectCls} ${fieldErrors.category ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Year" error={fieldErrors.year || yearError}>
            <input
              type="text"
              className={`${inputCls} ${(yearError || fieldErrors.year) ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
              value={form.year}
              onChange={(e) => { set("year", e.target.value); setYearError(""); }}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && !YEAR_RE.test(v))
                  setYearError('Invalid format. Use a single year (e.g. "2023") or a range (e.g. "2020 - 2023").');
              }}
              placeholder="e.g. 2023 or 2020 - 2023"
            />
          </Field>
          <Field label="Color" error={fieldErrors.color}>
            <input
              className={`${inputCls} ${fieldErrors.color ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="e.g. White"
            />
          </Field>
        </div>
      </div>

      {/* Specs */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-4">Specs</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Seats" error={fieldErrors.seats}>
            <input type="number" className={`${inputCls} ${fieldErrors.seats ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.seats} onChange={(e) => set("seats", e.target.value)} min="2" max="9" />
          </Field>
          <Field label="Doors" error={fieldErrors.doors}>
            <input type="number" className={`${inputCls} ${fieldErrors.doors ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.doors} onChange={(e) => set("doors", e.target.value)} min="2" max="5" />
          </Field>
          <Field label="Luggage Bags" error={fieldErrors.bags}>
            <input type="number" className={`${inputCls} ${fieldErrors.bags ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.bags} onChange={(e) => set("bags", e.target.value)} min="1" max="10" />
          </Field>
          <Field label="Transmission" error={fieldErrors.transmission}>
            <select className={`${selectCls} ${fieldErrors.transmission ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
              {TRANSMISSIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Fuel Type" error={fieldErrors.fuel}>
            <select className={`${selectCls} ${fieldErrors.fuel ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.fuel} onChange={(e) => set("fuel", e.target.value)}>
              {FUELS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="Consumption (L/100km)" error={fieldErrors.consumption}>
            <input className={`${inputCls} ${fieldErrors.consumption ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.consumption} onChange={(e) => set("consumption", e.target.value)} placeholder="e.g. 5.0 L / 100 km" />
          </Field>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-4">Pricing (USD)</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Daily Rate $" required error={fieldErrors.dailyRate}>
            <input required type="number" className={`${inputCls} ${fieldErrors.dailyRate ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.dailyRate} onChange={(e) => set("dailyRate", e.target.value)} min="1" placeholder="35" />
          </Field>
          <Field label="Weekly Rate $" error={fieldErrors.weeklyRate}>
            <input type="number" className={`${inputCls} ${fieldErrors.weeklyRate ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.weeklyRate} onChange={(e) => set("weeklyRate", e.target.value)} min="0" placeholder="210" />
          </Field>
          <Field label="Monthly Rate $" error={fieldErrors.monthlyRate}>
            <input type="number" className={`${inputCls} ${fieldErrors.monthlyRate ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.monthlyRate} onChange={(e) => set("monthlyRate", e.target.value)} min="0" placeholder="780" />
          </Field>
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-4">Descriptions</h3>
        <div className="space-y-4">
          <Field label="Short Description (1-2 sentences)" required error={fieldErrors.description}>
            <input className={`${inputCls} ${fieldErrors.description ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Compact and fuel friendly…" />
          </Field>
          <Field label="Full Description (2-3 sentences)" required error={fieldErrors.longDescription}>
            <textarea rows={4} className={`${inputCls} ${fieldErrors.longDescription ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`} value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)} placeholder="Describe the driving experience, who it suits, standout features…" />
          </Field>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-1">Features</h3>
        <p className="text-xs text-slate-400 mb-1">Minimum 3 required. Empty fields are ignored.</p>
        {fieldErrors.features && (
          <p className="mb-3 text-xs text-red-600 font-medium">{fieldErrors.features}</p>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {form.features.map((f, i) => (
            <Field key={i} label={`Feature ${i + 1}`}>
              <input className={inputCls} value={f} onChange={(e) => setFeature(i, e.target.value)}
                placeholder={["Air conditioning","Bluetooth audio","USB charging","Reverse camera","ABS brakes","Cruise control","Power windows","Front airbags"][i]} />
            </Field>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-1">Highlights</h3>
        <p className="text-xs text-slate-400 mb-1">Minimum 1 required. Short selling points shown on the car detail page.</p>
        {fieldErrors.highlights && (
          <p className="mb-3 text-xs text-red-600 font-medium">{fieldErrors.highlights}</p>
        )}
        <div className="grid sm:grid-cols-3 gap-4">
          {form.highlights.map((h, i) => (
            <Field key={i} label={`Highlight ${i + 1}`}>
              <input className={inputCls} value={h} onChange={(e) => setHighlight(i, e.target.value)}
                placeholder={["Great fuel economy","Easy to park","Best value"][i]} />
            </Field>
          ))}
        </div>
      </div>

      {/* Photos */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900/40 mb-1">Photos</h3>
        <p className="text-xs text-slate-400 mb-1">
          Photos are automatically optimized for faster uploads — quality is preserved.
        </p>
        {isEdit && <p className="text-xs text-slate-500 mb-2">Existing photos are shown. Click a photo to replace it, or leave it to keep the current one.</p>}
        {(fieldErrors.image || fieldErrors.gallery) && (
          <p className="mb-3 text-xs text-red-600">{fieldErrors.image || fieldErrors.gallery}</p>
        )}
        <div className="grid sm:grid-cols-2 gap-5">
          {PHOTO_LABELS.map((label, i) => {
            const hasPreview = !!form.previews[i];
            const isNewFile = !!form.photos[i];
            const isProcessing = processing[i];
            return (
              <div key={i} className="space-y-2">
                <label className="block text-xs font-semibold text-navy-900/70">
                  {label}{!isEdit && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {hasPreview ? (
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-cream-50 border-2 border-gold-500">
                    <img src={form.previews[i]} alt="" className="w-full h-full object-cover" />
                    {isNewFile && (
                      <span className="absolute top-2 left-2 bg-gold-500 text-navy-900 text-xs font-bold px-2 py-0.5 rounded-full">New</span>
                    )}
                    <button type="button" onClick={() => clearPhoto(i)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold transition">
                      ×
                    </button>
                    {isProcessing && (
                      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                        <div className="w-7 h-7 rounded-full border-3 border-white/30 border-t-gold-400 animate-spin" />
                        <span className="text-xs text-white font-semibold">Optimizing…</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className={`relative flex flex-col items-center justify-center aspect-[16/10] rounded-xl border-2 border-dashed bg-cream-50 transition ${isProcessing ? "border-gold-500 cursor-wait" : "border-navy-200 hover:border-gold-500 hover:bg-cream-100 cursor-pointer"}`}>
                    {isProcessing ? (
                      <>
                        <div className="w-7 h-7 rounded-full border-3 border-navy-100 border-t-gold-500 animate-spin" />
                        <span className="text-xs text-navy-400 mt-2 font-semibold">Optimizing…</span>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl text-navy-300">+</span>
                        <span className="text-xs text-navy-400 mt-1">Click to upload</span>
                      </>
                    )}
                    <input ref={fileRefs[i]} type="file" accept="image/*" className="hidden" disabled={isProcessing}
                      onChange={(e) => handlePhoto(i, e.target.files[0])} />
                  </label>
                )}
                {hasPreview && !isProcessing && (
                  <label className="block text-center text-xs text-gold-600 cursor-pointer hover:underline">
                    Replace photo
                    <input ref={fileRefs[i]} type="file" accept="image/*" className="hidden"
                      onChange={(e) => handlePhoto(i, e.target.files[0])} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        {isEdit && (
          <button type="button" onClick={onDone} className="btn-ghost flex-1 justify-center py-3">
            Cancel
          </button>
        )}
        <button type="submit" disabled={loading}
          className="btn-primary flex-1 justify-center text-base py-3 disabled:opacity-60">
          {loading
            ? (isEdit ? "Saving changes…" : "Uploading and saving…")
            : (isEdit ? "Save Changes" : "Add Car to Fleet")}
        </button>
      </div>
    </form>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [tab, setTab] = useState("fleet");
  const [editCar, setEditCar] = useState(null);

  async function loadCars() {
    try { setCars(await getAdminCars(token)); }
    catch { setCars([]); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadCars(); }, []);

  async function handleDelete(id) {
    setDeleting(true);
    try {
      await deleteCar(id, token);
      setCars((c) => c.filter((car) => car._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  async function handleToggle(car) {
    setTogglingId(car._id);
    try {
      const updated = await toggleAvailability(car._id, !car.available, token);
      setCars((prev) => prev.map((c) => c._id === car._id ? { ...c, available: updated.available } : c));
    } catch (err) {
      alert(err.message);
    } finally {
      setTogglingId(null);
    }
  }

  function openEdit(car) {
    setEditCar(car);
    setTab("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Admin sub-bar — sits below the site Navbar */}
      <div className="pt-24 sm:pt-28 lg:pt-32">
        <div className="bg-white border-b border-navy-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-navy-900">Admin Panel</span>
          <button onClick={onLogout}
            className="text-xs text-slate-500 hover:text-navy-900 border border-navy-100 hover:border-navy-300 rounded-lg px-3 py-1.5 transition">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => { setTab("fleet"); setEditCar(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${tab === "fleet" ? "bg-navy-900 text-white" : "bg-white text-navy-900 hover:bg-cream-100"}`}>
            Fleet ({cars.length})
          </button>
          <button onClick={() => { setTab("add"); setEditCar(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${tab === "add" ? "bg-navy-900 text-white" : "bg-white text-navy-900 hover:bg-cream-100"}`}>
            + Add New Car
          </button>
          {tab === "edit" && editCar && (
            <span className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold-500 text-navy-900">
              Editing: {editCar.name}
            </span>
          )}
        </div>

        {/* Fleet tab */}
        {tab === "fleet" && (
          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-5">Current Fleet</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-navy-100 border-t-gold-500 animate-spin" />
              </div>
            ) : cars.length === 0 ? (
              <p className="text-slate-500 text-sm">No cars yet. Add your first one.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.map((car) => {
                  const isAvailable = car.available !== false;
                  const isToggling = togglingId === car._id;
                  return (
                    <div key={car._id} className={`bg-white rounded-2xl shadow-card overflow-hidden transition ${!isAvailable ? "opacity-60" : ""}`}>
                      <div className="aspect-[16/10] bg-cream-100 relative">
                        <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                        {!isAvailable && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-gold-600 uppercase tracking-wider">{car.category}</span>
                        <h3 className="font-semibold text-navy-900">{car.name}</h3>
                        <p className="text-sm text-slate-500">${car.dailyRate} / day · {car.year} · {car.color}</p>

                        {/* Availability toggle */}
                        <button
                          onClick={() => handleToggle(car)}
                          disabled={isToggling}
                          className={`mt-3 w-full flex items-center justify-between px-3 py-2 rounded-xl border text-sm font-medium transition disabled:opacity-50 ${
                            isAvailable
                              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          <span>{isToggling ? "Updating…" : isAvailable ? "Available: click to hide" : "Unavailable: click to show"}</span>
                          {/* Toggle pill */}
                          <span className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${isAvailable ? "bg-green-500" : "bg-red-400"}`}>
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5 ${isAvailable ? "translate-x-4" : "translate-x-0.5"}`} />
                          </span>
                        </button>

                        <div className="mt-2 flex gap-2">
                          <button onClick={() => openEdit(car)}
                            className="flex-1 text-sm text-navy-900 border border-navy-200 hover:bg-navy-50 rounded-xl py-1.5 transition font-medium">
                            Edit
                          </button>
                          <button onClick={() => setDeleteId(car._id)}
                            className="flex-1 text-sm text-red-600 border border-red-200 hover:bg-red-50 rounded-xl py-1.5 transition font-medium">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Add car tab */}
        {tab === "add" && (
          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-6">Add New Car</h2>
            <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
              <CarForm token={token} onDone={() => { loadCars(); setTab("fleet"); }} />
            </div>
          </div>
        )}

        {/* Edit car tab */}
        {tab === "edit" && editCar && (
          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-6">Edit: {editCar.name}</h2>
            <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
              <CarForm
                token={token}
                editCar={editCar}
                onDone={() => { loadCars(); setTab("fleet"); setEditCar(null); }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-navy-900 text-lg">Delete this car?</h3>
            <p className="mt-2 text-sm text-slate-600">This cannot be undone. The car will be permanently removed from your fleet.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-ghost py-2 justify-center text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-2 text-sm transition disabled:opacity-60">
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin entry ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setToken(null);
  }

  // Register the global 401 handler so any expired/invalid token auto-logs out
  useEffect(() => {
    setUnauthorizedHandler(handleLogout);
    return () => setUnauthorizedHandler(null);
  }, []);

  if (!token) return <LoginScreen onLogin={setToken} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
