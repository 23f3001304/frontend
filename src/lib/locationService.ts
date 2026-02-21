/**
 * @module locationService
 * Free geocoding (Nominatim) and routing (OSRM) services.
 *
 * - **Nominatim** — OpenStreetMap's free geocoder for address autocomplete.
 *   Docs: https://nominatim.org/release-docs/develop/api/Search/
 *
 * - **OSRM** — Open Source Routing Machine for driving distance & duration.
 *   Docs: https://project-osrm.org/docs/v5.24.0/api/#route-service
 *
 * Both services are free & keyless; Nominatim asks for ≤1 req/sec and a
 * descriptive User-Agent (handled via debounce in the UI layer).
 */

/* ─── Types ─── */

/** A single geocoding suggestion returned by Nominatim. */
export interface LocationSuggestion {
  /** Nominatim place_id (unique). */
  placeId: string;
  /** Human-readable display name. */
  displayName: string;
  /** Latitude (string from API, parsed to number on use). */
  lat: number;
  /** Longitude. */
  lon: number;
  /** OSM type (city, town, village …). */
  type: string;
}

/** Result of an OSRM route lookup. */
export interface RouteResult {
  /** Driving distance in **kilometres**. */
  distanceKm: number;
  /** Estimated driving duration in **minutes**. */
  durationMin: number;
  /** Estimated fuel cost (₹). Uses `FUEL_RATE_PER_KM`. */
  fuelCost: number;
}

/** Possible error states for location / routing. */
export type LocationError =
  | { kind: "not-found"; message: string }
  | { kind: "no-route"; message: string }
  | { kind: "network"; message: string };

/* ─── Constants ─── */

/** Average fuel cost per km for a fleet truck (₹). Adjust as needed. */
const FUEL_RATE_PER_KM = 12;

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const OSRM_BASE = "https://router.project-osrm.org";
const USER_AGENT = "FleetFlowCommandCenter/1.0";

/* ─── Geocoding (Nominatim) ─── */

/**
 * Search for location suggestions.
 * Returns up to `limit` results matching `query`.
 */
export async function searchLocations(
  query: string,
  limit = 5,
  signal?: AbortSignal,
): Promise<LocationSuggestion[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: String(limit),
  });

  const res = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw { kind: "network", message: `Nominatim error: ${res.status}` } satisfies LocationError;

  const data: Array<{
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
  }> = await res.json();

  return data.map((d) => ({
    placeId: String(d.place_id),
    displayName: d.display_name,
    lat: parseFloat(d.lat),
    lon: parseFloat(d.lon),
    type: d.type,
  }));
}

/* ─── Routing (OSRM) ─── */

/**
 * Calculate the driving route between two coordinates.
 * Returns distance, duration, and estimated fuel cost.
 * Throws a `LocationError` on failure / no-route.
 *
 * Validates OSRM waypoint snapping distance — if OSRM had to snap a
 * coordinate far from any road (> 25 km), the location is treated as
 * unreachable. Also rejects zero-distance routes (same snap point).
 */
export async function calculateRoute(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
  signal?: AbortSignal,
): Promise<RouteResult> {
  // OSRM expects lon,lat order
  const coords = `${fromLon},${fromLat};${toLon},${toLat}`;
  const url = `${OSRM_BASE}/route/v1/driving/${coords}?overview=false`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal,
  });

  if (!res.ok) throw { kind: "network", message: `OSRM error: ${res.status}` } satisfies LocationError;

  const data: {
    code: string;
    routes?: Array<{ distance: number; duration: number }>;
    waypoints?: Array<{ distance: number; name: string; location: [number, number] }>;
    message?: string;
  } = await res.json();

  // ── Hard failures from OSRM ──
  if (data.code === "NoRoute") {
    throw {
      kind: "no-route",
      message: "No driving route exists between these locations.",
    } satisfies LocationError;
  }

  if (data.code === "NoSegment") {
    throw {
      kind: "no-route",
      message: "One or both locations are not near any road.",
    } satisfies LocationError;
  }

  if (data.code !== "Ok" || !data.routes?.length) {
    throw {
      kind: "no-route",
      message: data.message ?? "No driving route found between these locations.",
    } satisfies LocationError;
  }

  // ── Waypoint snap-distance validation ──
  // OSRM snaps input coordinates to the nearest road segment and reports
  // how far (in metres) it had to move. A large snap distance means the
  // coordinate is in the ocean, a desert with no roads, etc.
  const MAX_SNAP_DISTANCE_M = 25_000; // 25 km
  if (data.waypoints?.length) {
    for (const wp of data.waypoints) {
      if (wp.distance > MAX_SNAP_DISTANCE_M) {
        throw {
          kind: "no-route",
          message: `Location "${wp.name || "unknown"}" is too far from any road (${(wp.distance / 1000).toFixed(1)} km). Choose a more specific address.`,
        } satisfies LocationError;
      }
    }
  }

  const route = data.routes[0];
  const distanceKm = +(route.distance / 1000).toFixed(1);
  const durationMin = +(route.duration / 60).toFixed(0);

  // ── Zero / near-zero distance ──
  if (distanceKm < 0.5) {
    throw {
      kind: "no-route",
      message: "Origin and destination are too close or resolve to the same point.",
    } satisfies LocationError;
  }

  const fuelCost = +(distanceKm * FUEL_RATE_PER_KM).toFixed(2);

  return { distanceKm, durationMin, fuelCost };
}

/**
 * Fuel rate exposed so UI can show "₹X/km" in the cost breakdown.
 */
export { FUEL_RATE_PER_KM };
