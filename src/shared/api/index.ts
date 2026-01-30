export { supabase } from './supabase';
export { getDeviceId, getCurrentUser, getCachedUser, clearUserCache } from './auth';
export { getAllTemplates, getTemplatesByCategory, getTemplateById } from './routineTemplates';
export {
  createUserRoutine,
  getActiveRoutines,
  getAllUserRoutines,
  getUserRoutineById,
  updateUserRoutineStatus,
} from './userRoutines';
export {
  createCheckIn,
  getCheckInsByRoutine,
  isTodayCheckedIn,
  getTotalCheckInCount,
} from './checkIns';
export {
  applyReward,
  getRewardByRoutine,
  getUnlockedRewardCount,
} from './rewards';
export type {
  CreateUserRoutineParams,
  CreateCheckInParams,
  ApplyRewardParams,
} from './types';
