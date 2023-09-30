import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [depForAddTask, setDepForAddTask] = useState();
  const [addedTaskName, setAddedTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    fetch('/departments').then((res) => {
      res.json().then((data) => {
        setData(data);
        setIsLoading(false);
      });
    });
  };

  const getCompletedTasks = () => {
    if (!data) return;
    let completed = 0;
    let notCompleted = 0;
    for (let dep of data) {
      for (let task of dep.tasks) {
        if (task.isCompleted) completed++;
        else notCompleted++;
      }
    }
    return { completed, notCompleted };
  };

  const tasksStatus = getCompletedTasks();

  const chartData = [
    {
      name: 'Completed',
      Number: tasksStatus.completed,
      pv: 100,
    },
    {
      name: 'Not Completed',
      Number: tasksStatus.notCompleted,
      pv: 100,
    },
  ];

  const addTask = async () => {
    setIsSubmitting(true);

    let res = await fetch('/add_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskName: addedTaskName,
        departmentId: depForAddTask._id,
      }),
    });

    let data = await res.json();
    setIsSubmitting(false);
    fetchData();
  };

  if (isLoading)
    return (
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-opacity-50 text-white p-8'>
        <progress className='progress w-56'></progress>
      </div>
    );

  return (
    <div className='p-10 flex w-full'>
      <div className='w-2/5 p-5'>
        <div className='flex items-center w-full justify-between p-3 bg-slate-100 rounded-lg'>
          <p className='texxl'>Completed Status</p>
        </div>

        <div className='flex w-full items-center justify-center mt-5'>
          <BarChart width={400} height={500} data={chartData}>
            <XAxis dataKey='name' stroke='#8884d8' />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
            <Bar dataKey='Number' fill='#8884d8' barSize={30} />
          </BarChart>
        </div>
      </div>

      <div className='w-full p-5'>
        {data.map((department) => {
          let completed = 0;
          department.tasks.forEach((task) => {
            if (task.isCompleted) completed++;
          });
          let progress = ((100 * completed) / department.tasks.length).toFixed(2);

          return (
            <div className=''>
              <div className='flex items-center w-full justify-between p-3 bg-slate-100 rounded-lg'>
                <div className='w-1/2'>
                  <p>Department:</p>
                  <div className='text-2xl'>{department.name}</div>
                </div>
                <div className='w-1/4 flex items-center border-l-2 px-2 h-20'>
                  <p>Progress:</p>
                  <div className='radial-progress text-primary ml-2' style={{ '--value': progress }}>
                    {progress}%
                  </div>
                </div>
                <div className='w-1/4 flex items-center border-l-2 px-2 h-20'>
                  <p>Test Result:</p>
                  {department.testResult ? (
                    <div className='radial-progress text-primary ml-2' style={{ '--value': department.testResult }}>
                      {department.testResult}%
                    </div>
                  ) : (
                    <div className='text-error ml-2'> Not Tested Yet</div>
                  )}
                </div>
                <div className='flex items-center border-l-2 px-2 h-20'>
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      setDepForAddTask(department);
                      document.getElementById('my_modal_2').showModal();
                    }}
                  >
                    Add Task
                  </button>
                </div>
              </div>
              <div className='overflow-x-auto'>
                <table className='table'>
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Task</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {department.tasks.map((task, i) => (
                      <tr>
                        <th>{i + 1}</th>
                        <td>{task.name}</td>
                        <td>
                          {task.isCompleted ? <div className='badge badge-success'>Completed</div> : <div className='badge badge-error'>Not Completed</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
      <dialog id='my_modal_2' className='modal'>
        <div className='modal-box'>
          <div className='text-2xl'>Add New Task</div>
          <div className='mt-3 w-full'>
            <p className='font-bold'>Department Name:</p>
            <input type='text' placeholder={depForAddTask?.name} className=' mt-2 input input-bordered w-full ' disabled />
          </div>
          <div className='mt-3 w-full'>
            <p className='font-bold'>Task Name:</p>
            <input
              type='text'
              onChange={(e) => setAddedTaskName(e.target.value)}
              placeholder='Type here'
              className=' mt-2 input input-bordered input-md w-full '
            />
          </div>
          <div className='mt-3 w-full'>
            <button className='btn btn-primary' disabled={isSubmitting} onClick={addTask}>
              Add Task
            </button>
          </div>
        </div>

        <form method='dialog' className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default App;
