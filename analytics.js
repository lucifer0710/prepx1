import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject({
  mode: 'auto', // Automatically uses production mode when deployed, development mode locally
  debug: false  // Set to true to see analytics events in the console during development
});
