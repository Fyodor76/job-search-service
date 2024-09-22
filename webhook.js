/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const { exec } = require('child_process');
/* eslint-enable @typescript-eslint/no-var-requires */

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('Received webhook:', req.body);
  exec(
    'git pull && docker-compose down && docker-compose up -d',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send('Internal Server Error');
      }

      // Обработка стандартного вывода
      if (stdout) {
        console.log(`Command output: ${stdout}`);
      }

      // Обработка стандартного вывода ошибок (если он есть)
      if (stderr) {
        console.error(`Error output: ${stderr}`);
      }

      return res.send('Hook has completed its work');
    },
  );
});

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
