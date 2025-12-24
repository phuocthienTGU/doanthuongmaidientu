#!/usr/bin/env node
// Simple smoke test for backend endpoints
const API = "http://127.0.0.1:5000";

async function run() {
  try {
    // small delay to allow server to finish starting
    await new Promise((r) => setTimeout(r, 1200));
    console.log("GET /");
    const r0 = await fetch(API + "/");
    console.log("/", r0.status);
    const t0 = await r0.text();
    console.log("body length", t0.length);

    console.log("GET /api/images");
    const r1 = await fetch(API + "/api/images");
    console.log("/api/images", r1.status);
    const j1 = await r1.json().catch((e) => null);
    console.log("images:", Array.isArray(j1) ? j1.length + " files" : j1);

    console.log("POST /api/upload (small test image)");
    // tiny 1x1 JPEG
    const imgBase64 =
      "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAIBAQEBAQIBAQECAgICAgQDAgIDBAMEBQQEBQYGBQYGBwYGBwYICQsJCAgKCAgKCAgMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAALCAAQABABAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGf/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPwC//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwC//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwC//9k=";
    const bytes = Uint8Array.from(atob(imgBase64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: "image/jpeg" });
    const fd = new FormData();
    fd.append("hinhanh", blob, "smoke.jpg");

    const r2 = await fetch(API + "/api/upload", { method: "POST", body: fd });
    console.log("/api/upload", r2.status);
    const j2 = await r2.json().catch((e) => null);
    console.log("upload response:", j2);

    console.log("Smoke test done");
  } catch (err) {
    console.error("Error:", err);
    process.exitCode = 1;
  }
}

run();
