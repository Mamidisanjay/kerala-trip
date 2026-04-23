import { motion } from 'framer-motion'

const itinerary = [
  {
    day: 'Day 1',
    title: 'Departure + Kochi Arrival',
    details: 'Early train departure, overnight travel, and first sunrise over Kochi skyline.',
  },
  {
    day: 'Day 2',
    title: 'Kochi to Munnar',
    details: 'Scenic uphill drive, tea gardens, and a cool evening among mountain clouds.',
  },
  {
    day: 'Day 3',
    title: 'Munnar to Alleppey',
    details: 'Waterfront check-in, houseboat views, and calm canals lined with palms.',
  },
  {
    day: 'Day 4',
    title: 'Backwaters + Farewell',
    details: 'Slow morning cruise, local cuisine, and one final golden-hour memory.',
  },
]

function DayCards() {
  return (
    <section className="section-shell p-5 md:p-7">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="font-display text-3xl text-white"
      >
        Day-Wise Plan
      </motion.h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {itinerary.map((item, index) => (
          <motion.article
            key={item.day}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card p-5"
          >
            <div className="text-xs uppercase tracking-[0.22em] text-amber-200">{item.day}</div>
            <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
            <p className="mt-3 text-sm text-slate-200">{item.details}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default DayCards
