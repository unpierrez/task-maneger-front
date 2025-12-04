import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    list: JSON.parse(localStorage.getItem('tasks')) || [],
    filterCategory: 'Todas',
    filterPriority: 'Todas'
  }),

  actions: {
    async fetchTasks() {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) return

      const res = await fetch(`http://localhost:3000/tasks?userId=${user.id}`)
      this.list = await res.json()
    },

    filteredTasks() {
      return this.list.filter(t => {
        const byCategory =
          this.filterCategory === 'Todas' || t.category === this.filterCategory
        const byPriority =
          this.filterPriority === 'Todas' || t.priority === this.filterPriority
        return byCategory && byPriority
      })
    },

    async addTask(task) {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) return

      const res = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          userId: user.id
        })
      })

      const newTask = await res.json()
      this.list.push(newTask)
    },

    async updateTask(task) {
      const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      })

      const updated = await res.json()
      const index = this.list.findIndex(t => t.id === task.id)

      if (index !== -1) this.list[index] = updated
    },

    async deleteTask(id) {
      await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
      this.list = this.list.filter(t => t.id !== id)
    }
  }
})
