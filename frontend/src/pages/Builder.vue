<template>
  <div>
    <!-- Header -->
    <div class="sticky z-40 flex items-center justify-between px-4 py-3 mb-6 -mx-4 border-b top-16 bg-secondary-50 dark:bg-secondary-900 border-secondary-100 dark:border-secondary-800">
      <div class="flex items-center gap-3">
        <RouterLink to="/dashboard"
          class="flex items-center justify-center w-8 h-8 transition-all rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700">
          <ArrowLeft class="w-4 h-4" />
        </RouterLink>
        <div>
          <h1 class="text-lg font-bold text-secondary-900 dark:text-white">{{ currentResume?.title || 'Resume Builder' }}</h1>
          <div class="flex items-center gap-2 mt-0.5">
            <span :class="statusBadge(currentResume?.status)">{{ statusLabel(currentResume?.status) }}</span>
            <span v-if="currentResume?.matchScore" class="flex items-center gap-1 text-xs font-medium text-secondary-500 dark:text-secondary-400">
              <TrendingUp class="w-3 h-3 text-green-500" />
              {{ currentResume.matchScore }}% kecocokan
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Transition name="fade">
          <div v-if="autoSaveStatus" class="flex items-center gap-1.5 text-xs text-secondary-400 dark:text-secondary-500 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-lg">
            <LoadingSpinner v-if="autoSaveStatus === 'saving'" size="sm" />
            <CheckCircle v-else-if="autoSaveStatus === 'saved'" class="w-3.5 h-3.5 text-green-500" />
            <span>{{ autoSaveStatus === 'saving' ? 'Menyimpan...' : 'Tersimpan' }}</span>
          </div>
        </Transition>
        <RouterLink
          v-if="currentResume?.generatedCv"
          :to="{ name: 'KeywordAnalysis', params: { id: route.params.id } }"
          class="flex items-center gap-2 px-3 py-2 text-sm btn-secondary"
        >
          <ScanSearch class="w-4 h-4" />
          <span class="hidden sm:inline">Analisis</span>
        </RouterLink>
        <UploadCV @parsed="handleParsed" />
        <button @click="handleExport" :disabled="!currentResume?.generatedCv || loading"
          class="flex items-center gap-2 px-3 py-2 text-sm btn-outline">
          <FileDown class="w-4 h-4" />
          <span class="hidden sm:inline">Ekspor PDF</span>
        </button>
        <button @click="handleSave" :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 text-sm shadow-md btn-primary shadow-primary-500/20">
          <Save class="w-4 h-4" />
          Simpan
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="loading && !currentResume" text="Memuat resume..." fullscreen />

    <div v-else class="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-2">
      <!-- Left: Editor -->
      <div class="flex flex-col gap-4">

        <!-- Personal Info -->
        <div class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center gap-2 mb-5">
            <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900">
              <UserCircle class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 class="font-bold text-secondary-900 dark:text-white">Informasi Pribadi</h2>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">Nama Lengkap</label>
              <input v-model="form.personalInfo.name" type="text" class="text-sm input" placeholder="Masukkan nama lengkap" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">Email</label>
              <input v-model="form.personalInfo.email" type="email" class="text-sm input" placeholder="Masukkan email" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">Nomor Telepon</label>
              <input v-model="form.personalInfo.phone" type="text" class="text-sm input" placeholder="Masukkan nomor telepon" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">Alamat</label>
              <input v-model="form.personalInfo.address" type="text" class="text-sm input" placeholder="Masukkan alamat" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">LinkedIn</label>
              <input v-model="form.personalInfo.linkedin" type="text" class="text-sm input" placeholder="Masukkan URL LinkedIn" />
            </div>
            <div>
              <label class="block mb-1.5 text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">Website</label>
              <input v-model="form.personalInfo.website" type="text" class="text-sm input" placeholder="Masukkan URL website" />
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-xl dark:bg-blue-900">
                <AlignLeft class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 class="font-bold text-secondary-900 dark:text-white">Ringkasan Profesional</h2>
            </div>
            <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('summary')"
              :disabled="generating"
              class="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold bg-primary-50 dark:bg-primary-900/50 px-3 py-1.5 rounded-lg transition-colors">
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
              Buat Ulang
            </button>
          </div>
          <textarea v-model="form.summary" rows="4" class="text-sm resize-none input"
            placeholder="Tulis ringkasan profesional..."></textarea>
        </div>

        <!-- Experience -->
        <div class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-xl dark:bg-orange-900">
                <Briefcase class="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 class="font-bold text-secondary-900 dark:text-white">Pengalaman Kerja</h2>
            </div>
            <button @click="addExperience"
              class="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold bg-primary-50 dark:bg-primary-900/50 px-3 py-1.5 rounded-lg transition-colors">
              <PlusCircle class="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          <div v-if="form.experience.length === 0"
            class="py-10 text-center text-secondary-400 dark:text-secondary-500">
            <div class="flex items-center justify-center mx-auto mb-3 w-14 h-14 rounded-2xl bg-secondary-100 dark:bg-secondary-700">
              <Briefcase class="w-7 h-7 text-secondary-300 dark:text-secondary-500" />
            </div>
            <p class="text-sm font-medium">Belum ada pengalaman ditambahkan</p>
            <p class="mt-1 text-xs">Klik Tambah untuk menambahkan pengalaman kerja</p>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div v-for="(exp, index) in form.experience" :key="index"
              class="flex flex-col gap-3 p-4 border rounded-2xl border-secondary-100 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-800/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex items-center justify-center w-6 h-6 text-xs font-bold text-orange-600 bg-orange-100 rounded-lg dark:bg-orange-900 dark:text-orange-400">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                    {{ exp.company || `Pengalaman ${index + 1}` }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <button v-if="currentResume?.generatedCv"
                    @click="handleRegenerateSection('experience', index)" :disabled="generating"
                    class="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/50">
                    <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': generating }" />
                    Buat Ulang
                  </button>
                  <button @click="removeExperience(index)"
                    class="flex items-center justify-center text-red-400 transition-colors rounded-lg w-7 h-7 bg-red-50 dark:bg-red-900/30 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50">
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Perusahaan</label>
                  <input v-model="exp.company" type="text" class="text-sm input" placeholder="Masukkan nama perusahaan" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Posisi</label>
                  <input v-model="exp.position" type="text" class="text-sm input" placeholder="Masukkan posisi jabatan" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Tanggal Mulai</label>
                  <input v-model="exp.startDate" type="text" class="text-sm input" placeholder="Jan 2023" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Tanggal Selesai</label>
                  <input v-model="exp.endDate" type="text" class="text-sm input"
                    placeholder="Des 2024" :disabled="exp.isCurrent" />
                </div>
              </div>
              <label class="flex items-center gap-2 text-sm cursor-pointer text-secondary-600 dark:text-secondary-400">
                <input v-model="exp.isCurrent" type="checkbox" class="rounded accent-primary-600" />
                Masih bekerja di sini
              </label>
              <div>
                <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Deskripsi</label>
                <textarea v-model="exp.descriptionText" rows="3" class="text-sm resize-none input"
                  placeholder="Tulis deskripsi pekerjaan per baris..."></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-xl dark:bg-purple-900">
                <GraduationCap class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 class="font-bold text-secondary-900 dark:text-white">Pendidikan</h2>
            </div>
            <button @click="addEducation"
              class="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold bg-primary-50 dark:bg-primary-900/50 px-3 py-1.5 rounded-lg transition-colors">
              <PlusCircle class="w-3.5 h-3.5" />
              Tambah
            </button>
          </div>

          <div v-if="form.education.length === 0"
            class="py-10 text-center text-secondary-400 dark:text-secondary-500">
            <div class="flex items-center justify-center mx-auto mb-3 w-14 h-14 rounded-2xl bg-secondary-100 dark:bg-secondary-700">
              <GraduationCap class="w-7 h-7 text-secondary-300 dark:text-secondary-500" />
            </div>
            <p class="text-sm font-medium">Belum ada pendidikan ditambahkan</p>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div v-for="(edu, index) in form.education" :key="index"
              class="flex flex-col gap-3 p-4 border rounded-2xl border-secondary-100 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-800/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex items-center justify-center w-6 h-6 text-xs font-bold text-purple-600 bg-purple-100 rounded-lg dark:bg-purple-900 dark:text-purple-400">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                    {{ edu.institution || `Pendidikan ${index + 1}` }}
                  </span>
                </div>
                <button @click="removeEducation(index)"
                  class="flex items-center justify-center text-red-400 transition-colors rounded-lg w-7 h-7 bg-red-50 dark:bg-red-900/30 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Institusi</label>
                  <input v-model="edu.institution" type="text" class="text-sm input" placeholder="Masukkan nama institusi" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Jenjang</label>
                  <input v-model="edu.degree" type="text" class="text-sm input" placeholder="Masukkan jenjang pendidikan" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Jurusan</label>
                  <input v-model="edu.field" type="text" class="text-sm input" placeholder="Masukkan jurusan" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">IPK</label>
                  <input v-model="edu.gpa" type="text" class="text-sm input" placeholder="Masukkan IPK" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Tahun Mulai</label>
                  <input v-model="edu.startDate" type="text" class="text-sm input" placeholder="2019" />
                </div>
                <div>
                  <label class="block mb-1 text-xs font-semibold tracking-wide uppercase text-secondary-500 dark:text-secondary-400">Tahun Selesai</label>
                  <input v-model="edu.endDate" type="text" class="text-sm input" placeholder="2023" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-xl dark:bg-green-900">
                <Wrench class="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <h2 class="font-bold text-secondary-900 dark:text-white">Keahlian</h2>
            </div>
            <button v-if="currentResume?.generatedCv" @click="handleRegenerateSection('skills')"
              :disabled="generating"
              class="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold bg-primary-50 dark:bg-primary-900/50 px-3 py-1.5 rounded-lg transition-colors">
              <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': generating }" />
              Buat Ulang
            </button>
          </div>
          <input v-model="skillInput" type="text" class="mb-3 text-sm input"
            placeholder="Ketik skill lalu tekan Enter..." @keydown.enter.prevent="addSkill" />
          <div class="flex flex-wrap gap-2">
            <span v-for="(skill, index) in form.skills" :key="index"
              class="group flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/50 border border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 text-sm px-3 py-1.5 rounded-xl font-medium hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
              {{ skill }}
              <button @click="removeSkill(index)"
                class="text-primary-400 hover:text-red-500 transition-colors ml-0.5">
                <X class="w-3 h-3" />
              </button>
            </span>
            <div v-if="form.skills.length === 0" class="py-1 text-sm text-secondary-400 dark:text-secondary-500">
              Belum ada skill ditambahkan
            </div>
          </div>
        </div>

        <!-- Job Description -->
        <div class="border card border-primary-200 dark:border-primary-700 bg-primary-50/30 dark:bg-primary-900/10">
          <div class="flex items-center gap-2 mb-5">
            <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-primary-100 dark:bg-primary-900">
              <ClipboardList class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="font-bold text-secondary-900 dark:text-white">Deskripsi Pekerjaan</h2>
              <p class="text-xs text-secondary-500 dark:text-secondary-400">Tempel deskripsi lowongan yang ingin dilamar</p>
            </div>
          </div>
          <textarea v-model="jobDesc" rows="6" class="mb-4 text-sm resize-none input"
            placeholder="Tempel deskripsi pekerjaan di sini..."></textarea>
          <button @click="handleGenerate" :disabled="generating || !jobDesc.trim()"
            class="flex items-center justify-center w-full gap-2 btn-primary py-3 shadow-lg shadow-primary-500/25 hover:-translate-y-0.5 transition-all disabled:translate-y-0">
            <LoadingSpinner v-if="generating" size="sm" />
            <span v-else class="flex items-center gap-2 font-semibold">
              <Sparkles class="w-4 h-4" />
              Generate dengan AI
            </span>
          </button>
        </div>
      </div>

      <!-- Right: Preview -->
      <div class="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">

        <!-- Match Score -->
        <div v-if="matchResult" class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-xl dark:bg-green-900">
              <TrendingUp class="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h2 class="font-bold text-secondary-900 dark:text-white">Skor Kecocokan</h2>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <div class="relative w-20 h-20 shrink-0">
              <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" :stroke="scoreColor" stroke-width="3"
                  stroke-dasharray="100" :stroke-dashoffset="100 - matchResult.score" stroke-linecap="round" />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-secondary-900 dark:text-white">
                {{ matchResult.score }}
              </span>
            </div>
            <div class="flex flex-col flex-1 gap-2">
              <div v-for="(val, key) in matchResult.breakdown" :key="key">
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-xs text-secondary-500 dark:text-secondary-400">{{ breakdownLabel(key) }}</span>
                  <span class="text-xs font-bold text-secondary-700 dark:text-secondary-300">{{ val }}%</span>
                </div>
                <div class="h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-500 rounded-full"
                    :class="val >= 75 ? 'bg-green-500' : val >= 50 ? 'bg-yellow-500' : 'bg-red-400'"
                    :style="{ width: `${val}%` }"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="matchResult.missingKeywords?.length" class="mb-3">
            <p class="mb-2 text-xs font-semibold tracking-wide uppercase text-secondary-600 dark:text-secondary-400">Kata Kunci Kurang</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="kw in matchResult.missingKeywords" :key="kw" class="badge badge-danger">{{ kw }}</span>
            </div>
          </div>
          <div v-if="matchResult.suggestions?.length">
            <p class="mb-2 text-xs font-semibold tracking-wide uppercase text-secondary-600 dark:text-secondary-400">Saran Perbaikan</p>
            <ul class="flex flex-col gap-1.5">
              <li v-for="s in matchResult.suggestions" :key="s"
                class="flex items-start gap-2 p-2 text-xs rounded-lg text-secondary-600 dark:text-secondary-400 bg-yellow-50 dark:bg-yellow-900/20">
                <Lightbulb class="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                {{ s }}
              </li>
            </ul>
          </div>
        </div>

        <!-- CV Preview -->
        <div class="border card border-secondary-100 dark:border-secondary-700">
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center justify-center w-8 h-8 rounded-xl bg-secondary-100 dark:bg-secondary-700">
              <Eye class="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h2 class="font-bold text-secondary-900 dark:text-white">Pratinjau</h2>
          </div>

          <div class="p-6 text-sm leading-relaxed bg-white border shadow-inner dark:bg-secondary-900 rounded-2xl border-secondary-100 dark:border-secondary-700">
            <div class="pb-4 mb-5 text-center border-b border-secondary-100 dark:border-secondary-700">
              <p class="text-base font-extrabold tracking-tight text-secondary-900 dark:text-white">
                {{ previewData.personalInfo?.name || 'Nama Kamu' }}
              </p>
              <p class="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                {{ [previewData.personalInfo?.email, previewData.personalInfo?.phone,
                previewData.personalInfo?.address].filter(Boolean).join(' · ') }}
              </p>
            </div>

            <div v-if="previewData.summary" class="mb-4">
              <p class="mb-2 text-xs font-extrabold tracking-widest uppercase text-secondary-700 dark:text-secondary-300">Ringkasan</p>
              <p class="text-xs leading-relaxed text-secondary-600 dark:text-secondary-400">{{ previewData.summary }}</p>
            </div>

            <div v-if="previewData.experience?.length" class="mb-4">
              <p class="mb-2 text-xs font-extrabold tracking-widest uppercase text-secondary-700 dark:text-secondary-300">Pengalaman</p>
              <div v-for="exp in previewData.experience" :key="exp.company" class="mb-3">
                <div class="flex items-start justify-between">
                  <p class="text-xs font-bold text-secondary-800 dark:text-secondary-200">{{ exp.position }}</p>
                  <p class="ml-2 text-xs text-secondary-400 shrink-0">{{ exp.startDate }} - {{ exp.isCurrent ? 'Sekarang' : exp.endDate }}</p>
                </div>
                <p class="mb-1 text-xs font-semibold text-primary-600 dark:text-primary-400">{{ exp.company }}</p>
                <ul v-if="exp.description?.length" class="space-y-0.5">
                  <li v-for="d in exp.description" :key="d" class="text-xs text-secondary-600 dark:text-secondary-400 flex items-start gap-1.5">
                    <span class="text-primary-400 mt-0.5">•</span>{{ d }}
                  </li>
                </ul>
              </div>
            </div>

            <div v-if="previewData.education?.length" class="mb-4">
              <p class="mb-2 text-xs font-extrabold tracking-widest uppercase text-secondary-700 dark:text-secondary-300">Pendidikan</p>
              <div v-for="edu in previewData.education" :key="edu.institution" class="mb-2">
                <p class="text-xs font-bold text-secondary-800 dark:text-secondary-200">{{ edu.institution }}</p>
                <p class="text-xs text-secondary-500 dark:text-secondary-400">{{ edu.degree }}{{ edu.field ? ' — ' + edu.field : '' }}</p>
              </div>
            </div>

            <div v-if="previewData.skills?.length">
              <p class="mb-2 text-xs font-extrabold tracking-widest uppercase text-secondary-700 dark:text-secondary-300">Keahlian</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="skill in previewData.skills" :key="skill"
                  class="text-xs bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-lg border border-primary-100 dark:border-primary-800">
                  {{ skill }}
                </span>
              </div>
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
  X, Eye, Lightbulb, CheckCircle, ScanSearch, FileDown, TrendingUp, BarChart2
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
  summary: '',
  experience: [],
  education: [],
  skills: []
})

