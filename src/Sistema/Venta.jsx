import React, { useState } from 'react';
import { ShoppingCart, Package, Clock, TrendingUp, Users, AlertCircle, Search, DollarSign, History, Edit, Trash2 } from 'lucide-react';

const Sales = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    { id: 1, name: 'Shampo', category: 'Varios', price: 2600, stock: 49 }
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, qty: item.qty + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <div className="mb-8">
          <h2 className="text-blue-400 font-bold text-xl mb-2">Mi Negocio</h2>
          <p className="text-slate-400 text-sm">Sistema de Ventas</p>
        </div>

        <div className="space-y-4">
          <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
            <ShoppingCart className="inline mr-2" size={18} /> Ventas
          </button>
          <button className="w-full px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition">
            <Package className="inline mr-2" size={18} /> Productos
          </button>

          {/* Stats Cards */}
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Clock size={18} /> Ventas de Hoy
            </div>
            <p className="text-2xl font-bold text-white">$3.675</p>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <TrendingUp size={18} /> Ventas del Mes
            </div>
            <p className="text-2xl font-bold text-white">$3.675</p>
          </div>

          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Users size={18} /> Transacciones Hoy
            </div>
            <p className="text-2xl font-bold text-white">2</p>
          </div>

          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertCircle size={18} /> Alertas de Stock
            </div>
            <p className="text-sm text-slate-300">0 productos con stock bajo</p>
          </div>
        </div>
      </div>

      {/* Main Content - Products */}
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Productos</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">1 disponibles</span>
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition">
              <ShoppingCart className="inline mr-2" size={18} />
              Carrito ({cart.length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="mb-4">
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option>Todos</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{product.category}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Stock disponible</span>
                <span className="text-green-400 font-bold">{product.stock}</span>
              </div>

              <p className="text-3xl font-bold text-green-400 mb-4">
                ${product.price.toLocaleString()}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Agregar
              </button>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                <button className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition">
                  <DollarSign size={18} className="text-white" />
                </button>
                <button className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition">
                  <History size={18} className="text-white" />
                </button>
                <button className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition">
                  <Edit size={18} className="text-white" />
                </button>
                <button className="p-2 bg-red-900/50 rounded hover:bg-red-800 transition">
                  <Trash2 size={18} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 bg-slate-900 border-l border-slate-800 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6">
          {cart.length === 0 ? 'Carrito vacío' : `Carrito (${cart.length})`}
        </h2>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
            <ShoppingCart size={64} className="mb-4" />
            <p>Click en un producto para agregarlo</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto mb-4">
            {cart.map(item => (
              <div key={item.id} className="bg-slate-800 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">{item.name}</h3>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Cantidad: {item.qty}</span>
                  <span className="text-green-400 font-bold">
                    ${(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between py-4 border-t border-slate-700">
            <span className="text-xl font-bold text-white">Total</span>
            <span className="text-2xl font-bold text-green-400">
              ${cartTotal.toLocaleString()}
            </span>
          </div>
          <button className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
          >
            <DollarSign className="inline mr-2" /> Procesar Venta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sales;