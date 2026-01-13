
import React, { useState } from 'react';
import { Product, Order, Wilaya, SHIPPING_COSTS, OrderStatus } from '../types';
import { X, CheckCircle, Truck, Phone, User, MapPin } from 'lucide-react';
import { sendOrderToTelegram } from '../services/telegramService';

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ product, onClose, onOrderSuccess }) => {
  const [step, setStep] = useState<'details' | 'form' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wilaya: Wilaya.ALGER,
    baladiya: ''
  });

  const selectedShipping = SHIPPING_COSTS[formData.wilaya] || SHIPPING_COSTS.default;
  const total = product.price + selectedShipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const order: Order = {
      id: Date.now().toString(),
      customerName: formData.name,
      phone: formData.phone,
      wilaya: formData.wilaya,
      baladiya: formData.baladiya,
      productName: product.name,
      totalPrice: total,
      date: new Date().toLocaleDateString('ar-DZ'),
      status: OrderStatus.PENDING
    };

    const telegramSuccess = await sendOrderToTelegram(order);
    setLoading(false);
    
    if (telegramSuccess) {
      onOrderSuccess(order);
      setStep('success');
    } else {
      alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 left-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <X size={20} />
        </button>

        {step === 'details' && (
          <div className="animate-fade-in">
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-sm font-semibold">{product.color}</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-gray-400 text-sm font-bold">السعر</p>
                  <p className="text-2xl font-black text-gold-600">{product.price.toLocaleString()} دج</p>
                </div>
                <button 
                  onClick={() => setStep('form')}
                  className="bg-gold-600 text-white px-8 py-3 rounded-xl font-black hover:bg-gold-700 shadow-lg shadow-gold-200 transition-all active:scale-95"
                >
                  اطلب الآن
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="p-8">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Truck className="text-gold-600" /> اتمام الطلب
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text" placeholder="الاسم الكامل" required
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-gray-50 text-black font-medium"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="relative">
                <Phone className="absolute right-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type="tel" placeholder="رقم الهاتف" required
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-gray-50 text-black font-medium"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute right-3 top-3.5 text-gray-400" size={18} />
                <select 
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none appearance-none bg-gray-50 font-bold text-black"
                  value={formData.wilaya} onChange={e => setFormData({...formData, wilaya: e.target.value as Wilaya})}
                >
                  {Object.values(Wilaya).map(w => <option key={w} value={w} className="text-black">{w}</option>)}
                </select>
              </div>
              <div className="relative">
                <MapPin className="absolute right-3 top-3.5 text-gray-400" size={18} />
                <input 
                  type="text" placeholder="البلدية" required
                  className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-gray-50 text-black font-medium"
                  value={formData.baladiya} onChange={e => setFormData({...formData, baladiya: e.target.value})}
                />
              </div>

              <div className="bg-gray-100 p-5 rounded-2xl mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold">سعر المنتج:</span>
                  <span className="font-black text-black">{product.price.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold">سعر التوصيل:</span>
                  <span className="font-black text-black">{selectedShipping} دج</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between text-xl font-black text-gold-600">
                  <span>الإجمالي:</span>
                  <span>{total.toLocaleString()} دج</span>
                </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-black text-lg hover:bg-gold-700 disabled:opacity-50 transition-all shadow-xl"
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">تم استلام طلبك!</h2>
            <p className="text-gray-600 mb-8 font-medium">سوف يتم التواصل معكم في أقرب وقت لتأكيد الطلب. شكراً لثقتكم في AM Store.</p>
            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-black transition-colors shadow-lg"
            >
              العودة للمتجر
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
