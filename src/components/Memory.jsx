import { motion } from 'framer-motion'

const memories = [
  'Capture the first chai at dawn.',
  'Record a 10-second mountain wind audio clip.',
  'Take one portrait near the backwaters at golden hour.',
]

function Memory({ phase }) {
  const heading =
    phase === 'after' ? 'Memory Capsule Filled' : 'Memory Capsule Waiting'

  return (
    <section className="section-shell p-5 md:p-7">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="font-display text-3xl text-white"
      >
        {heading}
      </motion.h2>

      <div className="mt-5 grid gap-3">
        {memories.map((line, index) => (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card flex items-center gap-3 p-4"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs text-white">
              {index + 1}
            </span>
            <p className="text-sm text-slate-100">{line}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Memory
