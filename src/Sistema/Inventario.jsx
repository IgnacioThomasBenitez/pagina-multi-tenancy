import React, { useState } from 'react';
import { ShoppingCart, Package, Plus, Search, Edit, Trash2, History, Settings } from 'lucide-react';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const products = [
    { 
      id: 1, 
      name: 'Shampo', 
      category: 'Varios', 
      price: 2600, 
      stock: 50, 
      min: 1 
    }
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <div className="mb-8">
          <h2 className="text-blue-400 font-bold text-xl mb-2">Inventario</h2>
          <p className="text-slate-400 text-sm">Sistema de gestión de stock</p>
        </div>

        <div className="space-y-4">
          {/* Action Buttons */}
          <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
            <ShoppingCart className="inline mr-2" size={18} /> Ir a Ventas
          </button>
          <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
            <Plus className="inline mr-2" size={18} /> Nuevo Producto
          </button>

          {/* Stats Cards */}
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-2">Total Productos</p>
            <p className="text-3xl font-bold text-white">1</p>
          </div>

          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
            <p className="text-red-400 text-sm mb-2">Stock Bajo</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>

          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <p className="text-green-400 text-sm mb-2">Valor Total</p>
            <p className="text-2xl font-bold text-white">$130.000</p>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Filtrar por categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option>Todos</option>
              <option>Varios</option>
              <option>Alimentos</option>
              <option>Bebidas</option>
            </select>
          </div>

          {/* Clear Data Button */}
          <button className="w-full px-4 py-3 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900 transition">
            Limpiar datos
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Inventario</h1>

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

        <p className="text-slate-400 mb-6">Mostrando 1 de 1 productos</p>

        {/* Products Grid */}
        <div className="grid grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-slate-800 border-2 border-green-500 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{product.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{product.category}</p>
                </div>
                <button className="text-slate-400 hover:text-white transition">
                  <Settings size={20} />
                </button>
              </div>

              {/* Product Details */}
              <div className="space-y-2 mb-4 bg-slate-900/50 rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stock actual:</span>
                  <span className="text-white font-bold">{product.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mínimo:</span>
                  <span className="text-white font-bold">{product.min}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Precio:</span>
                  <span className="text-white font-bold">${product.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center">
                  <Plus className="mr-1" size={16} /> Agregar
                </button>
                <button className="py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center">
                  <History className="mr-1" size={16} /> Historial
                </button>
                <button className="py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center">
                  <Edit className="mr-1" size={16} /> Editar
                </button>
                <button className="py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center">
                  <Trash2 className="mr-1" size={16} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (cuando no hay productos) */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <Package size={64} className="mb-4" />
            <p className="text-xl mb-2">No hay productos</p>
            <p className="text-sm">Agrega tu primer producto para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;