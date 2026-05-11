import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { resumeService } from "@/services/resumeService.js";

export const useResumeStore = defineStore("resume", () => {
  const resumes = ref([]);
  const currentResume = ref(null);
  const matchResult = ref(null);
  const loading = ref(false);
  const generating = ref(false);
  const error = ref(null);

  const totalResumes = computed(() => resumes.value.length);
  const hasResumes = computed(() => resumes.value.length > 0);

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await resumeService.getAll();
      resumes.value = data.resumes;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch resumes";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await resumeService.getById(id);
      currentResume.value = data.resume;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch resume";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const create = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await resumeService.create(payload);
      resumes.value.unshift(data.resume);
      currentResume.value = data.resume;
      return data.resume;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to create resume";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const update = async (id, payload) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await resumeService.update(id, payload);
      currentResume.value = data.resume;
      const index = resumes.value.findIndex((r) => r.id === id);
      if (index !== -1) resumes.value[index] = data.resume;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to update resume";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await resumeService.delete(id);
      resumes.value = resumes.value.filter((r) => r.id !== id);
      if (currentResume.value?.id === id) currentResume.value = null;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to delete resume";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const generate = async (id, jobDesc) => {
    generating.value = true;
    error.value = null;
    try {
      const data = await resumeService.generate(id, jobDesc);
      currentResume.value = data.resume;
      matchResult.value = data.matchResult;
      const index = resumes.value.findIndex((r) => r.id === id);
      if (index !== -1) resumes.value[index] = data.resume;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to generate resume";
      throw err;
    } finally {
      generating.value = false;
    }
  };

  const regenerateSection = async (id, section, index) => {
    generating.value = true;
    error.value = null;
    try {
      const data = await resumeService.regenerateSection(id, section, index);
      currentResume.value = data.resume;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Failed to regenerate section";
      throw err;
    } finally {
      generating.value = false;
    }
  };

  const fetchMatchScore = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await resumeService.getMatchScore(id);
      matchResult.value = data.matchResult;
    } catch (err) {
      error.value =
        err.response?.data?.message || "Failed to fetch match score";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const exportResume = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await resumeService.export(id);
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to export resume";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearCurrent = () => {
    currentResume.value = null;
    matchResult.value = null;
  };

  return {
    resumes,
    currentResume,
    matchResult,
    loading,
    generating,
    error,
    totalResumes,
    hasResumes,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    generate,
    regenerateSection,
    fetchMatchScore,
    exportResume,
    clearCurrent,
  };
});
