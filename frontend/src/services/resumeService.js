import api from './api.js'

export const resumeService = {
  async create(data) {
    const response = await api.post('/resume', data)
    return response.data
  },

  async getAll() {
    const response = await api.get('/resume')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/resume/${id}`)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/resume/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/resume/${id}`)
    return response.data
  },

  async export(id) {
    const response = await api.get(`/resume/${id}/export`, {
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `resume_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async generate(id, jobDesc) {
    const response = await api.post(`/ai/${id}/generate`, { jobDesc: jobDesc })
    return response.data
  },

  async regenerateSection(id, section, index) {
    const response = await api.post(`/ai/${id}/regenerate`, { section, index })
    return response.data
  },

  async getMatchScore(id) {
    const response = await api.get(`/ai/${id}/match-score`)
    return response.data
  },

  async duplicate(id) {
    const response = await api.post(`/resume/${id}/duplicate`)
    return response.data
  },

  async analyzeKeywords(id) {
    const response = await api.get(`/ai/${id}/analyze-keywords`)
    return response.data
  }
}
