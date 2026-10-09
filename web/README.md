# HydroSky Defender — Web Monitoring

PWA monitoring dengan Clay UI, visualisasi 3D lahan 5×5 m, panel video ESP32-CAM, dan kontrol semprot (mock API untuk development).

## Persyaratan

- Node.js 20+
- npm

## Perintah

```bash
npm install
npm run dev      # http://localhost:5173 + MSW mock
npm run build    # output ke dist/
npm run preview  # preview production build
```

## Environment

Salin `.env.example` ke `.env`:

| Variabel | Default | Keterangan |
|----------|---------|------------|
| `VITE_USE_MSW` | `true` di dev | Mock API MSW |
| `VITE_API_BASE` | kosong | Base URL (kosong = relative, untuk ESP) |
| `VITE_STREAM_URL` | `/stream` | URL MJPEG kamera |

## Struktur

- `src/components/clay/` — komponen Clay UI
- `src/components/dashboard/` — KPI, log, kontrol
- `src/components/field/` — scene React Three Fiber
- `src/mocks/` — MSW handlers & simulasi deteksi
- `src/config/field.ts` — layout lahan & zona sprinkler

Kontrak API untuk tim firmware: [`../docs/api-contract.md`](../docs/api-contract.md).

## Deploy ke ESP32

1. `npm run build`
2. Upload isi `dist/` ke LittleFS (tim firmware)
3. Akses via IP WiFi ESP; install sebagai PWA dari browser
