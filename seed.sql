INSERT INTO categories(name) VALUES
('อิเล็กทรอนิกส์'),('แฟชั่น'),('บ้านและไลฟ์สไตล์')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products(name,description,price,stock,category_id,image_url)
SELECT 'หูฟังไร้สาย Pro','หูฟังสำหรับทำงานและความบันเทิง',1290,25,id,NULL
FROM categories WHERE name='อิเล็กทรอนิกส์'
ON CONFLICT DO NOTHING;

INSERT INTO products(name,description,price,stock,category_id,image_url)
SELECT 'สมาร์ทวอทช์ Active','นาฬิกาอัจฉริยะสำหรับชีวิตประจำวัน',2490,18,id,NULL
FROM categories WHERE name='อิเล็กทรอนิกส์'
ON CONFLICT DO NOTHING;

INSERT INTO products(name,description,price,stock,category_id,image_url)
SELECT 'รองเท้า Everyday','รองเท้าใส่สบายสไตล์มินิมอล',1890,30,id,NULL
FROM categories WHERE name='แฟชั่น'
ON CONFLICT DO NOTHING;

INSERT INTO products(name,description,price,stock,category_id,image_url)
SELECT 'เก้าอี้ทำงาน Comfort','เก้าอี้ทำงานรองรับสรีระ',3590,12,id,NULL
FROM categories WHERE name='บ้านและไลฟ์สไตล์'
ON CONFLICT DO NOTHING;
