# ตักบาตรทั่วไทย

Landing page และปฏิทินงานตักบาตรทั่วไทย พ.ศ. 2569 ธีมขาว–แดง สร้างด้วย HTML, CSS และ JavaScript ธรรมดา ไม่มีฐานข้อมูลและไม่มีขั้นตอน build

เว็บไซต์ประกอบด้วย:

- ปฏิทิน Google Calendar สำหรับกำหนดการล่าสุด
- งานเด่นที่อ้างอิงจากบทความหลัก DMC.TV
- รายละเอียดและพัฒนาการของโครงการ
- บทความประชาสัมพันธ์เชิญชวน แยกจากบทความทบทวนบุญหลังจบงาน
- SEO metadata, Open Graph, structured data, `robots.txt` และ `sitemap.xml`

## แหล่งข้อมูลหลัก

[งานตักบาตร พ.ศ. 2569 — โครงการตักบาตรพระ 3 ล้านรูป 77 จังหวัดทุกวัดทั่วไทย](https://www.dmc.tv/article/33963)

บทความ [8045](https://www.dmc.tv/article/8045) และ [8060](https://www.dmc.tv/article/8060) ใช้ประกอบส่วนประวัติความเป็นมาของโครงการ

## อัปเดตข้อมูล

แก้ไฟล์ [`data/content.js`](data/content.js) ไฟล์เดียวสำหรับข้อมูลที่เปลี่ยนบ่อย:

- `events` — งานเด่นที่กำลังจะมาถึง
- `articles` — บทความ โดยกำหนด `type: "invite"` หรือ `type: "review"`
- `lastUpdated` — วันที่ปรับข้อมูลล่าสุดในรูปแบบ `YYYY-MM-DD`

วันที่ของกิจกรรมและบทความใช้รูปแบบ `YYYY-MM-DD` เพื่อให้ JavaScript เรียงลำดับได้ถูกต้อง

เมื่อต้องเปลี่ยนปีหรือ URL เว็บไซต์ ให้แก้ค่าที่เกี่ยวข้องใน:

- `index.html` — title, description, canonical, Open Graph และ JSON-LD
- `robots.txt`
- `sitemap.xml`

## เปิดดูในเครื่อง

```bash
python3 -m http.server 8080
```

จากนั้นเปิด `http://localhost:8080/`

## เผยแพร่

GitHub Actions ใน `.github/workflows/deploy-pages.yml` จะเผยแพร่เว็บไซต์เมื่อ push เข้า branch `main` หลังเปิด GitHub Pages ให้ใช้ GitHub Actions เป็น source แล้ว

## ภาพ

ภาพ `assets/hero-alms.jpg` และ `assets/alms-detail.jpg` สร้างขึ้นใหม่สำหรับเว็บไซต์นี้โดยเฉพาะ ไม่มีข้อความ โลโก้ หรือลายน้ำฝังในภาพ
