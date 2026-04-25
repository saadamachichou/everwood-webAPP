"use client"

import { useContext, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { GitBranch, Link2, Camera, Headphones, Mail } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import { fadeInUp, staggerContainer, slideLeft, slideRight, ease } from '@/lib/taha/animations'
import MagneticButton from './MagneticButton'
import { FrequencyBars } from './SoundWave'
import { cn } from '@/lib/utils'

const schemaFr = z.object({
  name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  projectType: z.string().min(1, 'Veuillez sélectionner un type de projet'),
  message: z.string().min(20, 'Le message doit comporter au moins 20 caractères'),
})

const schemaEn = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  projectType: z.string().min(1, 'Please select a project type'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schemaFr>

const socialLinks = [
  { href: '#', label: 'GitHub',     icon: GitBranch },
  { href: '#', label: 'LinkedIn',   icon: Link2     },
  { href: '#', label: 'Instagram',  icon: Camera    },
  { href: '#', label: 'SoundCloud', icon: Headphones},
]

export default function ContactSection() {
  const { lang, t } = useContext(I18nContext)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const [submitting, setSubmitting] = useState(false)

  const schema = lang === 'fr' ? schemaFr : schemaEn

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const result = schema.safeParse(data)
    if (!result.success) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    reset()
    toast.success(t(labels.form.success.fr, labels.form.success.en), {
      style: { background: '#0D0D1A', color: '#fff', border: '1px solid rgba(26,111,255,0.3)' },
    })
  }

  const projectTypes = [
    { value: 'sound-design', ...labels.form.projectTypes.soundDesign },
    { value: 'music-comp',   ...labels.form.projectTypes.musicComp   },
    { value: 'post-prod',    ...labels.form.projectTypes.postProd    },
    { value: 'installation', ...labels.form.projectTypes.installation},
    { value: 'branding',     ...labels.form.projectTypes.branding    },
    { value: 'other',        ...labels.form.projectTypes.other       },
  ]

  const inputClasses = cn(
    'w-full rounded-xl border bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white placeholder-[#555568] transition-all duration-300 outline-none',
    'border-[rgba(255,255,255,0.1)] focus:border-[#1A6FFF] focus:bg-[rgba(26,111,255,0.04)] focus:shadow-[0_0_0_3px_rgba(26,111,255,0.1)]',
  )

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-[100svh] flex flex-col items-center justify-center py-24 md:py-36 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 100%, rgba(26,111,255,0.09) 0%, transparent 70%)',
        }}
      />

      {/* Frequency bars at bottom */}
      <FrequencyBars
        className="absolute bottom-0 inset-x-0 h-40"
        barCount={48}
        color="#1A6FFF"
        opacity={0.06}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10">

        {/* ── Header ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-14 md:mb-18"
        >
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="inline-flex items-center gap-3 mb-7"
          >
            <span className="block w-8 h-px bg-[#1A6FFF]" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-[#1A6FFF] font-[var(--font-mono)]">
              {t('Contact', 'Contact')}
            </span>
            <span className="block w-8 h-px bg-[#1A6FFF]" />
          </motion.div>

          <motion.h2
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="font-[var(--font-syne)] font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {t(labels.sections.contact.fr, labels.sections.contact.en)}
          </motion.h2>

          <motion.p
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="text-[#8888AA] text-sm md:text-base max-w-md mx-auto leading-relaxed"
          >
            {t(labels.sections.contactSubtitle.fr, labels.sections.contactSubtitle.en)}
          </motion.p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

          {/* Left — Info panel */}
          <motion.div
            variants={shouldReduceMotion ? {} : slideLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Email */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.018)] p-6">
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#555568] font-[var(--font-mono)] mb-3">
                {t('Email direct', 'Direct email')}
              </p>
              <a
                href="mailto:hello@taha.studio"
                className="group inline-flex items-center gap-1.5 text-white hover:text-[#1A6FFF] transition-colors duration-300 font-[var(--font-syne)] font-semibold text-base"
              >
                <Mail size={14} className="text-[#1A6FFF] flex-shrink-0" />
                hello@taha.studio
              </a>
            </div>

            {/* Social icons — icon-only row */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.018)] p-6">
              <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#555568] font-[var(--font-mono)] mb-4">
                {t('Réseaux sociaux', 'Social media')}
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group flex flex-col items-center gap-2 focus-visible:outline-none"
                  >
                    <span className="w-14 h-14 rounded-2xl border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#8888AA] group-hover:text-white group-hover:border-[rgba(26,111,255,0.5)] group-hover:bg-[rgba(26,111,255,0.1)] group-hover:shadow-[0_0_20px_rgba(26,111,255,0.2)] transition-all duration-300">
                      <Icon size={22} />
                    </span>
                    <span className="text-[0.58rem] tracking-[0.15em] uppercase text-[#444458] group-hover:text-[#1A6FFF] transition-colors duration-300 font-[var(--font-mono)]">
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-[rgba(0,245,212,0.15)] bg-[rgba(0,245,212,0.04)]">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5D4] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5D4]" />
              </span>
              <span className="text-[0.75rem] text-[#00F5D4] font-medium">
                {t('Disponible pour de nouveaux projets', 'Available for new projects')}
              </span>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            variants={shouldReduceMotion ? {} : slideRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.018)] p-7 md:p-9 flex flex-col gap-5"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[0.68rem] font-medium tracking-wide uppercase text-[#8888AA] mb-2"
                  >
                    {t(labels.form.name.fr, labels.form.name.en)}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    className={inputClasses}
                    placeholder={t('Jean Dupont', 'John Smith')}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    {...register('name', { required: t('Ce champ est requis', 'This field is required'), minLength: 2 })}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="text-[0.68rem] text-[#ff6b6b] mt-1.5" role="alert">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[0.68rem] font-medium tracking-wide uppercase text-[#8888AA] mb-2"
                  >
                    {t(labels.form.email.fr, labels.form.email.en)}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    className={inputClasses}
                    placeholder="vous@exemple.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    {...register('email', {
                      required: t('Ce champ est requis', 'This field is required'),
                      pattern: { value: /^\S+@\S+\.\S+$/, message: t('Email invalide', 'Invalid email') },
                    })}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="text-[0.68rem] text-[#ff6b6b] mt-1.5" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Project type */}
              <div>
                <label
                  htmlFor="contact-project"
                  className="block text-[0.68rem] font-medium tracking-wide uppercase text-[#8888AA] mb-2"
                >
                  {t(labels.form.projectType.fr, labels.form.projectType.en)}
                </label>
                <select
                  id="contact-project"
                  className={cn(inputClasses, 'cursor-pointer appearance-none')}
                  aria-invalid={!!errors.projectType}
                  aria-describedby={errors.projectType ? 'contact-project-error' : undefined}
                  {...register('projectType', { required: t('Ce champ est requis', 'This field is required') })}
                >
                  <option value="" disabled>
                    {t('Sélectionner...', 'Select...')}
                  </option>
                  {projectTypes.map((pt) => (
                    <option key={pt.value} value={pt.value} className="bg-[#0D0D1A]">
                      {lang === 'fr' ? pt.fr : pt.en}
                    </option>
                  ))}
                </select>
                {errors.projectType && (
                  <p id="contact-project-error" className="text-[0.68rem] text-[#ff6b6b] mt-1.5" role="alert">
                    {errors.projectType.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[0.68rem] font-medium tracking-wide uppercase text-[#8888AA] mb-2"
                >
                  {t(labels.form.message.fr, labels.form.message.en)}
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  className={cn(inputClasses, 'resize-none')}
                  placeholder={t(
                    'Décrivez votre projet, vos objectifs, et votre timeline...',
                    'Describe your project, goals, and timeline...',
                  )}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  {...register('message', {
                    required: t('Ce champ est requis', 'This field is required'),
                    minLength: { value: 20, message: t('Minimum 20 caractères', 'Minimum 20 characters') },
                  })}
                />
                {errors.message && (
                  <p id="contact-message-error" className="text-[0.68rem] text-[#ff6b6b] mt-1.5" role="alert">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <MagneticButton
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full justify-center py-3.5 text-[0.82rem] tracking-[0.08em]"
                aria-label={t('Envoyer le message', 'Send message')}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('Envoi en cours...', 'Sending...')}
                  </span>
                ) : (
                  <>
                    {t(labels.form.submit.fr, labels.form.submit.en)}
                    <Mail size={14} className="ml-2" />
                  </>
                )}
              </MagneticButton>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
