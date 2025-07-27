const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const OpenAI = require('openai');

dotenv.config();
const app = express();
const PORT = 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-description', async (req, res) => {
  const { name, skills } = req.body;
  const skillStr = skills.join(', ') || 'веб-технологиям';
  const prompt = `Напиши профессиональное описание для резюме человека по имени ${name}, который владеет навыками: ${skillStr}. Длина текста — минимум 700 символов.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    res.json({ description: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'Ошибка генерации.' });
  }
});

const indexPath = path.join(__dirname, 'public', 'index.html');
app.get('/', (req, res) => res.sendFile(indexPath));
app.get('/index.html', (req, res) => res.sendFile(indexPath));

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});
