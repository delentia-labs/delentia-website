# Launch Validation Matrix

ใช้ไฟล์นี้เป็น executable gate ก่อน soft launch หรือก่อน merge งานที่แตะ claim, metadata, benchmark wording, และหน้า public หลัก

## 1. เปิด production-like server

จากโฟลเดอร์ `rctlabs-website`

```bash
npm run build
npm run start -- -p 3005
```

ใช้ URL หลักสำหรับการตรวจ: `http://localhost:3005`

## 2. รัน validation matrix

เปิดอีก terminal แล้วรันตามลำดับนี้:

```bash
npm run audit:claims
npm run audit:claims:corpus
npm run smoke:pages
npm run verify:public
npm run lint
```

ความหมายของแต่ละคำสั่ง:

- `audit:claims` ตรวจ reviewed cohort ที่ถือเป็น guarded lane แล้ว ต้องผ่านแบบ hard fail
- `audit:claims:corpus` ตรวจทั้ง blog corpus เพื่อบอกว่ามีไฟล์ไหนยังขาด metadata หรือ framing อยู่
- `smoke:pages` ตรวจเส้นทางหลักที่พอร์ต 3005
- `verify:public` ตรวจ route health + stale token scan แบบ Windows-friendly
- `lint` เป็น code health gate ของรอบ launch candidate

## 3. เกณฑ์ตัดสิน

ปล่อยรอบ soft launch ได้เมื่อ:

- `build` ผ่าน
- `audit:claims` ผ่าน
- `smoke:pages` ผ่าน
- `verify:public` ผ่าน
- `lint` ไม่มี error blocker ใหม่จากงานรอบนั้น
- Manual QA ผ่านตาม `docs/MANUAL_QA_PLAYBOOK_TH.md`

## 4. วิธีอ่านผล `audit:claims:corpus`

ผลที่เจอแบ่งเป็น 2 ประเภท:

- error: stale public SDK token หรือ reviewed file ยังผิด lane อยู่
- warning: corpus file ยังขาด metadata หรือ framing ซึ่งควรจัดคิวแก้ต่อ

แนะนำให้แก้ตามลำดับนี้:

1. stale public-SDK baseline
2. benchmark / enterprise overclaim
3. metadata coverage ของไฟล์ที่เหลือ
