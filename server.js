const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');

const app = express();
app.use(cors());

// ⚠️ ВАЖНО: Замените 'denris87' на ваш реальный ник в GitHub, если он другой!
// Убедитесь, что ссылка открывает именно сырой (Raw) текст вашего volunteers.yaml
const YAML_URL = 'https://raw.githubusercontent.com/denris87/vilnohirsk-volunteers-api/main/volunteers.yaml';

app.get('/api/volunteers', async (req, res) => {
    try {
        // Добавляем ?t=date чтобы сбросить кэш GitHub и получать данные мгновенно
        const response = await fetch(YAML_URL + '?t=' + Date.now());
        if (!response.ok) throw new Error('Не вдалося завантажити YAML з GitHub');
        
        const yamlText = await response.text();
        const data = yaml.load(yamlText);
        
        res.json(data.volunteers || []);
    } catch (error) {
        console.error('Помилка сервера:', error);
        res.status(500).json({ error: 'Failed to load data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
