import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useSelector } from 'react-redux'
import { selectCartTotal, selectCartCount } from '@/redux/slices/cartSlice'
import { formatPrice } from '@/utils/helpers'
import GlassCard from '@/components/ui/GlassCard'
import FloatingLabel from '@/components/ui/FloatingLabel'
import MagneticButton from '@/components/ui/MagneticButton'

const STEPS = ['Address', 'Shipping', 'Payment', 'Confirmation']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '', shipping: 'standard', payment: 'upi' })

  useEffect(() => { document.title = 'Checkout | STYLEX' }, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-24 pb-16 min-h-screen">
      <div className="container-premium max-w-4xl mx-auto">
        <h1 className="text-white font-display font-bold text-2xl md:text-3xl mb-8 text-center">Checkout</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${i <= step ? 'bg-[#d4af37] text-[#0a0a0f]' : 'bg-white/[0.06] text-white/30 border border-white/10'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 ${i <= step ? 'text-[#d4af37]' : 'text-white/20'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-12 md:w-20 h-[2px] mx-2 mt-[-16px]">
                  <div className={`h-full transition-all duration-500 ${i < step ? 'bg-[#d4af37]' : 'bg-white/10'}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
                {step === 0 && (
                  <GlassCard>
                    <h2 className="text-white font-display font-bold text-lg mb-6">Delivery Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingLabel label="Full Name" value={form.name} onChange={update('name')} required />
                      <FloatingLabel label="Phone Number" value={form.phone} onChange={update('phone')} type="tel" required />
                      <div className="md:col-span-2"><FloatingLabel label="Address" value={form.address} onChange={update('address')} required /></div>
                      <FloatingLabel label="City" value={form.city} onChange={update('city')} required />
                      <FloatingLabel label="State" value={form.state} onChange={update('state')} required />
                      <FloatingLabel label="Pincode" value={form.pincode} onChange={update('pincode')} required />
                    </div>
                  </GlassCard>
                )}

                {step === 1 && (
                  <GlassCard>
                    <h2 className="text-white font-display font-bold text-lg mb-6">Shipping Method</h2>
                    {[
                      { id: 'standard', label: 'Standard Delivery', desc: '5-7 business days', price: 'FREE' },
                      { id: 'express', label: 'Express Delivery', desc: '2-3 business days', price: '₹199' },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer transition-all ${form.shipping === opt.id ? 'border-[#d4af37]/40 bg-[#d4af37]/5' : 'border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.shipping === opt.id ? 'border-[#d4af37]' : 'border-white/20'}`}>
                            {form.shipping === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />}
                          </div>
                          <div><p className="text-white text-sm font-medium">{opt.label}</p><p className="text-white/30 text-xs">{opt.desc}</p></div>
                        </div>
                        <span className={`text-sm font-bold ${opt.price === 'FREE' ? 'text-emerald-400' : 'text-white/60'}`}>{opt.price}</span>
                        <input type="radio" name="shipping" value={opt.id} checked={form.shipping === opt.id} onChange={update('shipping')} className="sr-only" />
                      </label>
                    ))}
                  </GlassCard>
                )}

                {step === 2 && (
                  <GlassCard>
                    <h2 className="text-white font-display font-bold text-lg mb-6">Payment Method</h2>
                    {[
                      { id: 'upi', label: 'UPI', icon: '📱' },
                      { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                      { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                    ].map((opt) => (
                      <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border mb-3 cursor-pointer transition-all ${form.payment === opt.id ? 'border-[#d4af37]/40 bg-[#d4af37]/5' : 'border-white/10 hover:border-white/20'}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.payment === opt.id ? 'border-[#d4af37]' : 'border-white/20'}`}>
                          {form.payment === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />}
                        </div>
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-white text-sm font-medium">{opt.label}</span>
                        <input type="radio" name="payment" value={opt.id} checked={form.payment === opt.id} onChange={update('payment')} className="sr-only" />
                      </label>
                    ))}
                  </GlassCard>
                )}

                {step === 3 && (
                  <GlassCard className="text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                      <span className="text-6xl mb-4 block">🎉</span>
                    </motion.div>
                    <h2 className="text-[#d4af37] font-display font-bold text-2xl mb-2">Order Confirmed!</h2>
                    <p className="text-white/40 text-sm mb-2">Order #STX-{Math.floor(Math.random() * 900000 + 100000)}</p>
                    <p className="text-white/30 text-xs mb-8">We'll send you tracking details via email</p>
                    <MagneticButton variant="gold" href="/shop">Continue Shopping</MagneticButton>
                  </GlassCard>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            {step < 3 && (
              <div className="flex justify-between mt-6">
                <MagneticButton variant="glass" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  Back
                </MagneticButton>
                <MagneticButton variant="gold" onClick={() => setStep(Math.min(3, step + 1))}>
                  {step === 2 ? 'Place Order' : 'Continue'}
                </MagneticButton>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          {step < 3 && (
            <div>
              <GlassCard>
                <h3 className="text-white font-display font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-white/40">Items ({count})</span><span className="text-white/70">{formatPrice(total)}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Shipping</span><span className="text-emerald-400">FREE</span></div>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between"><span className="text-white font-semibold">Total</span><span className="text-[#d4af37] font-bold text-lg">{formatPrice(total)}</span></div>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
