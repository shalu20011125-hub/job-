export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  skills?: string;
  resume_link?: string;
  company_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface JobDrive {
  id: number;
  recruiter_id: number;
  company_name: string;
  company_logo: string;
  drive_title: string;
  role_category: string;
  drive_date: string;
  drive_time: string;
  drive_mode: 'Online' | 'In-Person' | 'Hybrid';
  venue_or_link: string;
  description: string;
  salary_range: string;
  open_positions: number;
  requirements: string;
  tags: string;
  available_slots: string[];
  status: 'Active' | 'Upcoming' | 'Closed';
  created_at: string;
}

export interface InterviewBooking {
  id: number;
  drive_id: number;
  candidate_id: number;
  recruiter_id: number;
  interview_date: string;
  slot_time: string;
  candidate_name: string;
  candidate_email: string;
  resume_link?: string;
  skills?: string;
  qr_pass_token: string;
  status: 'Confirmed' | 'Shortlisted' | 'Passed' | 'Rejected' | 'Cancelled';
  recruiter_feedback?: string;
  company_name?: string;
  drive_title?: string;
  drive_mode?: 'Online' | 'In-Person' | 'Hybrid';
  venue_or_link?: string;
  created_at: string;
}
