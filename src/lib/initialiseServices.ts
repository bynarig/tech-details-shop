import { setupAdminUsers } from './admin/setupAdmins';

export async function initializeApp() {
  // Add any other initialization tasks here
  await setupAdminUsers();
}