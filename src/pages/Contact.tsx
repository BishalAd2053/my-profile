import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/api'
import { motion } from 'framer-motion'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(5),
})
type FormData = z.infer<typeof schema>

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: FormData) => {
    await api.post('/contact', data)
    setSent(true)
    reset()
    setTimeout(()=>setSent(false), 2500)
  }

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-3"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div>
        <label className="block text-sm mb-1">Name</label>
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" {...register('name')} />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" {...register('email')} />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Message</label>
        <textarea rows={5} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10" {...register('body')} />
        {errors.body && <p className="text-xs text-red-400">{errors.body.message}</p>}
      </div>
      <button disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20">
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
      {sent && <motion.div initial={{scale:0}} animate={{scale:1}} className="text-green-400">Thanks! I’ll get back to you.</motion.div>}
    </motion.form>
  )
}
