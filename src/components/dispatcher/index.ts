/**
 * @module dispatcher
 * Barrel exports for the Trip Dispatcher feature components.
 */

export { default as DispatcherStat } from "./DispatcherStat";
export { default as ActiveTripsTable } from "./ActiveTripsTable";
export { default as NewTripForm } from "./NewTripForm";
export { default as VehicleAlert } from "./VehicleAlert";
export { default as NewTripModal } from "./NewTripModal";
export { default as LocationInput } from "./LocationInput";
export { type LocationValue } from "./LocationInput";

export {
  // Types
  type VehicleTypeBadge,
  type TripProgress,
  type ActiveTrip,
  type AvailableDriver,
  // Constants & data
  vehicleTypeIcon,
  vehicleTypeBgColor,
  progressColor,
  activeTrips,
  availableDrivers,
  inferVehicleType,
} from "./constants";
