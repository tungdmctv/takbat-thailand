# Production deployment

เว็บไซต์เผยแพร่ที่ `https://www.dmc.tv/almsgiving/` โดยมีองค์ประกอบดังนี้

1. `172.29.2.15:2500` ให้บริการไฟล์ static ด้วยคอนเทนเนอร์ `takbat_almsgiving`
2. `172.29.2.18:9999` ส่งต่อ `/almsgiving/` ไปยัง `172.29.2.15:2500`
3. `/almsgiving` เปลี่ยนเส้นทางถาวรไปยัง `https://www.dmc.tv/almsgiving/`

## ข้อกำหนดของคอนเทนเนอร์

- Image: `nginx:1.27-alpine`
- Expected image ID: `sha256:6769dc3a703c719c1d2756bda113659be28ae16cf0da58dd5fd823d6b9a050ea`
- Expected digest: `nginx@sha256:65645c7bb6a0661892a8b03b89d0743208a18dd2f3f17a54ef4b76fb8e2f2a10`
- ห้าม pull หรือ build ระหว่าง deploy
- Directory: `/home/takbat-almsgiving`

## ตรวจสอบบน origin

```bash
cd /home/takbat-almsgiving
docker compose config --quiet
docker compose up -d --no-deps
curl -fsS http://172.29.2.15:2500/healthz
curl -fsSI http://172.29.2.15:2500/
```

## Route บน 172.29.2.18

เพิ่มใน server block ของ `/etc/nginx/conf.d/dmc_www_9999.conf`

```nginx
location = /almsgiving {
    return 301 https://www.dmc.tv/almsgiving/;
}

location ^~ /almsgiving/ {
    proxy_set_header Host "172.29.2.15:2500";
    proxy_pass http://172.29.2.15:2500/;
}
```

หลังแก้ไขต้องเรียก `nginx -t` ก่อน `systemctl reload nginx` ทุกครั้ง

## ย้อนกลับ

1. คืนไฟล์ backup ของ `/etc/nginx/conf.d/dmc_www_9999.conf` บน `172.29.2.18`
2. เรียก `nginx -t` และ `systemctl reload nginx`
3. หากต้องย้อนเฉพาะไฟล์เว็บไซต์ ให้เปลี่ยน symlink `/home/takbat-almsgiving/current` ไปยัง release ก่อนหน้า แล้วรัน `docker compose up -d --no-deps`
4. หากต้องถอนบริการทั้งหมด ให้ใช้ `docker compose down` ภายใน `/home/takbat-almsgiving` เท่านั้น

ห้ามใช้คำสั่ง prune หรือลบ image เพราะ image เดียวกันอาจถูกใช้โดยบริการอื่น
