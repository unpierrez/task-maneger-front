import { defineStore } from 'pinia'
import { router } from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    error: null,
    success: null,
    loading: false
  }),

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      this.success = null

      if (!email || !password) {
        this.error = 'Preencha e-mail e senha'
        this.loading = false
        return
      }

      try {
        const res = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        
        if (!res.ok) {

          console.log('status ->', res.status)

          if (res.status === 401) {
            this.error = 'Email ou senha inválidos'
          } else {
            this.error = 'Erro ao consultar o servidor'
          }
          return
        }

        const data = await res.json()

        if (data.length > 0) {
          this.user = data[0]
          localStorage.setItem('user', JSON.stringify(this.user))
          router.push({ name: 'dashboard' })
        } else {
          this.error = 'Email ou senha inválidos'
        }
      } catch (err) {
        this.error = err.message || 'Erro ao acessar o servidor'
      } finally {
        this.loading = false
      }
    },
    async register(name, email, password, confirmPassword) {
      this.loading = true
      this.error = null
      this.success = null

      if(password !== confirmPassword) {
        this.error = 'As senhas não coincidem.'
        return
      }

      if (!name || !email || !password) {
        this.error = 'Preencha todos os campos'
        this.loading = false
        return
      }

      try {
        const res = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        if (!res.ok) {
          console.log('status ->', res.status)

          if (res.status === 409) {
            this.error = 'E-mail já cadastrado'
          } else {
            this.error = 'Erro ao cadastrar usuário'
          }
          return
        }

        router.push({ name: 'login' })

      } catch (err) {
        this.error = err.message || 'Erro ao acessar o servidor'
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.error = null
      this.success = null
      localStorage.removeItem('user')
      if (router) router.push({ name: 'login' })
    }
  }
})
