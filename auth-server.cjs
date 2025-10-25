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
    res.json([user])
  } else {
    res.status(401)
  }
})

server.use(router)
server.listen(3000, () => console.log('Rodando o server - porta 3000'))
