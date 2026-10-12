import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase, db } from './server/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize DB (PostgreSQL if DATABASE_URL is set, else in-memory PG compatibility)
initDatabase().catch(err => {
  console.error('Database initialization warning:', err);
});

// ============================================================================
// REST API ROUTES
// ============================================================================

// 1. AUTH API: /api/auth/login & /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { full_name, email, password, role, skills, resume_link, company_name, phone } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ error: 'Full name, email, password, and role are required.' });
    }

    if (!['candidate', 'recruiter'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either candidate or recruiter.' });
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const newUser = await db.createUser({
      full_name,
      email,
      password_hash: password, // In production, bcrypt.hash(password, 10)
      role,
      skills,
      resume_link,
      company_name: role === 'recruiter' ? company_name || 'Hiring Partner' : undefined,
      phone
    });

    const { password_hash: _, ...safeUser } = newUser;
    return res.status(201).json({
      message: 'Account registered successfully',
      user: safeUser,
      token: `nexus-jwt-${safeUser.id}-${Date.now()}`
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(403).json({ error: `Account exists but role is registered as '${user.role}', not '${role}'.` });
    }

    // Verify password
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const { password_hash: _, ...safeUser } = user;
    return res.json({
      message: 'Logged in successfully',
      user: safeUser,
      token: `nexus-jwt-${safeUser.id}-${Date.now()}`
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const userId = req.headers['x-user-id'] ? parseInt(req.headers['x-user-id'] as string, 10) : 1;
  const user = await db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { password_hash: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

// 2. JOB DRIVES API: /api/drives
app.get('/api/drives', async (req, res) => {
  try {
    const { search, category, mode } = req.query;
    const drives = await db.getDrives(
      typeof search === 'string' ? search : undefined,
      typeof category === 'string' ? category : undefined,
      typeof mode === 'string' ? mode : undefined
    );
    return res.json({ drives });
  } catch (error) {
    console.error('Fetch drives error:', error);
    return res.status(500).json({ error: 'Failed to retrieve job drives.' });
  }
});

app.get('/api/drives/:id', async (req, res) => {
  try {
    const driveId = parseInt(req.params.id, 10);
    const drive = await db.getDriveById(driveId);
    if (!drive) {
      return res.status(404).json({ error: 'Job drive not found.' });
    }

    // Also get existing bookings for this drive to know which slots are taken
    const existingBookings = await db.getBookings(undefined, undefined);
    const takenSlots = existingBookings
      .filter(b => b.drive_id === driveId && b.status !== 'Cancelled')
      .map(b => b.slot_time);

    return res.json({ drive, takenSlots });
  } catch (error) {
    console.error('Fetch drive detail error:', error);
    return res.status(500).json({ error: 'Failed to retrieve job drive detail.' });
  }
});

app.post('/api/drives', async (req, res) => {
  try {
    const {
      recruiter_id,
      company_name,
      company_logo,
      drive_title,
      role_category,
      drive_date,
      drive_time,
      drive_mode,
      venue_or_link,
      description,
      salary_range,
      open_positions,
      requirements,
      tags,
      available_slots
    } = req.body;

    if (!company_name || !drive_title || !role_category || !drive_date) {
      return res.status(400).json({ error: 'Company name, drive title, category, and date are required.' });
    }

    const newDrive = await db.createDrive({
      recruiter_id: Number(recruiter_id) || 2,
      company_name,
      company_logo,
      drive_title,
      role_category,
      drive_date,
      drive_time,
      drive_mode,
      venue_or_link,
      description,
      salary_range,
      open_positions: Number(open_positions) || 5,
      requirements,
      tags,
      available_slots
    });

    return res.status(201).json({ message: 'Drive created successfully', drive: newDrive });
  } catch (error) {
    console.error('Create drive error:', error);
    return res.status(500).json({ error: 'Failed to create job drive.' });
  }
});

// 3. BOOKINGS API: /api/bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const candidateId = req.query.candidate_id ? parseInt(req.query.candidate_id as string, 10) : undefined;
    const recruiterId = req.query.recruiter_id ? parseInt(req.query.recruiter_id as string, 10) : undefined;

    const bookings = await db.getBookings(candidateId, recruiterId);
    return res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      drive_id,
      candidate_id,
      slot_time,
      interview_date,
      candidate_name,
      candidate_email,
      resume_link,
      skills
    } = req.body;

    if (!drive_id || !candidate_id || !slot_time) {
      return res.status(400).json({ error: 'Drive ID, candidate ID, and slot time are required.' });
    }

    // Check if slot is already booked
    const existing = await db.getBookings(undefined, undefined);
    const slotConflict = existing.find(
      b => b.drive_id === Number(drive_id) && b.slot_time === slot_time && b.status !== 'Cancelled'
    );

    if (slotConflict) {
      return res.status(409).json({ error: 'This interview slot was just booked by another candidate. Please choose another time.' });
    }

    // Check if candidate already has a slot for this drive
    const candidateAlreadyBooked = existing.find(
      b => b.drive_id === Number(drive_id) && b.candidate_id === Number(candidate_id) && b.status !== 'Cancelled'
    );
    if (candidateAlreadyBooked) {
      return res.status(409).json({ error: 'You already have an active interview slot booked for this hiring drive.' });
    }

    const booking = await db.createBooking({
      drive_id: Number(drive_id),
      candidate_id: Number(candidate_id),
      slot_time,
      interview_date,
      candidate_name,
      candidate_email,
      resume_link,
      skills
    });

    return res.status(201).json({
      message: 'Interview slot successfully reserved! Digital QR Pass generated.',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ error: 'Failed to book interview slot.' });
  }
});

app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id, 10);
    const { status, feedback } = req.body;

    if (!['Confirmed', 'Shortlisted', 'Passed', 'Rejected', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status.' });
    }

    const updated = await db.updateBookingStatus(bookingId, status, feedback);
    if (!updated) {
      return res.status(404).json({ error: 'Booking record not found.' });
    }

    return res.json({ message: 'Applicant status updated successfully', booking: updated });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ error: 'Failed to update interview booking status.' });
  }
});

// 4. STATS & SYSTEM METRICS
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    return res.json({
      stats,
      isPostgresActive: db.isPostgres(),
      systemTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch platform metrics.' });
  }
});

// ============================================================================
// VITE INTEGRATION FOR HYBRID SPA + API
// ============================================================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [NexusHire Hub] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
