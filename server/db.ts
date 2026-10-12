import pg from 'pg';

const { Pool } = pg;

export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'candidate' | 'recruiter' | 'admin';
  skills?: string;
  resume_link?: string;
  company_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
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
  drive_title?: string;
  company_name?: string;
  created_at: string;
}

// In-Memory Seed Storage for resilient instant dev preview
let memoryUsers: User[] = [
  {
    id: 1,
    full_name: 'Alex Rivera',
    email: 'alex.candidate@nexus.dev',
    password_hash: 'password123',
    role: 'candidate',
    skills: 'React, TypeScript, Node.js, PostgreSQL, TailwindCSS',
    resume_link: 'https://github.com/alexrivera-portfolio',
    phone: '+1 555-0192',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    full_name: 'Sarah Chen',
    email: 'sarah.recruiter@cyberai.io',
    password_hash: 'password123',
    role: 'recruiter',
    skills: 'Technical Hiring, System Design, AI Staffing',
    company_name: 'CyberAI Labs',
    phone: '+1 555-0348',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    full_name: 'Marcus Vance',
    email: 'marcus.recruiter@cloudpulse.tech',
    password_hash: 'password123',
    role: 'recruiter',
    skills: 'Cloud Infrastructure, Engineering Leadership',
    company_name: 'CloudPulse Technologies',
    phone: '+1 555-0812',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    full_name: 'Priya Sharma',
    email: 'priya.dev@nexus.dev',
    password_hash: 'password123',
    role: 'candidate',
    skills: 'Python, PyTorch, FastAPI, Docker, Next.js',
    resume_link: 'https://linkedin.com/in/priya-sharma-ai',
    phone: '+91 98765 43210',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  }
];

const nextTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const nextFourDays = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const nextFiveDays = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const nextSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

let memoryDrives: JobDrive[] = [
  {
    id: 1,
    recruiter_id: 2,
    company_name: 'CyberAI Labs',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    drive_title: 'Senior Full-Stack & Generative AI Drive',
    role_category: 'AI / Machine Learning',
    drive_date: nextTwoDays,
    drive_time: '10:00 AM - 04:30 PM',
    drive_mode: 'Hybrid',
    venue_or_link: 'Silicon Hall Tech Park / Google Meet Room 4',
    description: 'Join our core platform engineering team building low-latency LLM agent pipelines and modern reactive interfaces. Immediate offer rollouts on fair day.',
    salary_range: '$130,000 - $175,000 / yr',
    open_positions: 8,
    requirements: '3+ years with TypeScript, React, Node.js or Python. Experience with vector databases and distributed systems is a plus.',
    tags: 'React, Node.js, Python, Vector DB, LLM',
    available_slots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    status: 'Active',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    recruiter_id: 3,
    company_name: 'CloudPulse Technologies',
    company_logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
    drive_title: 'Cloud DevOps & Distributed Systems Sprint',
    role_category: 'Cloud & DevOps',
    drive_date: nextFourDays,
    drive_time: '09:30 AM - 03:00 PM',
    drive_mode: 'Online',
    venue_or_link: 'Zoom Nexus Stream - Room A',
    description: 'High-volume hiring drive for Platform Reliability Engineers and Kubernetes Infrastructure architects supporting enterprise multitenant SaaS.',
    salary_range: '$120,000 - $160,000 / yr',
    open_positions: 12,
    requirements: 'Experience with Kubernetes, Terraform, AWS/GCP, Docker container security, CI/CD automated deployment architectures.',
    tags: 'Kubernetes, AWS, Terraform, Docker, Go',
    available_slots: ['09:30 AM', '10:30 AM', '11:30 AM', '01:30 PM', '02:30 PM'],
    status: 'Active',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    recruiter_id: 2,
    company_name: 'FinEdge Quantum',
    company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    drive_title: 'Fintech Frontend & High-Performance UI Summit',
    role_category: 'Frontend Engineering',
    drive_date: nextFiveDays,
    drive_time: '11:00 AM - 05:00 PM',
    drive_mode: 'In-Person',
    venue_or_link: 'Nexus Convention Center, Booth 14B',
    description: 'Exclusive spot offers for exceptional UI/UX React and WebGL developers building ultra-responsive real-time market trading dashboards.',
    salary_range: '$110,000 - $150,000 / yr',
    open_positions: 6,
    requirements: 'Strong portfolio demonstrating high performance React/Next.js applications, state management, WebSocket streaming, and Tailwind CSS.',
    tags: 'React, TypeScript, WebSocket, Tailwind, Next.js',
    available_slots: ['11:00 AM', '11:45 AM', '02:00 PM', '03:30 PM', '04:15 PM'],
    status: 'Active',
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    recruiter_id: 3,
    company_name: 'Apex BioCompute',
    company_logo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150&auto=format&fit=crop&q=80',
    drive_title: 'Data Engineering & Kafka Analytics Fast-Track',
    role_category: 'Data & Analytics',
    drive_date: nextSevenDays,
    drive_time: '10:00 AM - 04:00 PM',
    drive_mode: 'Online',
    venue_or_link: 'Nexus Virtual Stage 2',
    description: 'Seeking Data Engineers to build reliable ETL pipelines, Kafka event backbones, and Snowflake analytical data warehouses.',
    salary_range: '$115,000 - $155,000 / yr',
    open_positions: 5,
    requirements: 'Proficiency with PostgreSQL/SQL, Apache Spark, Python data processing, and cloud warehouses.',
    tags: 'PostgreSQL, Python, Spark, Kafka, SQL',
    available_slots: ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM'],
    status: 'Active',
    created_at: new Date().toISOString()
  }
];

