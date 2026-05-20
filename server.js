const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Render inyecta DATABASE_URL automáticamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ── DISTRIBUIDORA ─────────────────────────────────────
app.get('/api/distribuidora', async (req, res) => {
  const r = await pool.query('SELECT * FROM distribuidora');
  res.json(r.rows);
});
app.post('/api/distribuidora', async (req, res) => {
  const { nombre, rfc, dir_calle_ciudad, dir_cp, telefono, correo } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO distribuidora (nombre, rfc, dir_calle_ciudad, dir_cp, telefono, correo) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [nombre, rfc, dir_calle_ciudad, dir_cp, telefono, correo]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/distribuidora/:id', async (req, res) => {
  await pool.query('DELETE FROM distribuidora WHERE id_distribuidora=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── CLIENTE ───────────────────────────────────────────
app.get('/api/cliente', async (req, res) => {
  const r = await pool.query('SELECT * FROM cliente');
  res.json(r.rows);
});
app.post('/api/cliente', async (req, res) => {
  const { nombre, dir_calle_ciudad, dir_cp, correo, tipo_cliente, tipo_atencion } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO cliente (nombre, dir_calle_ciudad, dir_cp, correo, tipo_cliente, tipo_atencion) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [nombre, dir_calle_ciudad, dir_cp, correo, tipo_cliente, tipo_atencion]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/cliente/:id', async (req, res) => {
  await pool.query('DELETE FROM cliente WHERE id_cliente=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── CLIENTE CON FACTURA ───────────────────────────────
app.get('/api/clientefactura', async (req, res) => {
  const r = await pool.query('SELECT * FROM cliente_factura');
  res.json(r.rows);
});
app.post('/api/clientefactura', async (req, res) => {
  const { id_cliente, rfc } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO cliente_factura (id_cliente, rfc) VALUES ($1,$2) RETURNING *',
      [id_cliente, rfc]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/clientefactura/:id', async (req, res) => {
  await pool.query('DELETE FROM cliente_factura WHERE id_cliente=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── CLIENTE SIN FACTURA ───────────────────────────────
app.get('/api/clientesinfactura', async (req, res) => {
  const r = await pool.query('SELECT * FROM cliente_sin_factura');
  res.json(r.rows);
});
app.post('/api/clientesinfactura', async (req, res) => {
  const { id_cliente } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO cliente_sin_factura (id_cliente) VALUES ($1) RETURNING *',
      [id_cliente]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/clientesinfactura/:id', async (req, res) => {
  await pool.query('DELETE FROM cliente_sin_factura WHERE id_cliente=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── PROVEEDOR ─────────────────────────────────────────
app.get('/api/proveedor', async (req, res) => {
  const r = await pool.query('SELECT * FROM proveedor');
  res.json(r.rows);
});
app.post('/api/proveedor', async (req, res) => {
  const { nombre, rfc, contacto } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO proveedor (nombre, rfc, contacto) VALUES ($1,$2,$3) RETURNING *',
      [nombre, rfc, contacto]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/proveedor/:id', async (req, res) => {
  await pool.query('DELETE FROM proveedor WHERE id_proveedor=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── PRODUCTO ──────────────────────────────────────────
app.get('/api/producto', async (req, res) => {
  const r = await pool.query('SELECT * FROM producto');
  res.json(r.rows);
});
app.post('/api/producto', async (req, res) => {
  const { nombre, codigo_barras, precio_venta, stock } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO producto (nombre, codigo_barras, precio_venta, stock) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, codigo_barras, precio_venta, stock]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/producto/:id', async (req, res) => {
  await pool.query('DELETE FROM producto WHERE id_producto=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── TRABAJADOR ────────────────────────────────────────
app.get('/api/trabajador', async (req, res) => {
  const r = await pool.query('SELECT * FROM trabajador');
  res.json(r.rows);
});
app.post('/api/trabajador', async (req, res) => {
  const { nombre, curp, sueldo, id_distribuidora } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO trabajador (nombre, curp, sueldo, id_distribuidora) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, curp, sueldo, id_distribuidora]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/trabajador/:id', async (req, res) => {
  await pool.query('DELETE FROM trabajador WHERE id_trabajador=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── TRABAJADOR INTERNO ────────────────────────────────
app.get('/api/trabajadorinterno', async (req, res) => {
  const r = await pool.query('SELECT * FROM trabajador_interno');
  res.json(r.rows);
});
app.post('/api/trabajadorinterno', async (req, res) => {
  const { id_trabajador, turno } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO trabajador_interno (id_trabajador, turno) VALUES ($1,$2) RETURNING *',
      [id_trabajador, turno]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/trabajadorinterno/:id', async (req, res) => {
  await pool.query('DELETE FROM trabajador_interno WHERE id_trabajador=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── REPARTIDOR ────────────────────────────────────────
app.get('/api/repartidor', async (req, res) => {
  const r = await pool.query('SELECT * FROM repartidor');
  res.json(r.rows);
});
app.post('/api/repartidor', async (req, res) => {
  const { id_trabajador } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO repartidor (id_trabajador) VALUES ($1) RETURNING *',
      [id_trabajador]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/repartidor/:id', async (req, res) => {
  await pool.query('DELETE FROM repartidor WHERE id_trabajador=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── COMPRA ────────────────────────────────────────────
app.get('/api/compra', async (req, res) => {
  const r = await pool.query('SELECT * FROM compra');
  res.json(r.rows);
});
app.post('/api/compra', async (req, res) => {
  const { id_cliente, fecha, total } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO compra (id_cliente, fecha, total) VALUES ($1,$2,$3) RETURNING *',
      [id_cliente, fecha, total]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/compra/:id', async (req, res) => {
  await pool.query('DELETE FROM compra WHERE id_compra=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── DETALLE COMPRA ────────────────────────────────────
app.get('/api/detalle', async (req, res) => {
  const r = await pool.query('SELECT * FROM detalle_compra');
  res.json(r.rows);
});
app.post('/api/detalle', async (req, res) => {
  const { id_compra, id_producto, cantidad, precio_unitario } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_unitario, subtotal) VALUES ($1,$2,$3,$4,$3*$4) RETURNING *',
      [id_compra, id_producto, cantidad, precio_unitario]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/detalle/:compra/:producto', async (req, res) => {
  await pool.query(
    'DELETE FROM detalle_compra WHERE id_compra=$1 AND id_producto=$2',
    [req.params.compra, req.params.producto]
  );
  res.json({ ok: true });
});

// ── SUMINISTRO ────────────────────────────────────────
app.get('/api/suministro', async (req, res) => {
  const r = await pool.query('SELECT * FROM suministro');
  res.json(r.rows);
});
app.post('/api/suministro', async (req, res) => {
  const { id_distribuidora, id_proveedor, id_producto, fecha_suministro, cantidad_recibida, precio_adquisicion } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO suministro (id_distribuidora, id_proveedor, id_producto, fecha_suministro, cantidad_recibida, precio_adquisicion) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id_distribuidora, id_proveedor, id_producto, fecha_suministro, cantidad_recibida, precio_adquisicion]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/suministro/:dis/:prov/:prod/:fecha', async (req, res) => {
  await pool.query(
    'DELETE FROM suministro WHERE id_distribuidora=$1 AND id_proveedor=$2 AND id_producto=$3 AND fecha_suministro=$4',
    [req.params.dis, req.params.prov, req.params.prod, req.params.fecha]
  );
  res.json({ ok: true });
});

// ── TEL CLIENTE ───────────────────────────────────────
app.get('/api/telcliente', async (req, res) => {
  const r = await pool.query('SELECT * FROM tel_cliente');
  res.json(r.rows);
});
app.post('/api/telcliente', async (req, res) => {
  const { id_cliente, telefono } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO tel_cliente (id_cliente, telefono) VALUES ($1,$2) RETURNING *',
      [id_cliente, telefono]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/telcliente/:id', async (req, res) => {
  await pool.query('DELETE FROM tel_cliente WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── TEL TRABAJADOR ────────────────────────────────────
app.get('/api/teltrabajador', async (req, res) => {
  const r = await pool.query('SELECT * FROM tel_trabajador');
  res.json(r.rows);
});
app.post('/api/teltrabajador', async (req, res) => {
  const { id_trabajador, telefono } = req.body;
  try {
    const r = await pool.query(
      'INSERT INTO tel_trabajador (id_trabajador, telefono) VALUES ($1,$2) RETURNING *',
      [id_trabajador, telefono]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/teltrabajador/:id', async (req, res) => {
  await pool.query('DELETE FROM tel_trabajador WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── START ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Kafra API en puerto ${PORT}`));