const previewData = computed(() => currentResume.value?.generatedCv || form.value)

const scoreColor = computed(() => {
  const score = matchResult.value?.score || 0
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#f59e0b'
  return '#ef4444'
})

const statusBadge = (status) => ({
  DRAFT: 'badge badge-warning',
  GENERATED: 'badge badge-success',
  EXPORTED: 'badge badge-info'
}[status] || 'badge')

const statusLabel = (status) => ({
  DRAFT: 'Draft',
  GENERATED: 'Digenerate',
  EXPORTED: 'Diekspor'
}[status] || 'Draft')

const breakdownLabel = (key) => ({
  skills: 'Keahlian',
  experience: 'Pengalaman',
  education: 'Pendidikan'
}[key] || key)

const addExperience = () => {
  form.value.experience.push({
    company: '', position: '', startDate: '', endDate: '',
    isCurrent: false, descriptionText: '', description: []
  })
}

const removeExperience = async (index) => {
  const confirmed = await open({
    title: 'Hapus Pengalaman',
    message: 'Apakah kamu yakin ingin menghapus pengalaman kerja ini?',
    confirmText: 'Hapus', cancelText: 'Batal', type: 'danger'
  })
  if (!confirmed) return
  form.value.experience.splice(index, 1)
  success('Pengalaman kerja berhasil dihapus')
}

