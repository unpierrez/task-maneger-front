<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useTasksStore } from '../stores/tasks.js'
import { useRouter } from 'vue-router'

import uiInput from '../components/ui/Input.vue'
import uiSelect from '../components/ui/Select.vue'
import uiButton from '../components/ui/Button.vue'
import uiModal from '../components/ui/Modal.vue'
import Header from '../components/Header.vue'

const auth = useAuthStore()
const tasks = useTasksStore()
const router = useRouter()

const openModal = ref(false)
const isEditing = ref(false)
const currentTask = ref({
  id: null,
  title: '',
  description: '',
  category: 'Pessoal',
  priority: 'Baixa',
  dueDate: ''
})

const categories = ['Pessoal', 'Trabalho', 'Estudo']
const priorities = ['Baixa', 'Média', 'Alta']

const openCreateModal = () => {
  isEditing.value = false
  currentTask.value = {
    id: null,
    title: '',
    description: '',
    category: 'Pessoal',
    priority: 'Baixa',
    dueDate: ''
  }
  openModal.value = true
}

const openEditModal = (task) => {
  isEditing.value = true
  currentTask.value = { ...task }
  openModal.value = true
}

const closeModal = () => {
  openModal.value = false
  isEditing.value = false
}

const saveTask = () => {
  if (!currentTask.value.title) return

  if (isEditing.value) {
    tasks.updateTask(currentTask.value)
  } else {
    tasks.addTask({ ...currentTask.value })
  }
  closeModal()
}

onMounted(() => {
  tasks.fetchTasks()
})

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3) return null
  const [year, month, day] = parts
  return new Date(year, month - 1, day)
}

const formatDateFromObj = (dateObj) => {
  if (!dateObj) return '—'
  return dateObj.toLocaleDateString('pt-BR')
}

const priorityColor = (priority) => {
  switch (priority) {
    case 'Alta':
      return 'text-red-600 font-semibold'
    case 'Média':
      return 'text-yellow-600 font-semibold'
    case 'Baixa':
      return 'text-green-600 font-semibold'
    default:
      return ''
  }
}

const taskList = computed(() => {
  const list = tasks.filteredTasks ? tasks.filteredTasks() : tasks.list || []

  return [...list]
    .map(t => {
      const dateObj = t.dueDate ? parseLocalDate(t.dueDate) : null
      const today = new Date()
      if (dateObj) {
        dateObj.setHours(0, 0, 0, 0)
      }
      today.setHours(0, 0, 0, 0)

      return {
        ...t,
        formattedDate: dateObj ? formatDateFromObj(dateObj) : '—',
        expired: dateObj ? dateObj <= today : false,
        _dateObj: dateObj
      }
    })
    .sort((a, b) => {
      if (!a._dateObj && !b._dateObj) return 0
      if (!a._dateObj) return 1
      if (!b._dateObj) return -1
      return a._dateObj - b._dateObj
    })
})
</script>

<template>
  <div class="min-h-screen p-6 bg-gray-100">

    <Header
      title="Gerenciador de Tarefas"
      :subtitle="`Bem-vindo, <span class='font-medium'>${auth.user?.name}</span>`"
    >
      <template #actions>
        <uiButton variant="danger" @click="auth.logout(router)">Sair</uiButton>
      </template>
    </Header>

    <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 mb-6">

      <div class="flex gap-3 flex-wrap items-center w-full sm:w-auto">

        <div class="flex items-center gap-2">
          <uiSelect label="Categoria" v-model="tasks.filterCategory" class="min-w-[140px]">
            <option value="Todas">Todas</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </uiSelect>
        </div>

        <div class="flex items-center gap-2">
          <uiSelect label="Prioridade" v-model="tasks.filterPriority" class="min-w-[140px]">
            <option value="Todas">Todas</option>
            <option v-for="prio in priorities" :key="prio" :value="prio">
              {{ prio }}
            </option>
          </uiSelect>
        </div>

      </div>

      <div class="ml-auto">
        <uiButton variant="primary" @click="openCreateModal">
          Nova Tarefa
        </uiButton>
      </div>
    </div>

    <div class="space-y-3">

      <div
        v-if="!taskList.length"
        class="bg-white p-6 rounded-xl shadow text-center text-gray-600"
      >
        Nenhuma tarefa encontrada.
      </div>

      <div
        v-for="task in taskList"
        :key="task.id"
        @click="openEditModal(task)"
        class="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex justify-between gap-6 items-start"
      >

        <div class="flex-1">
          <h3 class="text-lg font-bold mb-1">{{ task.title }}</h3>

          <p class="text-gray-600 mb-2 line-clamp-2">
            {{ task.description || 'Sem descrição' }}
          </p>

          <div class="flex gap-4 text-sm text-gray-700">
            <span>
              Categoria:
              <span class="font-medium">{{ task.category }}</span>
            </span>

            <span>
              Prioridade:
              <span :class="priorityColor(task.priority)">
                {{ task.priority }}
              </span>
            </span>

            <span>
              Concluir até:
              <span class="font-medium" :class="{ 'text-red-600': task.expired }">
                {{ task.formattedDate }}
              </span>
            </span>
          </div>
        </div>

        <div
          class="flex flex-col items-end justify-between min-w-[80px] py-1"
          @click.stop
        >
          <uiButton
            variant="secondary"
            class="text-sm text-red-600 hover:underline bg-transparent hover:bg-transparent"
            @click="tasks.deleteTask(task.id)"
          >
            Excluir
          </uiButton>
        </div>
      </div>
    </div>

    <uiModal :title="isEditing ? 'Editar Tarefa' : 'Nova Tarefa'" :isOpen="openModal">
      <uiInput v-model="currentTask.title" label="Título" placeholder="Título da tarefa" />
      <uiInput v-model="currentTask.description" label="Descrição" placeholder="Descrição da tarefa" />

      <uiSelect v-model="currentTask.category" label="Categoria">
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </uiSelect>

      <uiSelect v-model="currentTask.priority" label="Prioridade">
        <option v-for="prio in priorities" :key="prio" :value="prio">{{ prio }}</option>
      </uiSelect>

      <uiInput v-model="currentTask.dueDate" label="Data" type="date" />

      <template #actions>
        <uiButton variant="primary" @click="saveTask">
          {{ isEditing ? 'Salvar Alterações' : 'Salvar' }}
        </uiButton>

        <uiButton variant="secondary" @click="closeModal">
          Cancelar
        </uiButton>
      </template>
    </uiModal>

  </div>
</template>
