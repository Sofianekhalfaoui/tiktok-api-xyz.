const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/sendViews', async (req, res) => {
  const { link, count } = req.body;

  if (!link || !count) {
    return res.status(400).json({ success: false, message: "البيانات ناقصة" });
  }

  try {
    const response = await axios.post('https://smmfollows.com/api/v2', null, {
      params: {
        key: '90f2874f542a9d30d319c4b3a03b1eaf',
        action: 'add',
        service: 16488,
        link,
        quantity: count
      }
    });

    const apiRes = response.data;

    if (apiRes.order) {
      res.json({ success: true, message: `تم إنشاء الطلب بنجاح. رقم الطلب: ${apiRes.order}` });
    } else {
      res.json({ success: false, message: apiRes.error || "حدث خطأ" });
    }

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, message: "فشل الاتصال بـ smmfollows" });
  }
});

app.get('/', (req, res) => {
  res.send("خادم TikTok يعمل!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});