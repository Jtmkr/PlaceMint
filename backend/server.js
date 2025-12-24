const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internTrack')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

// Schema with userId for Multi-User Support
const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'To Apply' }, 
  notes: String,
  deadline: Date,
  userId: { type: String, required: true }, // Links job to a specific Clerk user
  date: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', JobSchema);

// GET: Fetch ONLY the jobs for the logged-in user
app.get('/jobs', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "User ID missing" });
  const jobs = await Job.find({ userId }).sort({ date: -1 });
  res.json(jobs);
});

// POST: Save job with the user's ID
app.post('/jobs', async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PATCH & DELETE
app.patch('/jobs/:id', async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedJob);
});

app.delete('/jobs/:id', async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));