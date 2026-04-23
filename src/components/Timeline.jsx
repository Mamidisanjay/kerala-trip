import { motion } from 'framer-motion'

const stops = [
  { title: 'Train', icon: '🚆', caption: 'Departure rhythm and steel tracks' },
  { title: 'Kochi', icon: '🌆', caption: 'Harbor lights and spice-scented lanes' },
  { title: 'Munnar', icon: '⛰️', caption: 'Tea hills wrapped in morning mist' },
  { title: 'Alleppey', icon: '🛶', caption: 'Backwaters gliding into sunset' },
]

function Timeline() {
  return (
    <section className="section-shell p-5 md:p-7">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="font-display text-3xl text-white"
      >
        Journey Timeline
      </motion.h2>

      <div className="h-scroll mt-4 flex gap-4 overflow-x-auto pb-2">
        {stops.map((stop, index) => (
          <motion.article
            key={stop.title}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="glass-card min-w-[230px] p-4"
          >
            <div className="text-3xl">{stop.icon}</div>
            <h3 className="mt-3 font-display text-2xl text-white">{stop.title}</h3>
            <p className="mt-2 text-sm text-slate-200">{stop.caption}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default Timeline
