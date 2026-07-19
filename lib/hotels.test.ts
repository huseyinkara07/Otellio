import { describe, expect, it } from "vitest";
import { pickActiveHotel, type Hotel } from "./hotels";

function hotel(id: string, name: string): Hotel {
  return {
    id,
    user_id: "u1",
    name,
    room_count: 40,
    base_price: 1500,
    created_at: "2026-01-01T00:00:00Z",
  };
}

const hotels = [hotel("a", "Deniz"), hotel("b", "Orman")];

describe("pickActiveHotel", () => {
  it("cookie'deki tesisi secer", () => {
    expect(pickActiveHotel(hotels, "b")?.name).toBe("Orman");
  });

  it("cookie yoksa veya taninmiyorsa ilk tesise duser", () => {
    expect(pickActiveHotel(hotels, undefined)?.name).toBe("Deniz");
    expect(pickActiveHotel(hotels, null)?.name).toBe("Deniz");
    expect(pickActiveHotel(hotels, "silinmis-id")?.name).toBe("Deniz");
  });

  it("hic tesis yoksa null doner", () => {
    expect(pickActiveHotel([], "a")).toBeNull();
  });
});
