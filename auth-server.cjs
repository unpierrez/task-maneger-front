const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/login', (req, res) => {
  const { email, password } = req.body
  const users = router.db.get('users').value()
  const user = users.find(u => u.email === email && u.password === password)

  if (user) {
    return res.json([user])
  } else {
    return res.status(401).json({ error: 'Email ou senha inválidos' })
  }
})

server.post('/register', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' })
  }

  const users = router.db.get('users').value()
  const emailExists = users.some(u => u.email === email)

  if (emailExists) {
    return res.status(409).json({ error: 'E-mail já cadastrado' })
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  }

  router.db.get('users').push(newUser).write()

  return res.status(201).json([newUser])
})

server.use(router)
server.listen(3000, () => console.log('Rodando o server - porta 3000'))
