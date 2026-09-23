const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // يعرض ملفات HTML من نفس الفولدر

const DATA_FILE = 'data.json';

// لو الملف مش موجود، نعمله فاضي
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// صفحة رئيسية بسيطة (اختياري)
app.get('/', (req, res) => {
  res.send('السيرفر شغال ✅');
});

// استقبال البيانات
app.post('/submit', (req, res) => {
  const { name, phone, lat, lon } = req.body;

  if (!name || !phone || !lat || !lon) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }

  const entry = { name, phone, lat, lon, time: new Date().toISOString() };

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(entry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.json({ success: true, message: 'تم الحفظ' });
});

// عرض كل البيانات (للمراجعة بس - يفضل تحميها بباسورد لاحقًا في الإنتاج)
app.get('/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`السيرفر شغال على المنفذ ${PORT}`));
