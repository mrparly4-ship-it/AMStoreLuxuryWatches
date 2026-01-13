
import React, { useState, useEffect, useMemo } from 'react';
import { Product, Order, OrderStatus } from './types';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import { ADMIN_PASSWORD } from './constants';
import { 
  ShoppingBag, Star, Clock, ShieldCheck, Instagram, 
  Phone, Menu, X, Lock, Truck, MapPin, KeyRound, Filter, ArrowUpDown, Music2
} from 'lucide-react';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ساعة رولكس صبمارينر',
    price: 45000,
    description: 'ساعة غوص كلاسيكية فاخرة بقرص أسود وإطار سيراميك متين. دقة متناهية وتصميم خالد.',
    color: 'فضي / أسود',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop',
    category: 'Luxury'
  },
  {
    id: '2',
    name: 'باتيك فيليب نوتيلوس',
    price: 52000,
    description: 'تصميم رياضي أنيق بلمسة عصرية. مثالية للمناسبات الرسمية واليومية.',
    color: 'فضي / أزرق',
    image: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1000&auto=format&fit=crop',
    category: 'Sport'
  },
  {
    id: '3',
    name: 'أوديمار بيجيه رويال أوك',
    price: 38000,
    description: 'ساعة مميزة بإطارها المثمن الشهير، تعكس القوة والأناقة في آن واحد.',
    color: 'أسود مطفي',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1000&auto=format&fit=crop',
    category: 'Classic'
  }
];

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('am_store_products');
    const savedOrders = localStorage.getItem('am_store_orders');
    
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('am_store_products', JSON.stringify(updated));
  };

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('am_store_orders', JSON.stringify(updated));
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === ADMIN_PASSWORD) {
      setShowAdmin(true);
      setIsPasswordModalOpen(false);
      setAdminPassInput('');
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const displayedProducts = useMemo(() => {
    let result = [...products];
    if (categoryFilter !== 'الكل') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }
    return result;
  }, [products, categoryFilter, sortBy]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map(p => p.category)));
    return ['الكل', ...unique];
  }, [products]);

  const TIKTOK_URL = "https://www.tiktok.com/@am_store_dz16?_r=1&_t=ZS-931STvNPTFs";

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-black text-gold-400 p-2 rounded-xl rotate-12 shadow-lg">
              <Clock size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900">AM STORE</h1>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
            {/* Links Removed by User Request */}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <div className="hidden md:flex gap-4">
              <Instagram size={20} className="text-gray-400 hover:text-gold-600 cursor-pointer transition-colors" />
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
                <Music2 size={20} className="text-gray-400 hover:text-gold-600 cursor-pointer transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-white border-b shadow-xl z-30 p-6 flex flex-col gap-5 animate-in slide-in-from-top duration-300">
          <div className="text-center py-4 font-bold text-gray-400">AM Store - مرحباً بك</div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[550px] md:h-[650px] flex items-center justify-center text-white overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1600&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 scale-100 animate-[pulse_10s_infinite]"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-gold-600/20 border border-gold-400/30 text-gold-400 text-xs font-bold tracking-widest mb-6">
            تشكيلة 2024 الفاخرة
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-6 leading-tight">فخامة تليق <br/> <span className="text-gold-500 italic drop-shadow-md">بشخصيتك</span></h2>
          <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            اكتشف عالم الساعات الراقية في AM STORE. جودة عالمية، تصميمات ساحرة، وتوصيل سريع لجميع الولايات الجزائرية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="bg-gold-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gold-500 hover:scale-105 transition-all shadow-2xl shadow-gold-900/40">تصفح المتجر</a>
            <a href="tel:0555000000" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all">اتصل بنا</a>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-20 bg-white border-b">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gold-50 text-gold-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-gold-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <Truck size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">توصيل 58 ولاية</h3>
            <p className="text-gray-500 leading-relaxed">خدمة توصيل موثوقة وسريعة لباب منزلك في أي مكان في الجزائر بأسعار تنافسية.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gold-50 text-gold-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-gold-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <ShieldCheck size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">جودة مضمونة</h3>
            <p className="text-gray-500 leading-relaxed">نضمن لك الحصول على المنتج تماماً كما في الصور، مع فحص شامل لكل ساعة قبل خروجها.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gold-50 text-gold-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-gold-600 group-hover:text-white transition-all duration-500 shadow-sm">
              <Star size={36} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">رضا الزبائن</h3>
            <p className="text-gray-500 leading-relaxed">أكثر من 5000 زبون راضٍ في جميع أنحاء الوطن. خدمتنا تبدأ من الطلب ولا تنتهي إلا برضاكم.</p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">أرقى الساعات</h2>
              <p className="text-gray-500 text-lg">اختر ما يناسب ذوقك من تشكيلتنا الحصرية</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              <div className="bg-gold-50 p-2 rounded-xl text-gold-600 shrink-0">
                <Filter size={20} />
              </div>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                      categoryFilter === cat 
                        ? 'bg-gold-600 text-white shadow-lg shadow-gold-200 scale-105' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0">
              <div className="bg-gray-50 p-2 rounded-xl text-gray-500">
                <ArrowUpDown size={20} />
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer flex-1 lg:flex-none"
              >
                <option value="default">الترتيب الافتراضي</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>

          <div className="mb-8 px-2">
            <p className="text-gray-400 text-sm font-bold">عرض {displayedProducts.length} منتج</p>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {displayedProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-transparent hover:border-gold-100"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gold-600 px-4 py-1 rounded-full text-xs font-black shadow-sm">
                        {product.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                      <button className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ShoppingBag size={20} /> التفاصيل والطلب
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <span className="text-2xl font-black text-gold-600">{product.price.toLocaleString()} دج</span>
                      <div className="bg-gray-100 p-3 rounded-2xl group-hover:bg-gold-50 transition-colors">
                        <ShoppingBag size={24} className="text-gray-400 group-hover:text-gold-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب اختيار فئة أخرى أو تغيير الفرز</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-white pt-24 pb-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-12 mb-12">
            <div className="flex items-center gap-3">
              <div className="bg-white text-black p-2 rounded-xl">
                <Clock size={28} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">AM STORE</h1>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm font-medium">© {new Date().getFullYear()} <span className="text-white">AM STORE</span>. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">بكل فخر من الجزائر</span>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-gray-700/50 hover:text-gold-500 transition-colors focus:outline-none"
                title="Admin Access"
              >
                <Lock size={12} />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProduct && (
        <CheckoutModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onOrderSuccess={(newOrder) => {
            const updatedOrders = [...orders, newOrder];
            saveOrders(updatedOrders);
          }}
        />
      )}

      {/* Custom Admin Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-sm rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mb-4">
                <KeyRound size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">دخول الإدارة</h3>
              <p className="text-gray-500 text-sm mt-1">يرجى إدخال كلمة السر الخاصة بالمتجر</p>
            </div>
            
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  placeholder="كلمة السر"
                  className={`w-full p-4 bg-gray-50 border ${passError ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none text-center font-bold tracking-widest text-black`}
                  value={adminPassInput}
                  onChange={(e) => { setAdminPassInput(e.target.value); setPassError(false); }}
                  autoFocus
                />
                {passError && <p className="text-red-500 text-xs mt-2 font-bold text-center">كلمة السر غير صحيحة!</p>}
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="submit"
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-black hover:bg-gold-700 transition-all shadow-lg"
                >
                  دخول
                </button>
                <button 
                  type="button"
                  onClick={() => { setIsPasswordModalOpen(false); setAdminPassInput(''); setPassError(false); }}
                  className="px-6 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdmin && (
        <AdminPanel 
          products={products}
          orders={orders}
          onAddProduct={(p) => saveProducts([...products, p])}
          onUpdateProduct={(updatedP) => saveProducts(products.map(p => p.id === updatedP.id ? updatedP : p))}
          onDeleteProduct={(id) => saveProducts(products.filter(p => p.id !== id))}
          onUpdateOrder={(id, status) => saveOrders(orders.map(o => o.id === id ? { ...o, status } : o))}
          onDeleteOrder={(id) => saveOrders(orders.filter(o => o.id !== id))}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  );
};

export default App;
