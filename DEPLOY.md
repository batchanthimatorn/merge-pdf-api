# Deploy to Vercel

## วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)

### 1. สร้าง GitHub Repository
1. ไปที่ https://github.com/new
2. ตั้งชื่อ เช่น `merge-pdf-api`
3. กด "Create repository"

### 2. Push โค้ดขึ้น GitHub
```bash
# เปิด Terminal ในโฟลเดอร์โปรเจค
git init
git add .
git commit -m "Initial commit"

# เพิ่ม remote (แก้ชื่อ repo ตามที่สร้าง)
git remote add origin https://github.com/<your-username>/merge-pdf-api.git
git branch -M main
git push -u origin main
```

### 3. Deploy บน Vercel
1. ไปที่ https://vercel.com/new
2. กด "Add New..." > "Project"
3. เลือก GitHub repository ที่สร้าง
4. กด "Deploy"

---

## วิธีที่ 2: Deploy ผ่าน Vercel CLI

### 1. ติดตั้ง Vercel CLI
```bash
npm i -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. ตอบคำถาม
```
? Set up and deploy? [Y/n] Y
? Which scope? <your-username>
? Link to existing project? [y/N] N
? What's your project's name? merge-pdf-api
? In which directory is your code located? ./
```

---

## การใช้งาน API

**Local:**
```
POST http://localhost:3000/api/merge
```

**หลัง Deploy:**
```
POST https://<your-project>.vercel.app/api/merge
```

**Request:**
```json
{
  "urls": "url1.pdf,url2.jpg"
}
```

**curl ตัวอย่าง:**
```bash
curl -X POST https://your-project.vercel.app/api/merge \
  -H "Content-Type: application/json" \
  -d '{"urls": "https://example.com/file1.pdf,https://example.com/file2.jpg"}' \
  -o merged.pdf