<template>
  <div>
    <!-- Sticky Header -->
    <div
      class="sticky z-40 px-4 py-3 mb-6 -mx-4 border-b top-16 sm:-mx-6 sm:px-6 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xl border-slate-100 dark:border-slate-800">
      <div class="flex items-center justify-between gap-3 mx-auto max-w-7xl">
        <div class="flex items-center min-w-0 gap-3">
          <RouterLink to="/dashboard"
            class="flex items-center justify-center transition-all bg-white border w-9 h-9 rounded-xl dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 shrink-0">
            <ArrowLeft class="w-4 h-4" />
          </RouterLink>
          <div class="min-w-0">
            <h1 class="text-base font-black truncate text-slate-900 dark:text-white">
              {{ currentResume?.title || 'Resume Builder' }}
            </h1>
            <div class="flex items-center gap-2 mt-0.5">
              <span :class="statusBadge(currentResume?.status)" class="text-xs">
                <component :is="statusIcon(currentResume?.status)" class="w-3 h-3" />
                {{ statusLabel(currentResume?.status) }}
              </span>
              <span v-if="currentResume?.matchScore"
                class="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <TrendingUp class="w-3 h-3 text-emerald-500" />
                {{ currentResume.matchScore }}%
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <Transition name="fade">
            <div v-if="autoSaveStatus"
              class="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
              <LoadingSpinner v-if="autoSaveStatus === 'saving'" size="sm" />
              <CheckCircle v-else class="w-3.5 h-3.5 text-emerald-500" />
              {{ autoSaveStatus === 'saving' ? 'Menyimpan...' : 'Tersimpan' }}
            </div>
          </Transition>

          <RouterLink v-if="currentResume?.generatedCv"
            :to="{ name: 'KeywordAnalysis', params: { id: route.params.id } }"
            class="hidden px-3 py-2 text-xs btn-secondary sm:flex">
            <ScanSearch class="w-3.5 h-3.5" />
            Analisis
          </RouterLink>

          <UploadCV @parsed="handleParsed" />

          <button @click="handleExport" :disabled="!currentResume?.generatedCv || loading"
            class="px-3 py-2 text-xs btn-outline">
            <FileDown class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Ekspor PDF</span>
          </button>

          <button @click="handleSave" :disabled="loading" class="px-4 py-2 text-xs btn-primary">
            <Save class="w-3.5 h-3.5" />
            Simpan
          </button>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading && !currentResume" text="Memuat resume..." fullscreen />

    <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-2">

      <!-- Left: Editor -->
      <div class="space-y-4">

        <!-- Personal Info -->
        <div class="card">
          <div class="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div class="icon-box w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/40">
              <UserCircle class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 class="font-black text-slate-900 dark:text-white">Informasi Pribadi</h2>
          </div>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div v-for="field in personalFields" :key="field.key">
              <label class="block mb-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {{ field.label }}
              </label>
              <input v-model="form.personalInfo[field.key]" :type="field.type || 'text'"
                :placeholder="field.placeholder" class="input text-sm py-2.5" />
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="card">
          <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="bg-blue-100 icon-box w-9 h-9 rounded-xl dark:bg-blue-900/40">
                <AlignLeft class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 class="font-black text-slate-900 dark:text-white">Ringkasan Profesional</h2>
            </div>
            <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('summary')" :disabled="generating"
              class="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
              Buat Ulang
            </button>
          </div>
          <textarea v-model="form.summary" rows="4" class="text-sm resize-none input"
            placeholder="Tulis ringkasan profesional singkat..."></textarea>
        </div>

        <!-- Experience -->
        <div class="card">
          <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="bg-orange-100 icon-box w-9 h-9 rounded-xl dark:bg-orange-900/40">
                <Briefcase class="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 class="font-black text-slate-900 dark:text-white">Pengalaman Kerja</h2>
            </div>
            <button @click="addExperience"
              class="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
              <PlusCircle class="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          <div v-if="form.experience.length === 0" class="py-10 text-center">
            <div
              class="flex items-center justify-center mx-auto mb-3 w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Briefcase class="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </div>
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum ada pengalaman</p>
            <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">Klik Tambah untuk menambahkan</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(exp, index) in form.experience" :key="index"
              class="p-4 space-y-3 border rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="flex items-center justify-center w-6 h-6 text-xs font-black text-orange-600 bg-orange-100 rounded-lg dark:bg-orange-900/40 dark:text-orange-400">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                    {{ exp.company || `Pengalaman ${index + 1}` }}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('experience', index)"
                    :disabled="generating"
                    class="flex items-center gap-1 px-2 py-1 text-xs font-bold transition-colors rounded-lg text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100">
                    <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': generating }" />
                  </button>
                  <button @click="removeExperience(index)"
                    class="flex items-center justify-center text-red-400 transition-colors rounded-lg w-7 h-7 bg-red-50 dark:bg-red-900/20 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Perusahaan</label>
                  <input v-model="exp.company" type="text" class="py-2 text-sm input" placeholder="Nama perusahaan" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Posisi</label>
                  <input v-model="exp.position" type="text" class="py-2 text-sm input" placeholder="Jabatan" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Mulai</label>
                  <input v-model="exp.startDate" type="text" class="py-2 text-sm input" placeholder="Jan 2023" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Selesai</label>
                  <input v-model="exp.endDate" type="text" class="py-2 text-sm input" placeholder="Des 2024"
                    :disabled="exp.isCurrent" />
                </div>
              </div>
              <label
                class="flex items-center gap-2 text-sm cursor-pointer select-none text-slate-600 dark:text-slate-400">
                <input v-model="exp.isCurrent" type="checkbox" class="w-4 h-4 rounded accent-primary-600" />
                Masih bekerja di sini
              </label>
              <div>
                <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Deskripsi</label>
                <textarea v-model="exp.descriptionText" rows="3" class="text-sm resize-none input"
                  placeholder="Tulis pencapaian per baris..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="card">
          <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="icon-box w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40">
                <GraduationCap class="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h2 class="font-black text-slate-900 dark:text-white">Pendidikan</h2>
            </div>
            <button @click="addEducation"
              class="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
              <PlusCircle class="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          <div v-if="form.education.length === 0" class="py-10 text-center">
            <div
              class="flex items-center justify-center mx-auto mb-3 w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <GraduationCap class="w-7 h-7 text-slate-300 dark:text-slate-600" />
            </div>
            <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum ada pendidikan</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="(edu, index) in form.education" :key="index"
              class="p-4 space-y-3 border rounded-2xl border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    class="flex items-center justify-center w-6 h-6 text-xs font-black rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                    {{ edu.institution || `Pendidikan ${index + 1}` }}
                  </span>
                </div>
                <button @click="removeEducation(index)"
                  class="flex items-center justify-center text-red-400 transition-colors rounded-lg w-7 h-7 bg-red-50 dark:bg-red-900/20 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Institusi</label>
                  <input v-model="edu.institution" type="text" class="py-2 text-sm input"
                    placeholder="Nama universitas" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Jenjang</label>
                  <input v-model="edu.degree" type="text" class="py-2 text-sm input" placeholder="S1, S2, dll" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Jurusan</label>
                  <input v-model="edu.field" type="text" class="py-2 text-sm input" placeholder="Ilmu Komputer" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">IPK</label>
                  <input v-model="edu.gpa" type="text" class="py-2 text-sm input" placeholder="3.8" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Tahun Mulai</label>
                  <input v-model="edu.startDate" type="text" class="py-2 text-sm input" placeholder="2019" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-bold tracking-wide uppercase text-slate-400">Tahun
                    Selesai</label>
                  <input v-model="edu.endDate" type="text" class="py-2 text-sm input" placeholder="2023" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="card">
          <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="icon-box w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                <Wrench class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 class="font-black text-slate-900 dark:text-white">Keahlian</h2>
            </div>
            <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('skills')" :disabled="generating"
              class="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
              Buat Ulang
            </button>
          </div>
          <div class="relative mb-3">
            <input v-model="skillInput" type="text" class="pr-24 text-sm input"
              placeholder="Ketik skill lalu tekan Enter..." @keydown.enter.prevent="addSkill" />
            <button @click="addSkill"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors">
              Tambah
            </button>
          </div>
          <div v-if="form.skills.length > 0" class="flex flex-wrap gap-2">
            <span v-for="(skill, index) in form.skills" :key="index"
              class="group flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700/50 text-primary-700 dark:text-primary-300 text-sm px-3 py-1.5 rounded-xl font-semibold hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-default">
              {{ skill }}
              <button @click="removeSkill(index)" class="transition-colors text-primary-400 group-hover:text-red-500">
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
          <p v-else class="py-4 text-sm text-center text-slate-400 dark:text-slate-500">
            Belum ada skill — tambahkan di atas
          </p>
        </div>

        <!-- Job Description -->
        <div
          class="border-2 card border-primary-200 dark:border-primary-700/50 bg-primary-50/30 dark:bg-primary-900/10">
          <div class="flex items-center gap-3 pb-4 mb-5 border-b border-primary-100 dark:border-primary-800/50">
            <div class="icon-box w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/50">
              <ClipboardList class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="font-black text-slate-900 dark:text-white">Deskripsi Pekerjaan</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tempel lowongan yang ingin dilamar</p>
            </div>
          </div>
          <textarea v-model="jobDesc" rows="6" class="mb-4 text-sm resize-none input"
            placeholder="Tempel deskripsi pekerjaan di sini..."></textarea>
          <button @click="handleGenerate" :disabled="generating || !jobDesc.trim()"
            class="btn-primary w-full py-3.5 text-base justify-center">
            <LoadingSpinner v-if="generating" size="sm" />
            <span v-else class="flex items-center gap-2">
              <Sparkles class="w-5 h-5" />
              Generate dengan AI
            </span>
          </button>
        </div>
      </div>

      <!-- Right: Preview -->
      <div class="space-y-4 lg:sticky lg:top-32 lg:self-start">

        <!-- Match Score -->
        <div v-if="matchResult" class="card">
          <div class="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div class="icon-box w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <TrendingUp class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 class="font-black text-slate-900 dark:text-white">Skor Kecocokan</h2>
          </div>

          <div class="flex items-center gap-5 mb-5">
            <div class="relative w-24 h-24 shrink-0">
              <svg class="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" :stroke="scoreColor" stroke-width="2.5"
                  stroke-dasharray="100" :stroke-dashoffset="100 - matchResult.score" stroke-linecap="round"
                  class="transition-all duration-1000" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-2xl font-black leading-none text-slate-900 dark:text-white">{{ matchResult.score
                  }}</span>
                <span class="text-xs font-medium text-slate-400">/100</span>
              </div>
            </div>

            <div class="flex-1 space-y-2.5">
              <div v-for="(val, key) in matchResult.breakdown" :key="key">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ breakdownLabel(key)
                    }}</span>
                  <span class="text-xs font-black text-slate-700 dark:text-slate-300">{{ val }}%</span>
                </div>
                <div class="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-700 rounded-full"
                    :class="val >= 75 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-red-400'"
                    :style="{ width: `${val}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="matchResult.missingKeywords?.length" class="mb-4">
            <p class="mb-2 text-xs font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">Kata Kunci
              Kurang</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="kw in matchResult.missingKeywords" :key="kw" class="badge badge-danger">{{ kw }}</span>
            </div>
          </div>

          <div v-if="matchResult.suggestions?.length">
            <p class="mb-2 text-xs font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400">Saran</p>
            <ul class="space-y-1.5">
              <li v-for="s in matchResult.suggestions" :key="s"
                class="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-900/20 p-2.5 rounded-xl border border-amber-100 dark:border-amber-800/30">
                <Lightbulb class="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                {{ s }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Preview -->
        <div class="card">
          <div class="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div class="icon-box w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800">
              <Eye class="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 class="font-black text-slate-900 dark:text-white">Pratinjau CV</h2>
          </div>

          <div
            class="p-6 space-y-4 text-xs leading-relaxed bg-white border shadow-inner dark:bg-slate-900 rounded-2xl border-slate-100 dark:border-slate-800">

            <!-- Header -->
            <div class="pb-4 text-center border-b border-slate-100 dark:border-slate-800">
              <p class="text-base font-black tracking-tight text-slate-900 dark:text-white">
                {{ previewData.personalInfo?.name || 'Nama Kamu' }}
              </p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {{ [previewData.personalInfo?.email, previewData.personalInfo?.phone,
                previewData.personalInfo?.address].filter(Boolean).join(' · ') }}
              </p>
              <div v-if="previewData.personalInfo?.linkedin || previewData.personalInfo?.website"
                class="flex items-center justify-center gap-3 mt-1">
                <span v-if="previewData.personalInfo?.linkedin" class="text-xs text-primary-600 dark:text-primary-400">
                  {{ previewData.personalInfo.linkedin }}
                </span>
                <span v-if="previewData.personalInfo?.website" class="text-xs text-primary-600 dark:text-primary-400">
                  {{ previewData.personalInfo.website }}
                </span>
              </div>
            </div>

            <!-- Summary -->
            <div v-if="previewData.summary">
              <p class="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-1.5">
                Ringkasan</p>
              <p class="leading-relaxed text-slate-600 dark:text-slate-400">{{ previewData.summary }}</p>
            </div>

            <!-- Experience -->
            <div v-if="previewData.experience?.length">
              <p class="mb-2 text-xs font-black tracking-widest uppercase text-slate-700 dark:text-slate-300">Pengalaman
              </p>
              <div v-for="exp in previewData.experience" :key="exp.company" class="mb-3 last:mb-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-black text-slate-900 dark:text-white">{{ exp.position }}</p>
                  <p class="text-slate-400 shrink-0">{{ exp.startDate }} - {{ exp.isCurrent ? 'Sekarang' : exp.endDate
                    }}</p>
                </div>
                <p class="mb-1 font-bold text-primary-600 dark:text-primary-400">{{ exp.company }}</p>
                <ul v-if="exp.description?.length" class="space-y-0.5">
                  <li v-for="d in exp.description" :key="d"
                    class="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                    <span class="text-primary-400 mt-0.5 shrink-0">▸</span>{{ d }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Education -->
            <div v-if="previewData.education?.length">
              <p class="mb-2 text-xs font-black tracking-widest uppercase text-slate-700 dark:text-slate-300">Pendidikan
              </p>
              <div v-for="edu in previewData.education" :key="edu.institution" class="mb-2 last:mb-0">
                <p class="font-black text-slate-900 dark:text-white">{{ edu.institution }}</p>
                <p class="text-slate-500 dark:text-slate-400">{{ edu.degree }}{{ edu.field ? ' · ' + edu.field : '' }}{{
                  edu.gpa ? ' · IPK ' + edu.gpa : '' }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div v-if="previewData.skills?.length">
              <p class="mb-2 text-xs font-black tracking-widest uppercase text-slate-700 dark:text-slate-300">Keahlian
              </p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="skill in previewData.skills" :key="skill"
                  class="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-lg border border-primary-100 dark:border-primary-800/50 font-semibold">
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="!previewData.personalInfo?.name && !previewData.summary && !previewData.experience?.length"
              class="py-8 text-center text-slate-400 dark:text-slate-500">
              <Eye class="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p class="text-sm">Isi form di kiri untuk melihat pratinjau</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ArrowLeft, Save, UserCircle, AlignLeft, Briefcase, GraduationCap,
  Wrench, ClipboardList, Sparkles, PlusCircle, Trash2, RefreshCw,
  X, Eye, Lightbulb, CheckCircle, ScanSearch, FileDown, TrendingUp,
  Edit3
} from 'lucide-vue-next'
import { useResume } from '@/composables/useResume.js'
import { useToast } from '@/composables/useToast.js'
import { useConfirm } from '@/composables/useConfirm.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import UploadCV from '@/components/UploadCV.vue'

