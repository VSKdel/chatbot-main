// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');


const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/api/school', async (req, res) => {
  const { schoolId } = req.query;
  const url = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Academic_Result_API?schoolid=${schoolId}&password=VSK@9180`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/student', async (req, res) => {
  const { studentId } = req.query;
  const url = `https://www.edudel.nic.in/mis/EduWebService_Other/vidyasamikshakendra.asmx/Student_MarksandResult_API?studentId=${studentId}&password=VSK@9180`;

  try {
    const response = await fetch(url);
    const data = await response.json();


    console.log("In server");
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
