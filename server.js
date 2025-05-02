const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// إعدادات API لـ smmfollows
const API_URL = "https://smmfollows.com/api/v2";
const API_KEY = "90f2874f542a9d30d319c4b3a03b1eaf";
const SERVICE_ID = 16488;

// نقطة التحقق
app.get("/", (req, res) => {
  res.send("خادم TikTok يعمل!");
});

// إرسال المشاهدات
app.post("/sendViews", async (req, res) => {
  const { link, count } = req.body;

  if (!link || !count) {
    return res.status(400).json({ success: false, message: "يرجى إدخال الرابط وعدد المشاهدات." });
  }

  try {
    const response = await axios.post(API_URL, {
      key: API_KEY,
      action: "add",
      service: SERVICE_ID,
      link,
      quantity: count
    });

    if (response.data && response.data.order) {
      res.json({ success: true, message: `تم إرسال الطلب بنجاح، رقم الطلب: ${response.data.order}` });
    } else {
      res.json({ success: false, message: "فشل إرسال الطلب: " + JSON.stringify(response.data) });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "خطأ في الاتصال بالخادم الخارجي." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});