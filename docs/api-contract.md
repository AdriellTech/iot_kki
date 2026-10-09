# Kontrak API — HydroSky Defender (Web ↔ ESP32)

Web monitoring memanggil endpoint berikut di **host yang sama** dengan halaman (mis. `http://192.168.4.1` saat terhubung ke WiFi ESP). Semua body JSON menggunakan `Content-Type: application/json`.

Versi kontrak: **1.0**

## GET `/api/health`

Cek konektivitas (dipakai banner offline di web).

**Response 200**

```json
{
  "uptimeSec": 3600,
  "wifiClients": 2,
  "heapFree": 120000
}
```

## GET `/api/status`

Status sistem untuk dashboard dan scene 3D.

**Response 200**

```json
{
  "version": "1.0.0",
  "mode": "auto",
  "connected": true,
  "pumpOn": false,
  "detectionsToday": 3,
  "lastDetection": {
    "at": "2026-10-09T08:00:00.000Z",
    "confidence": 0.87,
    "zoneId": "zone-center",
    "birdDetected": true
  },
  "sprinklers": [
    {
      "id": "zone-center",
      "label": "Sprinkler tengah",
      "x": 0,
      "z": 0,
      "active": false,
      "lastSprayAt": null
    }
  ],
  "sensors": {
    "motion": false,
    "cameraOnline": true
  }
}
```

- `mode`: `"auto"` | `"manual"`
- Posisi `x`, `z` dalam meter, origin di tengah lahan, selaras dengan [`web/src/config/field.ts`](../web/src/config/field.ts).
- ID zona default: `zone-center` (satu sprinkler di tengah lahan, jangkauan 5×5 m).

## GET `/api/events?limit=50`

Log event untuk panel stream data.

**Response 200**

```json
{
  "events": [
    {
      "id": "evt-1",
      "type": "detection",
      "at": "2026-10-09T08:00:00.000Z",
      "message": "Burung terdeteksi di lahan",
      "zoneId": "zone-center"
    }
  ]
}
```

`type`: `detection` | `spray` | `mode_change` | `system`

## POST `/api/mode`

**Body**

```json
{ "auto": true }
```

**Response 200**: objek yang sama dengan `/api/status`.

## POST `/api/spray`

Semprot manual/otomatis dari web atau trigger internal firmware.

**Body**

```json
{
  "zoneId": "zone-center",
  "durationSec": 4,
  "manual": true,
  "stop": false
}
```

| Field | Wajib | Keterangan |
|-------|--------|------------|
| `zoneId` | Tidak | Kosong / absent = sprinkler tengah (satu-satunya) |
| `durationSec` | Tidak | Default 3–4 detik |
| `manual` | Tidak | `true` jika dari UI |
| `stop` | Tidak | `true` hentikan semprotan & pompa |

**Response 200**: objek `/api/status`.

## GET `/stream` (atau `/mjpeg`)

Stream video ESP32-CAM. Web menggunakan tag `<img src="/stream">` (MJPEG multipart). Alias `/mjpeg` boleh disamakan.

Tidak di-cache oleh service worker PWA.

## Mapping hardware (referensi tim firmware)

| `zoneId` | Relay / sprinkler |
|----------|-------------------|
| `zone-center` | Sprinkler pusat (cakup seluruh lahan; juga untuk menyiram) |

Web **tidak** mengontrol GPIO langsung; hanya mengirim `zoneId` dan `durationSec`.

## Checklist integrasi

1. Host static files dari `web/dist/` (LittleFS) di root HTTP server ESP.
2. Implementasikan endpoint di atas dengan path identik.
3. Pastikan MJPEG `/stream` dapat diakses same-origin.
4. Uji dari HP: connect WiFi ESP → buka IP → install PWA.
5. Set `VITE_USE_MSW=false` saat build production jika perlu; default build memakai relative URL.

## Development web tanpa ESP

Jalankan `npm run dev` di folder `web/` dengan `VITE_USE_MSW=true` (default). MSW mensimulasikan semua endpoint di atas.
