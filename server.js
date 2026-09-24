const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = 'data.json';

// لو الملف مش موجود، نعمله فاضي
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.send('السيرفر شغال ✅');
});

// استقبال البيانات
app.post('/submit', (req, res) => {
  const { name, phone, code } = req.body;

  if (!name || !phone || !code) {
    return res.status(400).json({
      error: 'الاسم ورقم الهاتف والرقم الخاص مطلوبين'
    });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));

  // التأكد إن الرقم الخاص لم يتم استخدامه قبل كده
  const existing = data.find(entry => entry.code === code);

  if (existing) {
    return res.status(400).json({
      error: 'هذا الرقم الخاص تم استخدامه بالفعل'
    });
  }

  const entry = {
    code: code,
    name: name,
    phone: phone,
    time: new Date().toISOString()
  };

  data.push(entry);

  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2)
  );

  res.json({
    success: true,
    code: code,
    message: 'تم الحفظ بنجاح'
  });
});

// عرض كل البيانات
app.get('/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`السيرفر شغال على المنفذ ${PORT}`);
});
