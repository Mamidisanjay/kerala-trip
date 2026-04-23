import { motion } from 'framer-motion'

const routePoints = [
  { name: 'Departure', left: '8%', top: '66%' },
  { name: 'Kochi', left: '34%', top: '42%' },
  { name: 'Munnar', left: '56%', top: '34%' },
  { name: 'Alleppey', left: '82%', top: '54%' },
]

function JourneyMap({ phase }) {
  return (
    <section className="section-shell relative overflow-hidden p-5 md:p-7">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="font-display text-3xl text-white"
      >
        Route Sketch
      </motion.h2>

      <div className="relative mt-6 h-52 rounded-2xl border border-white/20 bg-black/20 sm:h-64">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute left-[10%] top-1/2 h-1 w-[78%] origin-left rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-emerald-300"
        />

        {routePoints.map((point, index) => (
          <motion.div
            key={point.name}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: point.left, top: point.top }}
          >
            <div className="h-4 w-4 rounded-full border border-white/50 bg-white shadow-glow" />
            <div className="mt-2 whitespace-nowrap text-xs font-medium text-slate-100">{point.name}</div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-sm text-slate-200">
        {phase === 'after'
          ? 'Route complete. Time to collect photos, laughter, and stories.'
          : 'The line lights up as the trip moves from platform to palm-lined waters.'}
      </p>
    </section>
  )
}

export default JourneyMap
