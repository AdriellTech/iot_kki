# iot_kki — HydroSky Defender

Monorepo PKM **HydroSky Defender**: alat pengusir hama burung berbasis semprotan air untuk tanaman kedelai (lahan uji 5×5 m).

## Isi repo

| Path | Deskripsi |
|------|-----------|
| [`web/`](web/) | Frontend monitoring (PWA, Clay UI, 3D) — **fokus pengembangan web** |
| [`docs/api-contract.md`](docs/api-contract.md) | Kontrak HTTP antara web dan firmware ESP32 |

Firmware & hardware dikembangkan terpisah oleh tim embedded; web siap integrasi lewat kontrak API.

## Mulai cepat (web)

```bash
cd web
npm install
npm run dev
```

Buka `http://localhost:5173` — data dan event disimulasikan via MSW.

## Handoff ke tim ESP

1. Build: `cd web && npm run build`
2. Serahkan folder `web/dist/` + `docs/api-contract.md`
3. Host `dist` di HTTP server ESP; implement endpoint `/api/*` dan `/stream`
