// import { verifyDbConnection } from './db/mongodb';

// /**
//  * Checks MongoDB connectivity at application startup
//  * Returns connection status without stopping application on failure
//  */
// export async function checkDatabaseConnection() {
//   try {
//     console.log('Checking MongoDB connection...');
//     const isDbConnected = await verifyDbConnection();
    
//     if (isDbConnected) {
//       console.log('✅ MongoDB connection successful');
//     } else {
//       console.error('⚠️ MongoDB connection failed - application may have limited functionality');
//     }
    
//     return isDbConnected;
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error);
//     return false;
//   }
// }

// /**
//  * Initialize all application services
//  * Runs checks without preventing application startup
//  */
// export async function initializeServices() {
//   // Check database connection
//   const dbConnected = await checkDatabaseConnection();
  
//   // Initialize other services here if needed
  
//   return {
//     dbConnected,
//     // Add other service statuses here
//   };
// }