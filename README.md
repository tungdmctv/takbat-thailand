# โครงการตักบาตรพระ 3 ล้านรูป 77 จังหวัดทุกวัดทั่วไทย

Landing page และปฏิทินงานตักบาตรทั่วไทย พ.ศ. 2569 ในภาพลักษณ์พิธีการขาว–แดง–ทอง สร้างด้วย HTML, CSS และ JavaScript ธรรมดา ไม่มีฐานข้อมูลและไม่มีขั้นตอน build

เว็บไซต์หลัก: [https://www.dmc.tv/almsgiving/](https://www.dmc.tv/almsgiving/)

เว็บไซต์ประกอบด้วย:

- ปฏิทิน Google Calendar สำหรับกำหนดการล่าสุด
- ปุ่มเพิ่มปฏิทินโครงการตักบาตรไปยัง Google Calendar ของผู้ใช้งาน
- งานเด่นที่อ้างอิงจากบทความหลัก DMC.TV
- รายละเอียดและพัฒนาการของโครงการ
- บทความตักบาตรปี 2569 จำนวน 40 รายการ พร้อมระบบค้นหา
- ข่าวประชาสัมพันธ์และกำหนดการ แยกจากข่าวประมวลภาพและทบทวนบุญหลังพิธี
- SEO metadata, Open Graph, structured data, `robots.txt` และ `sitemap.xml`

## แหล่งข้อมูลหลัก

[งานตักบาตร พ.ศ. 2569 — โครงการตักบาตรพระ 3 ล้านรูป 77 จังหวัดทุกวัดทั่วไทย](https://www.dmc.tv/article/33963)

บทความ [8045](https://www.dmc.tv/article/8045) และ [8060](https://www.dmc.tv/article/8060) ใช้ประกอบส่วนประวัติความเป็นมาของโครงการ

## อัปเดตข้อมูล

แก้ไฟล์ [`data/content.js`](data/content.js) ไฟล์เดียวสำหรับข้อมูลที่เปลี่ยนบ่อย:

- `events` — งานเด่นที่กำลังจะมาถึง
- `articles` — บทความ โดยใช้ `id` จาก DMC.TV และกำหนด `type: "invite"` หรือ `type: "review"`
- `lastUpdated` — วันที่ปรับข้อมูลล่าสุดในรูปแบบ `YYYY-MM-DD`

วันที่ของกิจกรรมและบทความใช้รูปแบบ `YYYY-MM-DD` เพื่อให้ JavaScript เรียงลำดับได้ถูกต้อง

### แนวทางอัปเดตบทความในอนาคต

1. ค้นหาบทความปีปัจจุบันที่ชื่อมีคำว่า “ตักบาตร” จากแหล่งข้อมูล DMC.TV แบบอ่านอย่างเดียว
2. ตรวจชื่อ วันที่ หมวด และบทคัดย่อกับหน้าบทความต้นทาง
3. เพิ่มรายการใน `articles` พร้อมจำแนกประเภทให้ชัดเจน
4. ปรับ `lastUpdated` ใน `data/content.js`, `dateModified` ใน JSON-LD และ `lastmod` ใน `sitemap.xml`
5. ตรวจจำนวนบทความ ลิงก์ การค้นหา หน้าจอมือถือ และ SEO ก่อนเผยแพร่

หากจำนวนบทความเพิ่มขึ้นมากในอนาคต โครงสร้างปัจจุบันสามารถย้ายรายการไปเป็น JSON แยกไฟล์ได้โดยไม่ต้องเพิ่มฐานข้อมูล

เมื่อต้องเปลี่ยนปีหรือ URL เว็บไซต์ ให้แก้ค่าที่เกี่ยวข้องใน:

- `index.html` — title, description, canonical, Open Graph และ JSON-LD
- `robots.txt`
- `sitemap.xml`

## เปิดดูในเครื่อง

```bash
python3 -m http.server 8080
```

จากนั้นเปิด `http://localhost:8080/`

## เผยแพร่บน GitHub Pages

GitHub Actions ใน `.github/workflows/deploy-pages.yml` จะเผยแพร่เว็บไซต์เมื่อ push เข้า branch `main` หลังเปิด GitHub Pages ให้ใช้ GitHub Actions เป็น source แล้ว

GitHub Pages เป็นหน้าสำรองสำหรับตรวจงาน โดย canonical URL ของเว็บไซต์ชี้ไปยัง `https://www.dmc.tv/almsgiving/`

## เผยแพร่บน DMC.TV

ไฟล์ใน `deploy/` ใช้ติดตั้งเว็บไซต์แบบ static บน `172.29.2.15:2500` แล้วให้ Nginx บน `172.29.2.18:9999` ส่งต่อเฉพาะเส้นทาง `/almsgiving/`

- ใช้อิมเมจ `nginx:1.27-alpine` ที่มีอยู่ในเครื่อง โดยกำหนด `pull_policy: never`
- จำกัดหน่วยความจำ 64 MB, CPU 0.10 และจำนวน process 32
- รันด้วยผู้ใช้ non-root, filesystem แบบ read-only และปิด Linux capabilities ทั้งหมด
- เก็บแต่ละรุ่นไว้ใน `releases/<git-commit>` และสลับ symlink `current` เพื่อย้อนกลับได้
- ตรวจสุขภาพภายในที่ `/healthz`; URL สาธารณะคือ `https://www.dmc.tv/almsgiving/`

รายละเอียดคำสั่งติดตั้ง ตรวจสอบ และย้อนกลับอยู่ใน [`deploy/README.md`](deploy/README.md)

## ภาพ

ภาพ `assets/hero-alms.jpg` และ `assets/alms-detail.jpg` สร้างขึ้นใหม่สำหรับเว็บไซต์นี้โดยเฉพาะ ไม่มีข้อความ โลโก้ หรือลายน้ำฝังในภาพ