let memoryBookings: InterviewBooking[] = [
  {
    id: 1,
    drive_id: 1,
    candidate_id: 1,
    recruiter_id: 2,
    interview_date: nextTwoDays,
    slot_time: '10:00 AM',
    candidate_name: 'Alex Rivera',
    candidate_email: 'alex.candidate@nexus.dev',
    resume_link: 'https://github.com/alexrivera-portfolio',
    skills: 'React, TypeScript, Node.js, PostgreSQL',
    qr_pass_token: 'NEXUS-PASS-1-1000-ARIV',
    status: 'Confirmed',
    company_name: 'CyberAI Labs',
    drive_title: 'Senior Full-Stack & Generative AI Drive',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    drive_id: 2,
    candidate_id: 4,
    recruiter_id: 3,
    interview_date: nextFourDays,
    slot_time: '09:30 AM',
    candidate_name: 'Priya Sharma',
    candidate_email: 'priya.dev@nexus.dev',
    resume_link: 'https://linkedin.com/in/priya-sharma-ai',
    skills: 'Python, Docker, Next.js, FastAPI',
    qr_pass_token: 'NEXUS-PASS-2-0930-PSHA',
    status: 'Confirmed',
    company_name: 'CloudPulse Technologies',
    drive_title: 'Cloud DevOps & Distributed Systems Sprint',
    created_at: new Date().toISOString()
  }
];

let pool: pg.Pool | null = null;
let isPostgresConnected = false;

// Attempt PostgreSQL connection if DATABASE_URL or standard PG credentials exist
export async function initDatabase() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (connectionString) {
    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
      });
      await pool.query('SELECT NOW()');
      isPostgresConnected = true;
      console.log('⚡ [PostgreSQL] Connected successfully to PostgreSQL database instance.');
    } catch (err) {
      console.warn('⚠️ [PostgreSQL] Connection failed, activating in-memory PG compatibility layer:', (err as Error).message);
      isPostgresConnected = false;
    }
  } else {
    console.log('ℹ️ [NexusHire DB] No DATABASE_URL provided. Running with active in-memory PostgreSQL simulation engine.');
  }
}