const route = useRoute()
const { currentResume, matchResult, loading, generating, fetchById, update, generate, regenerateSection, exportResume } = useResume()
const { success, error, info, warning } = useToast()
const { open } = useConfirm()

const jobDesc = ref('')
const skillInput = ref('')
const autoSaveStatus = ref('')
let autoSaveTimer = null

const form = ref({
  personalInfo: { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
  summary: '', experience: [], education: [], skills: []
})

const personalFields = [
  { key: 'name', label: 'Nama Lengkap', placeholder: 'Masukkan nama lengkap' },
  { key: 'email', label: 'Email', placeholder: 'Masukkan email', type: 'email' },
  { key: 'phone', label: 'Nomor Telepon', placeholder: 'Masukkan nomor telepon' },
  { key: 'address', label: 'Alamat', placeholder: 'Kota, Provinsi' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
  { key: 'website', label: 'Website', placeholder: 'portfolio.com' }
]

const previewData = computed(() => currentResume.value?.generatedCv || form.value)

const scoreColor = computed(() => {
  const s = matchResult.value?.score || 0
  return s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444'
})

const statusBadge = (s) => ({ DRAFT: 'badge badge-warning', GENERATED: 'badge badge-success', EXPORTED: 'badge badge-info' }[s] || 'badge')
const statusLabel = (s) => ({ DRAFT: 'Draft', GENERATED: 'Digenerate', EXPORTED: 'Diekspor' }[s] || 'Draft')
const statusIcon = (s) => ({ DRAFT: Edit3, GENERATED: Sparkles, EXPORTED: FileDown }[s] || Edit3)
const breakdownLabel = (k) => ({ skills: 'Keahlian', experience: 'Pengalaman', education: 'Pendidikan' }[k] || k)

const addExperience = () => form.value.experience.push({ company: '', position: '', startDate: '', endDate: '', isCurrent: false, descriptionText: '', description: [] })

const removeExperience = async (i) => {
  const ok = await open({ title: 'Hapus Pengalaman', message: 'Hapus pengalaman kerja ini?', confirmText: 'Hapus', cancelText: 'Batal', type: 'danger' })
  if (!ok) return
  form.value.experience.splice(i, 1)
  success('Pengalaman dihapus')
}

const addEducation = () => form.value.education.push({ institution: '', degree: '', field: '', gpa: '', startDate: '', endDate: '' })

const removeEducation = async (i) => {
  const ok = await open({ title: 'Hapus Pendidikan', message: 'Hapus data pendidikan ini?', confirmText: 'Hapus', cancelText: 'Batal', type: 'danger' })
  if (!ok) return
  form.value.education.splice(i, 1)
  success('Pendidikan dihapus')
}

const addSkill = () => {
  const s = skillInput.value.trim()
  if (!s) return
  if (form.value.skills.includes(s)) { warning('Skill sudah ada'); return }
  form.value.skills.push(s)
  skillInput.value = ''
}

const removeSkill = (i) => form.value.skills.splice(i, 1)

const buildCvBase = () => ({
  ...form.value,
  experience: form.value.experience.map(exp => ({
    ...exp, description: exp.descriptionText ? exp.descriptionText.split('\n').filter(Boolean) : exp.description
  }))
})

const startAutoSave = () => {
  autoSaveTimer = setInterval(async () => {
    if (!currentResume.value) return
    try {
      autoSaveStatus.value = 'saving'
      await update(route.params.id, { cvBase: buildCvBase() })
      autoSaveStatus.value = 'saved'
      setTimeout(() => { autoSaveStatus.value = '' }, 2000)
    } catch { autoSaveStatus.value = '' }
  }, 30000)
}

const stopAutoSave = () => { if (autoSaveTimer) { clearInterval(autoSaveTimer); autoSaveTimer = null } }

const handleSave = async () => {
  try { await update(route.params.id, { cvBase: buildCvBase() }); success('CV berhasil disimpan') }
  catch { error('Gagal menyimpan CV') }
}

const handleGenerate = async () => {
  if (!jobDesc.value || jobDesc.value.trim().length < 10) { warning('Deskripsi pekerjaan minimal 10 karakter'); return }
  const ok = await open({ title: 'Generate dengan AI', message: 'AI akan menulis ulang CV kamu. Lanjutkan?', confirmText: 'Generate', cancelText: 'Batal', type: 'info' })
  if (!ok) return
  try {
    await update(route.params.id, { cvBase: buildCvBase() })
    info('Sedang memproses dengan AI...')
    await generate(route.params.id, jobDesc.value)
    success('CV berhasil digenerate!')
  } catch { error('Gagal generate CV') }
}

const handleRegenerateSection = async (section, index) => {
  const label = { summary: 'ringkasan', experience: 'pengalaman', skills: 'keahlian' }[section]
  const ok = await open({ title: 'Buat Ulang', message: `AI akan membuat ulang ${label}. Lanjutkan?`, confirmText: 'Buat Ulang', cancelText: 'Batal', type: 'info' })
  if (!ok) return
  try {
    info('Memproses...')
    await regenerateSection(route.params.id, section, index)
    success(`${label} berhasil dibuat ulang`)
  } catch { error('Gagal membuat ulang') }
}

const handleExport = async () => {
  const ok = await open({ title: 'Ekspor PDF', message: 'CV akan diekspor ke PDF. Lanjutkan?', confirmText: 'Ekspor', cancelText: 'Batal', type: 'info' })
  if (!ok) return
  try { info('Mengekspor...'); await exportResume(route.params.id); success('CV berhasil diekspor') }
  catch { error('Gagal mengekspor CV') }
}

const populateForm = (resume) => {
  if (!resume) return
  const cv = resume.generatedCv || resume.cvBase
  form.value = {
    personalInfo: cv.personalInfo || { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: cv.summary || '',
    experience: (cv.experience || []).map(exp => ({ ...exp, descriptionText: (exp.description || []).join('\n') })),
    education: cv.education || [],
    skills: cv.skills || []
  }
  if (resume.jobDesc) jobDesc.value = resume.jobDesc
}

const handleParsed = (data) => {
  form.value = {
    personalInfo: data.personalInfo || { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: data.summary || '',
    experience: (data.experience || []).map(exp => ({ ...exp, descriptionText: (exp.description || []).join('\n') })),
    education: data.education || [],
    skills: data.skills || []
  }
  success('CV berhasil diparse!')
}

watch(currentResume, populateForm)

onMounted(async () => {
  try { await fetchById(route.params.id); startAutoSave() }
  catch { error('Gagal memuat CV') }
})

onUnmounted(stopAutoSave)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>