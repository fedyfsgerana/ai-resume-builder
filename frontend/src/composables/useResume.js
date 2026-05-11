import { useResumeStore } from "@/stores/resumeStore.js";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export const useResume = () => {
  const resumeStore = useResumeStore();
  const router = useRouter();

  const {
    resumes,
    currentResume,
    matchResult,
    loading,
    generating,
    error,
    totalResumes,
    hasResumes,
  } = storeToRefs(resumeStore);

  const fetchAll = async () => {
    await resumeStore.fetchAll();
  };

  const fetchById = async (id) => {
    await resumeStore.fetchById(id);
  };

  const create = async (payload) => {
    const resume = await resumeStore.create(payload);
    router.push({ name: "Builder", params: { id: resume.id } });
  };

  const update = async (id, payload) => {
    await resumeStore.update(id, payload);
  };

  const remove = async (id) => {
    await resumeStore.remove(id);
    router.push({ name: "Dashboard" });
  };

  const generate = async (id, jobDesc) => {
    await resumeStore.generate(id, jobDesc);
  };

  const regenerateSection = async (id, section, index) => {
    await resumeStore.regenerateSection(id, section, index);
  };

  const fetchMatchScore = async (id) => {
    await resumeStore.fetchMatchScore(id);
  };

  const exportResume = async (id) => {
    await resumeStore.exportResume(id);
  };

  const clearCurrent = () => {
    resumeStore.clearCurrent();
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
};
