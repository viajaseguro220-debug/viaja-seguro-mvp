const http = require('http');
const path = require('path');
const next = require('next');

const dev = true;
const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || 'localhost';
const dir = path.join(__dirname, '..');

async function main() {
  const app = next({ dev, dir, hostname, port });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = http.createServer((req, res) => handle(req, res));

  server.listen(port, hostname, () => {
    console.log(`> VIAJA SEGURO web lista en http://${hostname}:${port}`);
  });
}

main().catch((error) => {
  console.error('No se pudo iniciar el servidor web de Next.js en modo desarrollo.');
  console.error(error);
  process.exit(1);
});
