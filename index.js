const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const Department = require('./schema');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'UI', 'dist')));

app.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find();

    res.send(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/:departmentName/:taskName/completed', (req, res) => {
  const departmentName = req.params.departmentName;
  const taskName = req.params.taskName;

  const query = {
    name: departmentName,
    'tasks.name': taskName,
  };

  const update = {
    $set: {
      'tasks.$.isCompleted': true,
    },
  };

  Department.updateOne(query, update)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

app.post('/test/:departmentName/:score', async (req, res) => {
  try {
    const departmentName = req.params.departmentName;
    const score = req.params.score;

    await Department.updateOne({ name: departmentName }, { $set: { testResult: score } });

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/add_task', async (req, res) => {
  try {
    const { taskName, departmentId } = req.body;

    const departments = await Department.findByIdAndUpdate(
      departmentId,
      {
        $push: {
          tasks: {
            name: taskName,
          },
        },
      },
      {
        new: true,
      }
    );

    res.send(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'UI', 'dist', 'index.html'));
});

mongoose.connect('mongodb+srv://mohammadazhari535:0000@cluster0.owrknu8.mongodb.net/?retryWrites=true&w=majority').then(() => {
  //   Department.insertMany(data.departments).then(() => console.log('inserted successfully'));

  app.listen(process.env.PORT || 4000, () => {
    console.log('app is running...');
  });
});
