export interface EventOrganizer {
  id: number;
  name: string;
  email: string;
}

export interface Event {
  id: number;
  tenant_id: number | null;
  organizer_id: number;
  organizer_name: string;
  title: string;
  slug: string;
  description: string;
  status: 'pending' | 'scheduled' | 'cancelled' | 'completed';
  is_active: boolean;
  is_public: boolean;
  facility_id: number | null;
  facility_name: string | null;
  location: string;
  address: string;
  address_url: string | null;
  start_datetime: string;
  end_datetime: string | null;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  recurrence_end_date: string | null;
  recurrence_interval: number;
  recurrence_days_of_week: string;
  recurrence_count: number | null;
  recurrence_monthly_mode: string | null;
  requires_registration: boolean;
  registration_deadline: string | null;
  auto_confirm_registration: boolean;
  members_only: boolean;
  has_cost: boolean;
  cost_amount: string;
  cost_currency: string;
  capacity: number | null;
  created_at: string;
  updated_at: string;
  // Frontend-only field (not stored in backend yet)
  show_organizer?: boolean;
}

export interface EventCreate {
  title: string;
  description?: string;
  location?: string;
  address?: string;
  address_url?: string;
  start_datetime: string;
  end_datetime?: string;
  is_public?: boolean;
  facility_id?: number | null;
  recurrence_type?: string;
  recurrence_end_date?: string | null;
  recurrence_interval?: number;
  recurrence_days_of_week?: string;
  requires_registration?: boolean;
  registration_deadline?: string | null;
  auto_confirm_registration?: boolean;
  members_only?: boolean;
  has_cost?: boolean;
  cost_amount?: string;
  cost_currency?: string;
  capacity?: number | null;
}

export interface EventUpdate {
  title?: string;
  description?: string;
  location?: string;
  address?: string;
  address_url?: string;
  start_datetime?: string;
  end_datetime?: string;
  is_public?: boolean;
  is_active?: boolean;
  status?: string;
  facility_id?: number | null;
  recurrence_type?: string;
  recurrence_end_date?: string | null;
  recurrence_interval?: number;
  recurrence_days_of_week?: string;
  requires_registration?: boolean;
  registration_deadline?: string | null;
  auto_confirm_registration?: boolean;
  members_only?: boolean;
  has_cost?: boolean;
  cost_amount?: string;
  cost_currency?: string;
  capacity?: number | null;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlist';
  notes: string;
  amount_due: string;
  registered_at: string;
  confirmed_at: string | null;
  updated_at: string;
}

export interface EventRegistrationCreate {
  participant_name?: string;
  participant_email?: string;
  participant_phone?: string;
  notes?: string;
}
