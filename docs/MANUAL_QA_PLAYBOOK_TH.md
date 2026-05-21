# Manual QA Playbook (TH)

เอกสารนี้ใช้ตรวจรอบสุดท้ายก่อน soft launch โดยเน้น 2 เรื่องพร้อมกัน:
- เว็บไซต์ต้องใช้งานได้จริง
- claim บนหน้า public ต้องไม่ปนกันระหว่าง public proof, enterprise snapshot, และ benchmark scope

## 1. Build และ Smoke ก่อนเปิดเบราว์เซอร์

รันจากโฟลเดอร์ `rctlabs-website`

```bash
npm run build
npm run smoke:pages
```

เกณฑ์ผ่าน:
- build ผ่านโดยไม่มี TypeScript error
- smoke ผ่านทุกหน้าหลัก

## 2. เปิดหน้า public ที่สำคัญที่สุด

ตรวจอย่างน้อย 4 หน้า:
- `/en/about`
- `/en/algorithms`
- `/en/benchmark-summary`
- `/en/methodology`

สิ่งที่ต้องเช็ก:
- หน้า About ต้องมีข้อความที่แยก `Public SDK verified` ออกจาก `Enterprise private snapshot`
- หน้า Algorithms ต้องไม่ใช้ถ้อยคำที่ทำให้เข้าใจว่า test count ฝั่ง enterprise คือ public repo proof
- หน้า Benchmark Summary ต้องอธิบาย caveat และ scope ของตัวเลข
- หน้า Methodology ต้องอธิบาย governance ของ claims และ benchmark references

## 3. ตรวจตัวเลข canonical

แหล่ง truth ปัจจุบัน:
- public SDK proof มาจาก `rct-platform/docs/testing/TESTING_CANONICAL.md`
- shared website constants อยู่ที่ `lib/site-config.ts`

สิ่งที่ต้องตรงกัน:
- Public SDK tests = 1287
- Public SDK coverage = 92%
- Public SDK version = 1.0.4b0
- Enterprise private snapshot = 4,849 tests / 62 runtime components

ถ้าตัวเลขไม่ตรง:
- หยุด deploy
- sync ค่าที่ `lib/site-config.ts`
- build ใหม่และ smoke ใหม่

## 4. ตรวจ benchmark wording

ตัวเลข benchmark เช่น hallucination rate ต้องมีคำอธิบาย scope

ถ้อยคำที่ควรเห็น:
- `controlled workload`
- `benchmark summary`
- `research / benchmark scope`

ถ้าเจอถ้อยคำที่แรงเกินจริง เช่น:
- `guaranteed in production`
- `universally validated`
- `proven across all enterprise deployments`

ให้ถือเป็น blocker ทันที

## 5. ตรวจ OG / social share

เช็กอย่างน้อยหน้า:
- `/about`

สิ่งที่ต้องเช็ก:
- OG image ต้องไม่ใช้ enterprise scale เป็น public proof แบบล้วน
- ควรเห็น framing ประมาณ `Public SDK + Enterprise Snapshot`

## 6. ตรวจ admin / internal surfaces

ถ้าเปิดหน้า `/admin` ใน preview mode:
- ต้องมีข้อความว่าเป็น mock dashboard data
- ต้องไม่ดูเหมือน production truth ที่ยืนยันสาธารณะแล้ว

ถ้า route นี้ถูก index ได้หรือแชร์ง่ายโดยไม่มี context ให้ถือเป็น blocker

## 7. Mobile quick pass

ตรวจอย่างน้อย:
- iPhone SE width
- iPhone 15 width
- desktop 1440px

สิ่งที่ต้องเช็ก:
- hero copy ไม่ล้น
- stat cards ไม่ตัดข้อความ `Public SDK verified` และ `Enterprise private snapshot`
- CTA ยังมองเห็นและกดได้

## 8. Release decision

ปล่อย soft launch ได้เมื่อ:
- build ผ่าน
- smoke ผ่าน
- public claim boundary ผ่านครบ
- canonical numbers ตรง
- benchmark wording มี caveat ครบ
- ไม่มี mock/internal data ที่ทำให้คนเข้าใจผิด

ยังไม่ควร launch ถ้า:
- หน้า high-visibility ยัง blend public proof กับ enterprise snapshot
- metadata / OG ยัง overclaim
- ตัวเลข public SDK ไม่ sync กับ canonical source