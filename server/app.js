const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Bot va chat ma'lumotlari (sizning ma'lumotlaringiz)
const botToken = "7816278326:AAFBwx7ttFnsVdzxixgIoAUf5EeGrKb4V-s"; 
const chatId = "8066921205";

// Frontend fayllarni joylashtirish uchun
app.use(express.static(path.join(__dirname, '../')));

// Middleware'lar - formadan kelgan ma'lumotlarni tahlil qilish uchun
app.use(bodyParser.urlencoded({ extended: true }));

// Formadan kelgan ma'lumotlarni qabul qilish uchun POST yo'li
app.post('/send-message', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Telegramga yuboriladigan xabarni tayyorlash
    const text = `<b>Yangi xabar portfoliodan!</b>%0A` +
                 `<b>Ismi:</b> ${encodeURIComponent(name)}%0A` +
                 `<b>Email:</b> ${encodeURIComponent(email)}%0A` +
                 `<b>Telefon:</b> ${encodeURIComponent(phone)}%0A` +
                 `<b>Mavzu:</b> ${encodeURIComponent(subject)}%0A` +
                 `<b>Xabar:</b> ${encodeURIComponent(message)}`;

    // Telegram API manzilini shakllantirish
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML`;

    try {
        // Global fetch funksiyasini to'g'ri chaqirish
        await fetch(telegramUrl);
        // Xabar muvaffaqiyatli yuborilsa, foydalanuvchini contact.html sahifasiga qaytarish
        res.redirect('/contact.html');
    } catch (error) {
        console.error('So\'rov yuborishda xato:', error);
        // Xato bo'lsa ham contact.html sahifasiga qaytarish
        res.redirect('/contact.html');
    }
});

// Serverni ishga tushirish
app.listen(port, () => {
    console.log(`Server ishlamoqda: http://localhost:${port}`);
});