export const db = {
  isPostgres: () => isPostgresConnected,

  // Users repository
  async findUserByEmail(email: string): Promise<User | null> {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      return res.rows[0] || null;
    }
    return memoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: number): Promise<User | null> {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryUsers.find(u => u.id === id) || null;
  },

  async createUser(data: Partial<User>): Promise<User> {
    if (isPostgresConnected && pool) {
      const res = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role, skills, resume_link, company_name, phone, avatar_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          data.full_name,
          data.email,
          data.password_hash,
          data.role || 'candidate',
          data.skills || '',
          data.resume_link || '',
          data.company_name || null,
          data.phone || null,
          data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        ]
      );
      return res.rows[0];
    }

    const newUser: User = {
      id: memoryUsers.length ? Math.max(...memoryUsers.map(u => u.id)) + 1 : 1,
      full_name: data.full_name || 'Anonymous User',
      email: data.email || '',
      password_hash: data.password_hash || '',
      role: (data.role as 'candidate' | 'recruiter') || 'candidate',
      skills: data.skills || '',
      resume_link: data.resume_link || '',
      company_name: data.company_name,
      phone: data.phone || '',
      avatar_url: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      created_at: new Date().toISOString()
    };
    memoryUsers.push(newUser);
    return newUser;
  },

  // Job Drives repository
  async getDrives(search?: string, category?: string, mode?: string): Promise<JobDrive[]> {
    if (isPostgresConnected && pool) {
      let query = 'SELECT * FROM job_drives WHERE 1=1';
      const params: unknown[] = [];
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (drive_title ILIKE $${params.length} OR company_name ILIKE $${params.length} OR tags ILIKE $${params.length})`;
      }
      if (category && category !== 'All') {
        params.push(category);
        query += ` AND role_category = $${params.length}`;
      }
      if (mode && mode !== 'All') {
        params.push(mode);
        query += ` AND drive_mode = $${params.length}`;
      }
      query += ' ORDER BY drive_date ASC';
      const res = await pool.query(query, params);
      return res.rows;
    }

    return memoryDrives.filter(d => {
      const matchesSearch = !search ||
        d.drive_title.toLowerCase().includes(search.toLowerCase()) ||
        d.company_name.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || category === 'All' || d.role_category === category;
      const matchesMode = !mode || mode === 'All' || d.drive_mode === mode;
      return matchesSearch && matchesCategory && matchesMode;
    });
  },

  async getDriveById(id: number): Promise<JobDrive | null> {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM job_drives WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return memoryDrives.find(d => d.id === id) || null;
  },

  async createDrive(driveData: Partial<JobDrive>): Promise<JobDrive> {
    const slots = driveData.available_slots || [
      '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    if (isPostgresConnected && pool) {
      const res = await pool.query(
        `INSERT INTO job_drives (recruiter_id, company_name, company_logo, drive_title, role_category, drive_date, drive_time, drive_mode, venue_or_link, description, salary_range, open_positions, requirements, tags, available_slots, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING *`,
        [
          driveData.recruiter_id,
          driveData.company_name,
          driveData.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
          driveData.drive_title,
          driveData.role_category,
          driveData.drive_date,
          driveData.drive_time || '10:00 AM - 04:00 PM',
          driveData.drive_mode || 'Online',
          driveData.venue_or_link,
          driveData.description,
          driveData.salary_range || 'Competitive',
          driveData.open_positions || 5,
          driveData.requirements,
          driveData.tags || 'Tech',
          JSON.stringify(slots),
          'Active'
        ]
      );
      return res.rows[0];
    }

    const newDrive: JobDrive = {
      id: memoryDrives.length ? Math.max(...memoryDrives.map(d => d.id)) + 1 : 1,
      recruiter_id: driveData.recruiter_id || 2,
      company_name: driveData.company_name || 'Tech Innovators',
      company_logo: driveData.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      drive_title: driveData.drive_title || 'Campus Special Drive',
      role_category: driveData.role_category || 'Software Engineering',
      drive_date: driveData.drive_date || new Date().toISOString().split('T')[0],
      drive_time: driveData.drive_time || '10:00 AM - 04:00 PM',
      drive_mode: (driveData.drive_mode as 'Online' | 'In-Person' | 'Hybrid') || 'Online',
      venue_or_link: driveData.venue_or_link || 'Nexus Online Meet',
      description: driveData.description || 'Exciting hiring drive opportunity.',
      salary_range: driveData.salary_range || '$90k - $130k',
      open_positions: Number(driveData.open_positions) || 5,
      requirements: driveData.requirements || 'Experience in modern tech stacks.',
      tags: driveData.tags || 'Fullstack, Cloud',
      available_slots: slots,
      status: 'Active',
      created_at: new Date().toISOString()
    };
    memoryDrives.unshift(newDrive);
    return newDrive;
  },

  // Interview Bookings repository
  async getBookings(candidateId?: number, recruiterId?: number): Promise<InterviewBooking[]> {
    if (isPostgresConnected && pool) {
      let query = `
        SELECT b.*, d.drive_title, d.company_name, d.venue_or_link, d.drive_mode 
        FROM interview_bookings b
        JOIN job_drives d ON b.drive_id = d.id
        WHERE 1=1
      `;
      const params: unknown[] = [];
      if (candidateId) {
        params.push(candidateId);
        query += ` AND b.candidate_id = $${params.length}`;
      }
      if (recruiterId) {
        params.push(recruiterId);
        query += ` AND (b.recruiter_id = $${params.length} OR d.recruiter_id = $${params.length})`;
      }
      query += ' ORDER BY b.created_at DESC';
      const res = await pool.query(query, params);
      return res.rows;
    }

    return memoryBookings.filter(b => {
      if (candidateId && b.candidate_id !== candidateId) return false;
      if (recruiterId && b.recruiter_id !== recruiterId) return false;
      return true;
    }).map(b => {
      const drive = memoryDrives.find(d => d.id === b.drive_id);
      return {
        ...b,
        company_name: drive?.company_name || b.company_name,
        drive_title: drive?.drive_title || b.drive_title
      };
    });
  },

  async createBooking(bookingData: Partial<InterviewBooking>): Promise<InterviewBooking> {
    const drive = await this.getDriveById(Number(bookingData.drive_id));
    const token = `NEXUS-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isPostgresConnected && pool) {
      const res = await pool.query(
        `INSERT INTO interview_bookings 
         (drive_id, candidate_id, recruiter_id, interview_date, slot_time, candidate_name, candidate_email, resume_link, skills, qr_pass_token, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          bookingData.drive_id,
          bookingData.candidate_id,
          drive?.recruiter_id || 2,
          bookingData.interview_date || drive?.drive_date || new Date().toISOString().split('T')[0],
          bookingData.slot_time,
          bookingData.candidate_name,
          bookingData.candidate_email,
          bookingData.resume_link,
          bookingData.skills,
          token,
          'Confirmed'
        ]
      );
      return {
        ...res.rows[0],
        company_name: drive?.company_name,
        drive_title: drive?.drive_title
      };
    }

    const newBooking: InterviewBooking = {
      id: memoryBookings.length ? Math.max(...memoryBookings.map(b => b.id)) + 1 : 1,
      drive_id: Number(bookingData.drive_id),
      candidate_id: Number(bookingData.candidate_id),
      recruiter_id: drive?.recruiter_id || 2,
      interview_date: bookingData.interview_date || drive?.drive_date || new Date().toISOString().split('T')[0],
      slot_time: bookingData.slot_time || '10:00 AM',
      candidate_name: bookingData.candidate_name || 'Candidate',
      candidate_email: bookingData.candidate_email || '',
      resume_link: bookingData.resume_link || '',
      skills: bookingData.skills || '',
      qr_pass_token: token,
      status: 'Confirmed',
      company_name: drive?.company_name || 'Hiring Company',
      drive_title: drive?.drive_title || 'Campus Drive',
      created_at: new Date().toISOString()
    };
    memoryBookings.unshift(newBooking);
    return newBooking;
  },

  async updateBookingStatus(id: number, status: InterviewBooking['status'], feedback?: string): Promise<InterviewBooking | null> {
    if (isPostgresConnected && pool) {
      const res = await pool.query(
        'UPDATE interview_bookings SET status = $1, recruiter_feedback = COALESCE($2, recruiter_feedback) WHERE id = $3 RETURNING *',
        [status, feedback, id]
      );
      return res.rows[0] || null;
    }

    const booking = memoryBookings.find(b => b.id === id);
    if (booking) {
      booking.status = status;
      if (feedback) booking.recruiter_feedback = feedback;
      return booking;
    }
    return null;
  },

  async getStats() {
    const totalDrives = isPostgresConnected && pool ? (await pool.query('SELECT COUNT(*) FROM job_drives')).rows[0].count : memoryDrives.length;
    const totalCandidates = isPostgresConnected && pool ? (await pool.query("SELECT COUNT(*) FROM users WHERE role = 'candidate'")).rows[0].count : memoryUsers.filter(u => u.role === 'candidate').length;
    const totalBookings = isPostgresConnected && pool ? (await pool.query('SELECT COUNT(*) FROM interview_bookings')).rows[0].count : memoryBookings.length;
    return {
      totalDrives: Number(totalDrives),
      totalCandidates: Number(totalCandidates),
      totalBookings: Number(totalBookings),
      avgHiringRatio: '78%',
      partnerCompanies: 45
    };
  }
};
