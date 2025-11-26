export interface FacilityAuthor {
  id: number;
  name: string;
  email: string;
}

export interface Facility {
  id: number;
  tenant_id: number;
  author_id: number;
  author_name: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  capacity: number | null;
  is_active: boolean;
  amenities: string;
  created_at: string;
  updated_at: string;
}

export interface FacilityCreate {
  name: string;
  description: string;
  address: string;
  capacity?: number | null;
  is_active?: boolean;
  amenities?: string;
}

export interface FacilityUpdate extends Partial<FacilityCreate> {}
