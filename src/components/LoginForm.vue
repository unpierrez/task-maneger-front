<script setup>
  import { ref } from 'vue'
  import { useAuthStore } from '../stores/auth.js'
  import uiInput from '../components/ui/Input.vue'
  import uiButton from '../components/ui/Button.vue'

  const email = ref('')
  const password = ref('')
  const auth = useAuthStore()

  const handleLogin = () => {
    auth.login(email.value, password.value)
  }
</script>

<template>
  <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
    <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Acessar Gerenciador de Tarefas</h1>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
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

      <uiButton
        variant="primary"
        type="submit"
        :disabled="auth.loading"
        class="w-full mt-3"
      >
        {{ auth.loading ? 'Entrando...' : 'Entrar' }}
      </uiButton>

      <p v-if="auth.error" class="text-red-600 text-sm text-center mt-2">
        {{ auth.error }}
      </p>

      <p v-if="auth.success" class="text-green-600 text-sm text-center mt-2">
        {{ auth.success }}
      </p>
    </form>
  </div>
</template>
