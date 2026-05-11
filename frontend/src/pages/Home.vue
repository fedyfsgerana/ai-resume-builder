<template>
    <div>
        <!-- Hero Section -->
        <section class="py-20 text-center">
            <div class="max-w-3xl mx-auto">
                <span class="badge badge-info mb-4">AI-Powered Resume Builder</span>
                <h1 class="text-5xl font-bold text-secondary-900 leading-tight mb-6">
                    Build a Resume That
                    <span class="text-primary-600"> Gets You Hired</span>
                </h1>
                <p class="text-xl text-secondary-500 mb-10 leading-relaxed">
                    Let AI tailor your resume to every job description automatically.
                    Get a higher match score and land more interviews.
                </p>
                <div class="flex items-center justify-center gap-4">
                    <RouterLink to="/auth/register" class="btn-primary px-8 py-3 text-base flex items-center gap-2">
                        <Zap class="w-4 h-4" />
                        Start for Free
                    </RouterLink>
                    <RouterLink to="/auth/login" class="btn-outline px-8 py-3 text-base flex items-center gap-2">
                        <LogIn class="w-4 h-4" />
                        Login
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="py-16">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-secondary-900 mb-4">Why Use AI Resume Builder?</h2>
                <p class="text-secondary-500 max-w-xl mx-auto">
                    Stop spending hours manually editing your resume for each job application.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="feature in features" :key="feature.title" class="card text-center">
                    <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                        <component :is="feature.icon" class="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 class="text-lg font-semibold text-secondary-900 mb-2">{{ feature.title }}</h3>
                    <p class="text-secondary-500 text-sm leading-relaxed">{{ feature.description }}</p>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section class="py-16 bg-white rounded-2xl px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-secondary-900 mb-4">How It Works</h2>
                <p class="text-secondary-500">Get your tailored resume in minutes</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div v-for="(step, index) in steps" :key="step.title" class="text-center">
                    <div
                        class="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center mx-auto mb-4 font-bold">
                        {{ index + 1 }}
                    </div>
                    <div class="flex justify-center mb-3">
                        <component :is="step.icon" class="w-5 h-5 text-primary-500" />
                    </div>
                    <h3 class="font-semibold text-secondary-900 mb-2">{{ step.title }}</h3>
                    <p class="text-secondary-500 text-sm">{{ step.description }}</p>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 text-center">
            <div class="max-w-2xl mx-auto">
                <h2 class="text-3xl font-bold text-secondary-900 mb-4">
                    Ready to Land Your Dream Job?
                </h2>
                <p class="text-secondary-500 mb-8">
                    Join thousands of job seekers who already use AI Resume Builder.
                </p>
                <RouterLink to="/auth/register"
                    class="btn-primary px-10 py-3 text-base flex items-center gap-2 justify-center inline-flex">
                    <Rocket class="w-4 h-4" />
                    Get Started for Free
                </RouterLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { Bot, BarChart2, FileText, Zap, LogIn, Rocket, ClipboardList, Sparkles, Download, FilePen } from 'lucide-vue-next'

const features = [
    {
        icon: Bot,
        title: 'AI-Powered Writing',
        description: 'Our AI rewrites your bullet points and summary to match every job description automatically.'
    },
    {
        icon: BarChart2,
        title: 'Match Score',
        description: 'See how well your resume matches the job description with a detailed score breakdown.'
    },
    {
        icon: FileText,
        title: 'ATS-Friendly Export',
        description: 'Export your resume as a clean, ATS-friendly PDF that passes through applicant tracking systems.'
    }
]

const steps = [
    {
        icon: FilePen,
        title: 'Create Your CV Base',
        description: 'Input your work experience, education, and skills once.'
    },
    {
        icon: ClipboardList,
        title: 'Paste Job Description',
        description: 'Copy and paste the job description you want to apply for.'
    },
    {
        icon: Sparkles,
        title: 'Generate with AI',
        description: 'Our AI tailors your resume to match the job description.'
    },
    {
        icon: Download,
        title: 'Export & Apply',
        description: 'Download your tailored resume as PDF and apply with confidence.'
    }
]
</script>