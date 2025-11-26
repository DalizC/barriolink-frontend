export interface BookingCreator {
  id: number;
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  tenant_id: number | null;
  facility_id: number;
  facility_name: string;
  event_id: number | null;
  event_title: string | null;
  start_at: string;
  end_at: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_by_id: number;
  created_by_name: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface BookingCreate {
  facility_id: number;
  event_id?: number | null;
  start_at: string;
  end_at: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface BookingUpdate extends Partial<BookingCreate> {}
