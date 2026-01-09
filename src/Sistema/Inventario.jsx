import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  History,
  Settings,
  AlertTriangle,
  X
} from 'lucide-react';

const Inventory = () => {
  /* =========================
     ESTADOS
  ========================== */
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('inventory-products');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Varios',
    price: '',
    stock: '',
    min: ''
  });

  /* =========================
     PERSISTENCIA
  ========================== */
  useEffect(() => {
    localStorage.setItem('inventory-products', JSON.stringify(products));
  }, [products]);

  /* =========================
     FILTROS
  ========================== */
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  /* =========================
     STATS
  ========================== */
  const totalValue = products.reduce(
    (acc, p) => acc + p.price * p.stock,
    0
  );

  const lowStock = products.filter(p => p.stock <= p.min).length;

  /* =========================
     CRUD
  ========================== */
  const openNewProduct = () => {
    setEditingProduct(null);
    setForm({ name: '', category: 'Varios', price: '', stock: '', min: '' });
    setShowModal(true);
  };

  const openEditProduct = product => {
    setEditingProduct(product);
    setForm(product);
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!form.name || !form.price || !form.stock) return;

    if (editingProduct) {
      setProducts(products.map(p => (p.id === form.id ? form : p)));
    } else {
      setProducts([
        ...products,
        { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock), min: Number(form.min) }
      ]);
    }
    setShowModal(false);
  };

  const deleteProduct = id => {
    if (confirm('¿Eliminar producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const addStock = id => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, stock: p.stock + 1 } : p
    ));
  };

  const clearData = () => {
    if (confirm('¿Borrar todo el inventario?')) {
      setProducts([]);
      localStorage.removeItem('inventory-products');
    }
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <h2 className="text-blue-400 font-bold text-xl mb-1">Inventario</h2>
        <p className="text-slate-400 text-sm mb-6">Gestión de stock</p>

        <button
          onClick={openNewProduct}
          className="w-full mb-4 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700"
        >
          <Plus className="inline mr-2" size={18} />
          Nuevo producto
        </button>

        <div className="space-y-3">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Productos</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>

          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-red-400 text-sm">Stock bajo</p>
            <p className="text-2xl font-bold">{lowStock}</p>
          </div>

          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 text-sm">Valor total</p>
            <p className="text-xl font-bold">
              ${totalValue.toLocaleString()}
            </p>
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          >
            <option>Todos</option>
            <option>Varios</option>
            <option>Alimentos</option>
            <option>Bebidas</option>
          </select>

          <button
            onClick={clearData}
            className="w-full py-2 bg-red-900/40 text-red-400 rounded-lg"
          >
            Limpiar datos
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3 text-slate-400" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-12 py-3 bg-slate-800 rounded-xl border border-slate-700"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {filteredProducts.map(p => (
            <div
              key={p.id}
              className={`rounded-xl p-6 border-2 ${
                p.stock <= p.min ? 'border-red-500' : 'border-green-500'
              } bg-slate-800`}
            >
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{p.category}</p>

              <div className="bg-slate-900/50 p-3 rounded-lg mb-4 space-y-1">
                <p>Stock: <b>{p.stock}</b></p>
                <p>Mínimo: <b>{p.min}</b></p>
                <p>Precio: <b>${p.price}</b></p>
              </div>

              {p.stock <= p.min && (
                <p className="flex items-center text-red-400 text-sm mb-3">
                  <AlertTriangle size={16} className="mr-1" />
                  Stock bajo
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addStock(p.id)}
                  className="bg-green-600 py-2 rounded-lg"
                >
                  + Stock
                </button>
                <button
                  onClick={() => openEditProduct(p)}
                  className="bg-purple-600 py-2 rounded-lg"
                >
                  <Edit size={16} className="inline mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-600 py-2 rounded-lg col-span-2"
                >
                  <Trash2 size={16} className="inline mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500">
            <Package size={64} />
            <p className="mt-2">No hay productos</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[420px] p-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <p className="text-slate-400 text-sm">
            Completá los datos del producto
          </p>
        </div>
        <button
          onClick={() => setShowModal(false)}
          className="text-slate-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Nombre del producto
          </label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Shampoo Sedal"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Categoría
          </label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option>Varios</option>
            <option>Alimentos</option>
            <option>Bebidas</option>
            <option>Limpieza</option>
          </select>
        </div>

        {/* Precio / Stock */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Precio
            </label>
            <input
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="$"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">
              Stock inicial
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Stock mínimo */}
        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Stock mínimo
          </label>
          <input
            type="number"
            value={form.min}
            onChange={e => setForm({ ...form, min: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
        >
          Cancelar
        </button>
        <button
          onClick={saveProduct}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Inventory;
