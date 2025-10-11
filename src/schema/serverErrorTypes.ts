export type UserServerErrors = 'empty_fields' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export type DriverServerErrors = 'empty_fields' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';

export type CarpoolServerErrors = 'carpool_application_already_exists' | 'generic_error' | 'no_carpools_found' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete';

export type VehicleServerErrors = 'empty_fields' | 'seat_capacity_invalid' | 'available_seats_invalid' | 'seat_mismatch_error' | 'license_plate_invalid' | 'driver_start_time_invalid' | 'driver_end_time_invalid' | 'server_error_get' | 'server_error_post' | 'server_error_put' | 'server_error_delete' | 'generic_error';
