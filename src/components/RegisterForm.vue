<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import uiInput from '../components/ui/Input.vue'
import uiButton from '../components/ui/Button.vue'

const email = ref('')
const name = ref('')
const password = ref('')
const confirmPassword = ref('')

const auth = useAuthStore()

const handleRegister = () => {
    auth.register(name.value, email.value, password.value, confirmPassword.value)
}

</script>

<template>
  <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
    <h1 class="text-4xl font-bold mb-6 text-center text-gray-800">
      Criar conta
    </h1>

    <form @submit.prevent="handleRegister" class="flex flex-col gap-4">

    <uiInput
        v-model="name"
        type="text"
        label="Nome"
        placeholder="Digite seu nome"
      />

      <uiInput
        v-model="email"
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
      />

      <uiInput
        v-model="password"
        type="password"
        label="Senha"
        placeholder="Digite sua senha"
      />

      <uiInput
        v-model="confirmPassword"
        type="password"
        label="Confirme a senha"
        placeholder="Digite novamente sua senha"
      />

      <uiButton
        variant="primary"
        type="submit"
        :disabled="auth.loading"
        class="w-full mt-3"
      >
        {{ auth.loading ? 'Criando conta...' : 'Cadastrar' }}
      </uiButton>

      <div class="text-center mt-4 text-sm">
        <p class="text-gray-600">Já possui uma conta?</p>
        <a href="/login" class="text-blue-600 font-medium hover:underline">
          Login
        </a>
      </div>

      <p v-if="auth.error" class="text-red-600 text-sm text-center mt-2">
        {{ auth.error }}
      </p>

      <p v-if="auth.success" class="text-green-600 text-sm text-center mt-2">
        {{ auth.success }}
      </p>
    </form>
  </div>
</template>
