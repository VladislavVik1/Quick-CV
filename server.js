import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

import CV from './models/Cv.js';
import Setting from './models/Setting.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));


const startServer = async () => {
  try {

    await mongoose.connect('mongodb+srv://CvAdmin:Quickcvadmin@cluster0.t7x7ove.mongodb.net/quickcv');
    console.log('✅ MongoDB connected');

    // витяг ключа з MongoDB
    const keyRecord = await Setting.findOne({ key: 'OPENAI_API_KEY' });
    if (!keyRecord) throw new Error('❌ OPENAI_API_KEY не знайдено в MongoDB');
    console.log('🔑 OPENAI_API_KEY успешно загружен из MongoDB');

    const openai = new OpenAI({ apiKey: keyRecord.value });

    // маршрут збереження резюме
    app.post('/api/cv', async (req, res) => {
      try {
        const cv = new CV(req.body);
        await cv.save();
        res.status(201).json({ message: 'CV сохранено!' });
      } catch (error) {
        console.error('❌ Ошибка сохранения CV:', error);
        res.status(500).json({ error: 'Не удалось сохранить резюме.' });
      }
    });

    // маршрут генерації опису
    app.post('/generate-description', async (req, res) => {
      const { name, skills } = req.body;
      const skillStr = (skills && skills.length > 0) ? skills.join(', ') : 'веб-технологиями';

      const prompt = `
Ты — помощник по написанию резюме. Сгенерируй 1 связный, живой текст для раздела "О себе" для IT компаний.

Составь короткий текст минимум 300, максимум 500 символов "О себе" для IT-резюме на русском. Имя: ${name}. Навыки: ${skillStr}.
`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 400
        });

        const description = completion.choices[0].message.content.trim();
        res.json({ description });
      } catch (error) {
        console.error('OpenAI error:', error);
        res.status(500).json({ error: 'Ошибка генерации описания.' });
      }
    });

    const PORT = 10000;
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Старт сервера невозможен:', err.message);
    process.exit(1);
  }
};

startServer();
