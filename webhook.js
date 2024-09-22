import express from 'express';
import { exec } from 'child_process';

const app = express();
app.use(express.json());

app.post('/webhook', (req) => {
  console.log('Received webhook:', req.body);
  exec(
    'git pull && docker-compose down && docker-compose up -d',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error output: ${stderr}`);
        return;
      }
      console.log(`Command output: ${stdout}`);
    },
  );

  return 'Hook has completed its work';
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
