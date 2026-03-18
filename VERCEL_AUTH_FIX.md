# วิธีปิด Vercel Authentication

## ขั้นตอน

1. ไปที่ https://vercel.com/dashboard

2. เลือก Project: **"merge-pdf-api-git-main"** (หรือชื่อ project ที่มี)

3. คลิก **Settings** (ไอคอน ⚙️ มุมขวาบน)

4. เลื่อนลงไปหา **"Deployment Protection"**

5. ปิด (uncheck) ตัวเลือก:
   - ❌ **"Vercel Authentication"** 
   - หรือ **"Protect Production Deployments"**

6. กด **Save Changes** (ถ้ามี)

---

## หลังจากปิด Authentication แล้ว

รอสักครู่ให้ deploy ใหม่ แล้วลองเรียก API ใหม่:

```bash
curl -X POST "https://merge-pdf-api-git-main-batchanthimatorns-projects.vercel.app/api/merge" \
  -H "Content-Type: application/json" \
  -d '{"urls": "url1.pdf,url2.jpg"}' \
  -o merged.pdf