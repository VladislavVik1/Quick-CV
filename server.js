import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

app.post('/generate-description', async (req, res) => {
  const { name, skills } = req.body;
  const skillStr = skills.join(', ') || 'веб-технологиями';

  const prompt = `
Ты — помощник по написанию резюме. Сгенерируй 1 связный, живой текст для раздела "О себе".

Требования:
- Язык: такой, на каком пишет пользователь (русский или английский)
- От первого лица (например: "Я умею...", "Мне нравится...")
- Используй имя: ${name}
- Упомяни навыки: ${skillStr}
- Длина: минимум 300 символов
- Без сухих списков и перечислений, только естественный связный рассказ как для CV.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8
    });

    const description = completion.choices[0].message.content.trim();
    res.json({ description });

  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Ошибка генерации описаний.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
