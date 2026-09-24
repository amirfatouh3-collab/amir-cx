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


// ===============================
// الصفحة الرئيسية
// ===============================

app.get('/', (req, res) => {
  res.send('السيرفر شغال ✅');
});


// ===============================
// حفظ البيانات
// ===============================

app.post('/submit', (req, res) => {

  const { name, phone, code } = req.body;

  // التأكد من البيانات
  if (!name || !phone || !code) {
    return res.status(400).json({
      success: false,
      error: 'بيانات ناقصة'
    });
  }

  // قراءة البيانات القديمة
  let data = JSON.parse(
    fs.readFileSync(DATA_FILE, 'utf8')
  );

  // التأكد أن الرقم الخاص لم يُستخدم قبل كده
  const existing = data.find(
    entry => String(entry.code) === String(code)
  );

  if (existing) {
    return res.status(400).json({
      success: false,
      error: 'هذا الرقم الخاص تم استخدامه بالفعل'
    });
  }

  // إنشاء البيانات الجديدة
  const entry = {
    code: code,
    name: name,
    phone: phone,
    time: new Date().toISOString()
  };

  // إضافة البيانات
  data.push(entry);

  // حفظها في data.json
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(data, null, 2)
  );

  res.json({
    success: true,
    message: 'تم الحفظ بنجاح'
  });

});


// ===============================
// عرض البيانات
// ===============================

app.get('/data', (req, res) => {

  try {

    const data = JSON.parse(
      fs.readFileSync(DATA_FILE, 'utf8')
    );

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: 'حدث خطأ أثناء قراءة البيانات'
    });

  }

});


// ===============================
// تشغيل السيرفر
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `السيرفر شغال على المنفذ ${PORT}`
  );

});
