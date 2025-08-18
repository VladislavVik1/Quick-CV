import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai'; 

import CV from './models/Cv.js';
import Setting from './models/Setting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(publicPath));

let openai; // объявляем глобально

const startServer = async () => {
  try {
    await mongoose.connect('mongodb+srv://cvAdmin:Quickcvadmin@cluster0.w060lzj.mongodb.net/quickcv?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ MongoDB connected');

    const keyRecord = await Setting.findOne({ key: 'OPENAI_API_KEY' });
    if (!keyRecord) throw new Error('❌ OPENAI_API_KEY не знайдено в MongoDB');
    const openaiKey = keyRecord.value;
    console.log('🔑 OPENAI_API_KEY успешно загружен из MongoDB');

    openai = new OpenAI({ apiKey: openaiKey });

    // Сохранение CV
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

    app.post('/generate-description', async (req, res) => {
      try {
        const {
          name = '',
          skills = [],
          specialty = '',
          hobbies = '',
          language = 'ru'
        } = req.body;

        const skillStr = skills.length ? skills.join(', ') : 'без конкретных навыков';
        const hobbyStr = hobbies || 'без увлечений';

        const langNames = {
          ru: 'Russian',
          uk: 'Ukrainian',
          en: 'English'
        };
        const langName = langNames[language] || 'Russian';

        const prompt = `
Вы — помощник по составлению резюме. Напишите раздел «О себе» от первого лица на языке ${langName}.

Не перечисляй навыки дословно. Вместо этого используй их смысл. Если указаны хобби — вплети их естественным образом в рассказ. Сделайте текст кратким (от 300 до 500 символов).

Name: ${name}
Profession: ${specialty}
Skills: ${skillStr}
Hobbies: ${hobbyStr}
`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        });

        const result = completion.choices[0]?.message?.content;
        if (!result) throw new Error('GPT вернул пустой результат');

        res.json({ description: result.trim() });
      } catch (error) {
        console.error('❌ OpenAI error:', error?.response?.data || error.message || error);
        res.status(500).json({ error: 'Ошибка генерации описания.' });
      }
    });

    const PORT = 10000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Старт сервера невозможен:', err.message);
    process.exit(1);
  }
};

startServer();
