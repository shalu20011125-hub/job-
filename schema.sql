-- ==============================================================================
-- NEXUSHIRE - CAREER & JOB FAIR HUB EVENT MANAGEMENT SYSTEM
-- PostgreSQL Database Schema with Foreign Keys, Constraints, and Seed Data
-- ==============================================================================

-- Drop existing tables if needed (cascade to drop foreign key dependencies)
DROP TABLE IF EXISTS interview_bookings CASCADE;
DROP TABLE IF EXISTS job_drives CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Extension for UUID generation if using PostgreSQL UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
-- Stores authentication and profile data for both Candidates and Recruiters
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
    skills TEXT,                                  -- Comma-separated or tech stack list
    resume_link VARCHAR(500),                     -- URL to portfolio / Google Drive / LinkedIn
    company_name VARCHAR(150),                    -- Filled if recruiter
    phone VARCHAR(30),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on email and role for fast lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 2. JOB DRIVES TABLE
-- Stores IT hiring drives, company profiles, event dates, and requirements
CREATE TABLE job_drives (
    id SERIAL PRIMARY KEY,
    recruiter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    company_name VARCHAR(150) NOT NULL,
    company_logo VARCHAR(500),
    drive_title VARCHAR(200) NOT NULL,
    role_category VARCHAR(100) NOT NULL,          -- e.g. 'Full-Stack Engineering', 'AI / ML', 'Cloud DevOps'
    drive_date DATE NOT NULL,
    drive_time VARCHAR(50) NOT NULL,              -- e.g. '09:00 AM - 05:00 PM'
    drive_mode VARCHAR(30) NOT NULL DEFAULT 'Online' CHECK (drive_mode IN ('Online', 'In-Person', 'Hybrid')),
    venue_or_link VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    salary_range VARCHAR(100),                    -- e.g. '$90k - $140k' or '₹12 - 22 LPA'
    open_positions INTEGER DEFAULT 5,
    requirements TEXT NOT NULL,                   -- Prerequisites, eligibility, experience
    tags TEXT,                                    -- Comma-separated: 'React, Node.js, PostgreSQL'
    available_slots JSONB NOT NULL,               -- Array of slot strings: '["09:30 AM", "10:30 AM", ...]'
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Upcoming', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_drives_date ON job_drives(drive_date);
CREATE INDEX idx_job_drives_category ON job_drives(role_category);
CREATE INDEX idx_job_drives_status ON job_drives(status);

-- 3. INTERVIEW BOOKINGS TABLE
-- Handles candidate 1-on-1 interview slot bookings, QR Pass issuance, and evaluation status
CREATE TABLE interview_bookings (
    id SERIAL PRIMARY KEY,
    drive_id INTEGER NOT NULL REFERENCES job_drives(id) ON DELETE CASCADE,
    candidate_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recruiter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    interview_date DATE NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    candidate_name VARCHAR(150) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    resume_link VARCHAR(500),
    skills TEXT,
    qr_pass_token VARCHAR(120) UNIQUE NOT NULL,    -- Secure digital pass token for venue/booth entry
    status VARCHAR(30) DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Shortlisted', 'Passed', 'Rejected', 'Cancelled')),
    recruiter_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_candidate_drive_slot UNIQUE (drive_id, slot_time, interview_date)
);

CREATE INDEX idx_bookings_candidate ON interview_bookings(candidate_id);
CREATE INDEX idx_bookings_drive ON interview_bookings(drive_id);
CREATE INDEX idx_bookings_qr_token ON interview_bookings(qr_pass_token);

-- ==============================================================================
-- INITIAL SEED DATA FOR DEMO & TESTING
-- ==============================================================================

-- Seed Users (Passwords are hashed or plain for demo: 'password123')
INSERT INTO users (id, full_name, email, password_hash, role, skills, resume_link, company_name, phone)
VALUES 
(1, 'Alex Rivera', 'alex.candidate@nexus.dev', 'password123', 'candidate', 'React, TypeScript, Node.js, PostgreSQL, TailwindCSS', 'https://github.com/alexrivera-portfolio', NULL, '+1 555-0192'),
(2, 'Sarah Chen', 'sarah.recruiter@cyberai.io', 'password123', 'recruiter', 'Technical Hiring, System Design, AI Staffing', NULL, 'CyberAI Labs', '+1 555-0348'),
(3, 'Marcus Vance', 'marcus.recruiter@cloudpulse.tech', 'password123', 'recruiter', 'Engineering Leadership, Cloud Infra', NULL, 'CloudPulse Technologies', '+1 555-0812'),
(4, 'Priya Sharma', 'priya.dev@nexus.dev', 'password123', 'candidate', 'Python, PyTorch, FastAPI, Docker, Next.js', 'https://linkedin.com/in/priya-sharma-ai', NULL, '+91 98765 43210');

-- Reset users sequence
ALTER SEQUENCE users_id_seq RESTART WITH 10;

-- Seed Job Drives
INSERT INTO job_drives (id, recruiter_id, company_name, company_logo, drive_title, role_category, drive_date, drive_time, drive_mode, venue_or_link, description, salary_range, open_positions, requirements, tags, available_slots, status)
VALUES
(1, 2, 'CyberAI Labs', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', 'Senior Full-Stack & Generative AI Drive', 'AI / ML', CURRENT_DATE + INTERVAL '2 day', '10:00 AM - 04:30 PM', 'Hybrid', 'Silicon Hall Tech Park / Google Meet Room 4', 'Join our core platform engineering team building low-latency LLM agent pipelines and modern reactive interfaces. Immediate offer rollouts on fair day.', '$130,000 - $175,000 / yr', 8, '3+ years with TypeScript, React, Node.js or Python. Experience with vector databases and distributed systems is a plus.', 'React, Node.js, Python, Vector DB, LLM', '["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]'::jsonb, 'Active'),

(2, 3, 'CloudPulse Tech', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', 'Cloud DevOps & Distributed Systems Sprint', 'Cloud & DevOps', CURRENT_DATE + INTERVAL '4 day', '09:30 AM - 03:00 PM', 'Online', 'Zoom Nexus Stream - Room A', 'High-volume hiring drive for Platform Reliability Engineers and Kubernetes Infrastructure architects supporting enterprise multitenant SaaS.', '$120,000 - $160,000 / yr', 12, 'Experience with Kubernetes, Terraform, AWS/GCP, Docker container security, CI/CD automated deployment architectures.', 'Kubernetes, AWS, Terraform, Docker, Go', '["09:30 AM", "10:30 AM", "11:30 AM", "01:30 PM", "02:30 PM"]'::jsonb, 'Active'),

(3, 2, 'FinEdge Quantum', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', 'Fintech Frontend & Web3 Engineering Summit', 'Frontend', CURRENT_DATE + INTERVAL '5 day', '11:00 AM - 05:00 PM', 'In-Person', 'Nexus Convention Center, Booth 14B', 'Exclusive spot offers for exceptional UI/UX React and WebGL developers building ultra-responsive real-time market trading dashboards.', '$110,000 - $150,000 / yr', 6, 'Strong portfolio demonstrating high performance React/Next.js applications, state management, WebSocket streaming, and Tailwind CSS.', 'React, TypeScript, WebSocket, Tailwind, Next.js', '["11:00 AM", "11:45 AM", "02:00 PM", "03:30 PM", "04:15 PM"]'::jsonb, 'Active'),

(4, 3, 'Apex BioCompute', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', 'Data Engineering & Analytics Fast-Track', 'Data & Analytics', CURRENT_DATE + INTERVAL '7 day', '10:00 AM - 04:00 PM', 'Online', 'Nexus Virtual Stage 2', 'Seeking Data Engineers to build reliable ETL pipelines, Kafka event backbones, and Snowflake analytical data warehouses.', '$115,000 - $155,000 / yr', 5, 'Proficiency with PostgreSQL/SQL, Apache Spark, Python data processing, and cloud warehouses.', 'PostgreSQL, Python, Spark, Kafka, SQL', '["10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM"]'::jsonb, 'Active');

ALTER SEQUENCE job_drives_id_seq RESTART WITH 15;

-- Seed Bookings
INSERT INTO interview_bookings (id, drive_id, candidate_id, recruiter_id, interview_date, slot_time, candidate_name, candidate_email, resume_link, skills, qr_pass_token, status)
VALUES
(1, 1, 1, 2, CURRENT_DATE + INTERVAL '2 day', '10:00 AM', 'Alex Rivera', 'alex.candidate@nexus.dev', 'https://github.com/alexrivera-portfolio', 'React, TypeScript, Node.js, PostgreSQL', 'NEXUS-PASS-1-1000-ARIV', 'Confirmed'),
(2, 2, 4, 3, CURRENT_DATE + INTERVAL '4 day', '09:30 AM', 'Priya Sharma', 'priya.dev@nexus.dev', 'https://linkedin.com/in/priya-sharma-ai', 'Python, Docker, Next.js, FastAPI', 'NEXUS-PASS-2-0930-PSHA', 'Confirmed');

ALTER SEQUENCE interview_bookings_id_seq RESTART WITH 10;
