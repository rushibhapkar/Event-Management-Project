const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on this port ${PORT}`);
  console.log(`server URL: http://localhost:${PORT}`);
});