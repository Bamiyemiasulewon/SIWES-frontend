export type Role = 'student' | 'staff' | 'maintenance_officer' | 'complaint_officer' | 'admin';
export type RequestStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'reopened' | 'closed';
export type RequestPriority = 'low' | 'medium' | 'high' | 'critical';
export type RequestType = 'maintenance' | 'complaint';
export type FlagType = 'abuse' | 'threat' | 'false_report';

export type Department = {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string | null;
};

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
  department_id?: number | null;
  matric_number?: string | null;
  level?: number | null;
  officer_scope?: 'department' | 'bursary' | 'general' | null;
  created_at?: string | null;
};

export type RequestItem = {
  id: number;
  type: RequestType;
  category: string;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  is_anonymous: boolean;
  created_by: number | null;
  created_at: string;
  updated_at: string;
  department_id?: number | null;
  building?: string | null;
  room?: string | null;
  course_code?: string | null;
  asset_id?: number | null;
  assigned_to?: number | null;
  resolution_notes?: string | null;
  reopen_count?: number;
  is_flagged?: boolean;
  flag_type?: FlagType | null;
  flag_reason?: string | null;
  flagged_by?: number | null;
  flagged_at?: string | null;
  creator_email?: string | null;
  creator_matric_number?: string | null;
  creator_level?: number | null;
  identity_revealed?: boolean;
};

export type PaginationResponse<T> = {
  items: T[];
  page: number;
  pages: number;
  total: number;
};

export type AuthResponse = {
  token: string;
  user: CurrentUser;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirm_password?: string;
  matric_number?: string;
  department_id?: number;
  level?: number;
};

export type HistoryEntry = {
  id: number;
  field_changed: string;
  old_value?: string | null;
  new_value?: string | null;
  note?: string | null;
  changed_by?: number | null;
  changed_at?: string | null;
};