const addEducation = () => {
  form.value.education.push({
    institution: '', degree: '', field: '', gpa: '', startDate: '', endDate: ''
  })
}

const removeEducation = async (index) => {
  const confirmed = await open({
    title: 'Hapus Pendidikan',
    message: 'Apakah kamu yakin ingin menghapus data pendidikan ini?',
    confirmText: 'Hapus', cancelText: 'Batal', type: 'danger'
  })
  if (!confirmed) return
  form.value.education.splice(index, 1)
  success('Data pendidikan berhasil dihapus')
}

const addSkill = () => {
  const skill = skillInput.value.trim()
  if (!skill) return
  if (form.value.skills.includes(skill)) {
    warning('Skill sudah ditambahkan')
    return
  }
  form.value.skills.push(skill)
  skillInput.value = ''
}

const removeSkill = (index) => {
  form.value.skills.splice(index, 1)
}

const buildCvBase = () => ({
  ...form.value,
  experience: form.value.experience.map((exp) => ({
    ...exp,
    description: exp.descriptionText
      ? exp.descriptionText.split('\n').filter(Boolean)
      : exp.description
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
    } catch {
      autoSaveStatus.value = ''
    }
  }, 30000)
}

const stopAutoSave = () => {
  if (autoSaveTimer) { clearInterval(autoSaveTimer); autoSaveTimer = null }
}

const handleSave = async () => {
  try {
    await update(route.params.id, { cvBase: buildCvBase() })
    success('CV berhasil disimpan')
  } catch {
    error('Gagal menyimpan CV, coba lagi')
  }
}

const handleGenerate = async () => {
  if (!jobDesc.value || jobDesc.value.trim().length < 10) {
    warning('Deskripsi pekerjaan minimal 10 karakter')
    return
  }
  const confirmed = await open({
    title: 'Generate dengan AI',
    message: 'AI akan menulis ulang CV kamu berdasarkan deskripsi pekerjaan. Lanjutkan?',
    confirmText: 'Generate', cancelText: 'Batal', type: 'info'
  })
  if (!confirmed) return
  try {
    await update(route.params.id, { cvBase: buildCvBase() })
    info('Sedang memproses dengan AI...')
    await generate(route.params.id, jobDesc.value)
    success('CV berhasil digenerate dengan AI')
  } catch {
    error('Gagal generate CV, coba lagi')
  }
}

const handleRegenerateSection = async (section, index) => {
  const sectionLabel = { summary: 'ringkasan profesional', experience: 'pengalaman kerja', skills: 'keahlian' }[section]
  const confirmed = await open({
    title: 'Buat Ulang Bagian',
    message: `AI akan membuat ulang ${sectionLabel} kamu. Lanjutkan?`,
    confirmText: 'Buat Ulang', cancelText: 'Batal', type: 'info'
  })
  if (!confirmed) return
  try {
    info('Sedang memproses...')
    await regenerateSection(route.params.id, section, index)
    success(`Bagian ${sectionLabel} berhasil dibuat ulang`)
  } catch {
    error('Gagal membuat ulang bagian, coba lagi')
  }
}

const handleExport = async () => {
  const confirmed = await open({
    title: 'Ekspor PDF',
    message: 'CV akan diekspor ke format PDF. Lanjutkan?',
    confirmText: 'Ekspor', cancelText: 'Batal', type: 'info'
  })
  if (!confirmed) return
  try {
    info('Sedang mengekspor CV...')
    await exportResume(route.params.id)
    success('CV berhasil diekspor')
  } catch {
    error('Gagal mengekspor CV, coba lagi')
  }
}

const populateForm = (resume) => {
  if (!resume) return
  const cv = resume.generatedCv || resume.cvBase
  form.value = {
    personalInfo: cv.personalInfo || { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: cv.summary || '',
    experience: (cv.experience || []).map((exp) => ({
      ...exp, descriptionText: (exp.description || []).join('\n')
    })),
    education: cv.education || [],
    skills: cv.skills || []
  }
  if (resume.jobDesc) jobDesc.value = resume.jobDesc
}

const handleParsed = (data) => {
  form.value = {
    personalInfo: data.personalInfo || { name: '', email: '', phone: '', address: '', linkedin: '', website: '' },
    summary: data.summary || '',
    experience: (data.experience || []).map((exp) => ({
      ...exp, descriptionText: (exp.description || []).join('\n')
    })),
    education: data.education || [],
    skills: data.skills || []
  }
  success('CV berhasil diparse, form sudah terisi')
}

watch(currentResume, (val) => populateForm(val))

onMounted(async () => {
  try {
    await fetchById(route.params.id)
    startAutoSave()
  } catch {
    error('Gagal memuat CV, coba lagi')
  }
})

onUnmounted(() => stopAutoSave())
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>