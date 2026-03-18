# วิธีลบ Project ใน Vercel

## ขั้นตอนการลบ

1. ไปที่ https://vercel.com/dashboard

2. คลิกเลือก Project ที่ต้องการลบ (เช่น **"my-pjmp"**)

3. คลิกที่ **Settings** (ไอคอน ⚙️ มุมขวาบน)

4. เลื่อนลงไปด้านล่างสุด จะเห็น **"Danger Zone"** สีแดง

5. กดปุ่ม **"Delete Project"**

6. จะมี dialog ให้ยืนยัน พิมพ์ชื่อ project ลงไป
   - พิมพ์: `my-pjmp`

7. กด **"Delete Project"** สีแดงเพื่อยืนยัน

---

## หมายเหตุ
- การลบ project จะลบ deployments ทั้งหมดด้วย
- ถ้าเชื่อมต่อกับ GitHub repository อยู่ repository จะไม่ถูกลบ (ลบเฉพาะบน Vercel)