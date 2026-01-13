
import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { Plus, X, Trash2, Edit, LayoutDashboard, ShoppingCart, Package, ArrowRight, Save, TrendingUp, Phone } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrder: (id: string, status: OrderStatus) => void;
  onDeleteOrder: (id: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, 
  orders, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  onUpdateOrder, 
  onDeleteOrder,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, description: '', color: '', image: '', category: 'Classic'
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      onAddProduct({
        ...formData,
        id: Date.now().toString(),
        image: formData.image || `https://picsum.photos/600/600?watch=${Date.now()}`
      } as Product);
    }
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', price: 0, description: '', color: '', image: '', category: 'Classic' });
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setShowForm(true);
  };

  const stats = {
    totalSales: orders.filter(o => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.SHIPPED).reduce((acc, o) => acc + o.totalPrice, 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
    stockCount: products.length
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-100 overflow-hidden text-right" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-gold-600 p-2 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-black tracking-tighter text-xl">لوحة التحكم</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-gold-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <TrendingUp size={20} /> الإحصائيات
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-gold-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <Package size={20} /> المنتجات
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-gold-600 text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
          >
            <ShoppingCart size={20} /> الطلبات
          </button>
        </nav>
        <button 
          onClick={onClose}
          className="m-4 p-4 flex items-center gap-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto"
        >
          <ArrowRight size={20} /> خروج
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
          <span className="font-bold">لوحة التحكم</span>
          <button onClick={onClose}><X /></button>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex bg-white border-b overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('stats')} className={`px-6 py-4 flex-none border-b-2 font-bold ${activeTab === 'stats' ? 'border-gold-600 text-gold-600' : 'border-transparent text-gray-500'}`}>الإحصائيات</button>
          <button onClick={() => setActiveTab('products')} className={`px-6 py-4 flex-none border-b-2 font-bold ${activeTab === 'products' ? 'border-gold-600 text-gold-600' : 'border-transparent text-gray-500'}`}>المنتجات</button>
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-4 flex-none border-b-2 font-bold ${activeTab === 'orders' ? 'border-gold-600 text-gold-600' : 'border-transparent text-gray-500'}`}>الطلبات</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border">
                  <p className="text-gray-500 text-sm font-bold mb-2">إجمالي المبيعات</p>
                  <p className="text-3xl font-black text-gold-600">{stats.totalSales.toLocaleString()} دج</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border">
                  <p className="text-gray-500 text-sm font-bold mb-2">عدد الطلبات</p>
                  <p className="text-3xl font-black text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border">
                  <p className="text-gray-500 text-sm font-bold mb-2">طلبات معلقة</p>
                  <p className="text-3xl font-black text-orange-500">{stats.pendingOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border">
                  <p className="text-gray-500 text-sm font-bold mb-2">إجمالي المنتجات</p>
                  <p className="text-3xl font-black text-blue-600">{stats.stockCount}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-black">إدارة المنتجات</h2>
                <button 
                  onClick={() => { setEditingProduct(null); setFormData({name: '', price: 0, description: '', color: '', image: '', category: 'Classic'}); setShowForm(true); }}
                  className="bg-gold-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-gold-700 transition-all shadow-lg shadow-gold-200"
                >
                  <Plus size={20} /> إضافة منتج
                </button>
              </div>

              {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                   <form onSubmit={handleSaveProduct} className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black text-black">{editingProduct ? 'تعديل منتج' : 'منتج جديد'}</h3>
                        <button type="button" onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full text-black"><X /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-500">اسم الساعة</label>
                          <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none text-black font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-500">السعر (دج)</label>
                          <input type="number" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none text-black font-bold" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-500">اللون</label>
                          <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none text-black font-bold" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-500">التصنيف</label>
                          <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none appearance-none text-black font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option value="Classic">كلاسيك</option>
                            <option value="Sport">رياضي</option>
                            <option value="Luxury">فاخر</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-bold text-gray-500">رابط الصورة</label>
                          <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none text-black font-bold" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-bold text-gray-500">الوصف</label>
                          <textarea required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-gold-500 outline-none h-32 text-black font-bold" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>
                      </div>
                      <button type="submit" className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gold-700 transition-all">
                        <Save size={20} /> حفظ البيانات
                      </button>
                   </form>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-6 rounded-3xl border flex flex-col md:flex-row items-center gap-6 shadow-sm">
                    <img src={product.image} className="w-24 h-24 object-cover rounded-2xl" alt="" />
                    <div className="flex-1 text-center md:text-right">
                      <h3 className="font-black text-xl mb-1 text-black">{product.name}</h3>
                      <p className="text-gold-600 font-bold mb-1">{product.price} دج</p>
                      <p className="text-gray-400 text-sm font-bold">{product.color} | {product.category}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(product)} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gold-50 hover:text-gold-600 transition-all"><Edit size={20} /></button>
                      <button onClick={() => { if(confirm('هل أنت متأكد؟')) onDeleteProduct(product.id); }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-500">
               {/* Order Management Title Removed by user request */}
               <div className="space-y-6">
                 {orders.length === 0 && <p className="text-gray-400 text-center py-20 bg-white rounded-3xl border border-dashed">لا توجد طلبات مسجلة حالياً.</p>}
                 {orders.slice().reverse().map(order => (
                   <div key={order.id} className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
                     <div className="flex justify-between items-start border-b pb-4">
                        <div className="text-right">
                          <h3 className="text-xl font-black mb-1 text-black">{order.customerName}</h3>
                          <div className="flex gap-4 text-sm text-gray-500 font-bold">
                            <span className="flex items-center gap-1"><Phone size={14} /> {order.phone}</span>
                            <span>{order.wilaya} - {order.baladiya}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-gray-400 mb-1">{order.date}</p>
                          <p className="text-xl font-black text-gold-600">{order.totalPrice} دج</p>
                        </div>
                     </div>
                     <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-bold text-gray-500">المنتج:</span>
                           <span className="bg-gray-100 px-4 py-2 rounded-xl font-bold text-black">{order.productName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <select 
                            className={`px-4 py-2 rounded-xl font-bold border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-gold-500 outline-none ${
                               order.status === OrderStatus.PENDING ? 'bg-orange-50 text-orange-600' :
                               order.status === OrderStatus.CONFIRMED ? 'bg-green-50 text-green-600' :
                               order.status === OrderStatus.SHIPPED ? 'bg-blue-50 text-blue-600' :
                               'bg-red-50 text-red-600'
                             }`}
                            value={order.status}
                            onChange={(e) => onUpdateOrder(order.id, e.target.value as OrderStatus)}
                           >
                             {Object.values(OrderStatus).map(status => <option key={status} value={status}>{status}</option>)}
                           </select>
                           <button onClick={() => { if(confirm('حذف هذا الطلب؟')) onDeleteOrder(order.id); }} className="p-2 text-red-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
