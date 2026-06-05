require('dotenv').config()
const { app } = require('./src/app');
const { env } = require('./src/config/env');

const PORT = env.port || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});