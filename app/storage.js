const storage = {
  isLogged: false,
  lastError: '',
  lastMessage: '',
  users: [
    {
      id: 1,
      username: 'Ben',
      password: '12345',
      age: 18,
      student: true,
      gender: 'man'
    },
    {
      id: 2,
      username: 'Ann',
      password: '54321',
      age: 16,
      student: true,
      gender: 'woman'
    },
    {
      id: 3,
      username: 'Elise',
      password: 'abc',
      age: 21,
      student: false,
      gender: 'woman'
    },
    {
      id: 4,
      username: 'Ginger',
      password: 'hi',
      age: 19,
      student: true,
      gender: 'woman'
    },
    {
      id: 5,
      username: 'Bob',
      password: 'a',
      age: 20,
      student: false,
      gender: 'man'
    }
  ]
}

module.exports = storage
