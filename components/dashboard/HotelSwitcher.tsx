"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { dashboard } from "@/lib/content";
import { setActiveHotel } from "@/lib/actions/hotels";

// Birden fazla tesisi olan kullanici icin ust cubuktaki tesis secici.
// Secim, sunucu tarafinda httpOnly cookie'ye yazilir ve sayfa yenilenir;
// tek tesisi olan kullanici secici yerine yalnizca tesis adini gorur.
export default function HotelSwitcher({
  hotels,
  activeHotelId,
}: {
  hotels: { id: string; name: string }[];
  activeHotelId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(activeHotelId);

  if (hotels.length === 1) {
    return (
      <span className="max-w-40 truncate text-sm font-medium text-navy sm:max-w-56">
        {hotels[0].name}
      </span>
    );
  }

  function handleChange(hotelId: string) {
    setSelected(hotelId);
    startTransition(async () => {
      const result = await setActiveHotel(hotelId);
      if (result.success) {
        router.refresh();
      } else {
        setSelected(activeHotelId);
      }
    });
  }

  return (
    <select
      aria-label={dashboard.activeHotelLabel}
      value={selected}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value)}
      className="h-11 max-w-40 rounded-button border border-black/15 bg-white px-2 text-sm font-medium text-navy focus-visible:border-accent disabled:opacity-70 sm:max-w-56"
    >
      {hotels.map((hotel) => (
        <option key={hotel.id} value={hotel.id}>
          {hotel.name}
        </option>
      ))}
    </select>
  );
}
