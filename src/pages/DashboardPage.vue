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

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
  }

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

  const tasksByCategory = computed(() => {
    const filtered = tasks.filteredTasks()
    const result = {}
    categories.forEach(cat => {
      result[cat] = filtered.filter(t => t.category === cat)
    })
    return result
  })

</script>

<template>
  <div class="min-h-screen p-6 bg-gray-100">
    <Header
      title="Dashboard de Tarefas"
      :subtitle="`Bem-vindo, <span class='font-medium'>${auth.user?.name}</span>`"
    >
      <template #actions>
        <uiButton variant="danger" @click="auth.logout(router)">Sair</uiButton>
      </template>
    </Header>

    <div class="flex gap-4 mb-6 flex-wrap items-end">
      <uiSelect v-model="tasks.filterCategory" label="Categoria">
        <option value="Todas">Todas</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </uiSelect>

      <uiSelect v-model="tasks.filterPriority" label="Prioridade">
        <option value="Todas">Todas</option>
        <option v-for="prio in priorities" :key="prio" :value="prio">{{ prio }}</option>
      </uiSelect>

      <uiButton variant="primary" class="ml-auto" @click="openCreateModal">
        Nova Tarefa
      </uiButton>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div
        v-for="cat in categories"
        :key="cat"
        v-show="tasks.filterCategory === 'Todas' || tasks.filterCategory === cat"
        class="flex flex-col gap-4"
      >
        <h2 class="text-xl font-bold mb-2">{{ cat }}</h2>

        <div
          v-for="task in tasksByCategory[cat]"
          :key="task.id"
          @click="openEditModal(task)"
          class="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <h3 class="text-lg font-bold mb-1">{{ task.title }}</h3>
            <p class="text-gray-600 mb-2">{{ task.description || 'Sem descrição' }}</p>
            <p class="text-sm">Prioridade: <span class="font-medium">{{ task.priority }}</span></p>
            <p class="text-sm">Concluir até: <span class="font-medium">{{ formatDate(task.dueDate) }}</span></p>
          </div>

          <uiButton
            variant="secondary"
            class="mt-3 text-sm self-start text-red-600 hover:underline bg-transparent hover:bg-transparent"
            @click.stop="tasks.deleteTask(task.id)"
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
