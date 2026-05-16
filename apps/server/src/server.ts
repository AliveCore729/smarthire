import app from './app.js';

import { env } from './config/env.js';
import { connectDatabase } from './lib/database.js';

const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();