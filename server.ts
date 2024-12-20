import dotenv from 'dotenv';
import { startScheduler } from './utils/scheduler';

// Load environment variables
dotenv.config();

// Start the scheduler
startScheduler();

// Keep the process running
process.stdin.resume();
