// ==============================
// IMPORTS
// ==============================
import React, { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, AlertTriangle, X } from 'lucide-react';

// Importar el Sidebar reutilizable
import Sidebar from '../components/Sidebar';

// ==============================
// COMPONENTE PRINCIPAL - INVENTARIO
// ==============================
export default function Inventory() {
  /* =========================
     ESTADOS - Estado inicial de productos
  ========================== */
  // Estado de productos con algunos datos de ejemplo
  const [products, setProducts] = useState([
    { id: 1, name: "Shampoo Sedal", category: "Cuidado Capilar", price: 2500, stock: 15, minStock: 5 },
    { id: 2, name: "Tintura Loreal", category: "Coloración", price: 4800, stock: 3, minStock: 5 },
    { id: 3, name: "Crema Nivea", category: "Cuidado Personal", price: 3200, stock: 8, minStock: 5 },
  ]);
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para la categoría seleccionada en el filtro
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // Estado para controlar la visibilidad del modal de agregar/editar
  const [showModal, setShowModal] = useState(false);
  
  // Estado para saber qué producto se está editando (null si es nuevo)
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado del formulario de producto
  const [form, setForm] = useState({ name: "", category: "Varios", price: "", stock: "", minStock: "" });

  /* =========================
     FILTROS
  ========================== */
  // Crear array de categorías únicas desde los productos existentes
  const categories = ["Todos", ...new Set(products.map((p) => p.category))];

  // Filtrar productos según búsqueda y categoría seleccionada
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  /* =========================
     STATS - Estadísticas del inventario
  ========================== */
  // Calcular valor total del inventario (precio × stock de cada producto)
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  // Contar productos con stock bajo (menor o igual al mínimo)
  const lowStock = products.filter((p) => p.stock <= p.minStock).length;

  /* =========================
     CRUD - Operaciones de creación, lectura, actualización y eliminación
  ========================== */
  // Abrir modal para crear un nuevo producto
  const openNewProduct = () => {
    setEditingProduct(null);
    setForm({ name: "", category: "Varios", price: "", stock: "", minStock: "" });
    setShowModal(true);
  };

  // Abrir modal para editar un producto existente
  const openEditProduct = (product) => {
    setEditingProduct(product);
    setForm(product);
    setShowModal(true);
  };

  // Guardar producto (crear nuevo o actualizar existente)
  const saveProduct = () => {
    if (!form.name || !form.price || !form.stock) return;

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === form.id ? { ...form, price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) || 5 } : p)));
    } else {
      setProducts([...products, { ...form, id: Date.now(), price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) || 5 }]);
    }
    setShowModal(false);
  };

  // Eliminar un producto del inventario
  const deleteProduct = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Incrementar stock de un producto en 1 unidad
  const addStock = (id) => {
    setProducts(products.map((p) => p.id === id ? { ...p, stock: p.stock + 1 } : p));
  };

  /* =========================
     UI - Interfaz de usuario
  ========================== */
  return (
    <div className="flex h-screen bg-slate-950">
      {/* SIDEBAR REUTILIZABLE */}
      <Sidebar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Inventario</h1>
            <p className="text-slate-400">Gestiona el inventario del almacén. Total de productos: {products.length}</p>
          </div>

          {/* Badges de estadísticas */}
          <div className="flex gap-3 mb-8 items-center flex-wrap">
            <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg font-medium">
              Total: {products.length} productos
            </div>
            <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium">
              Stock bajo: {lowStock}
            </div>
            <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium">
              Valor: ${totalValue.toLocaleString()}
            </div>
            <button 
              onClick={openNewProduct}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo Producto
            </button>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-slate-400" />
              <input 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Buscar producto..." 
                className="w-full pl-12 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div key={p.id} className={`rounded-xl p-6 border-2 ${p.stock <= p.minStock ? "border-red-500" : "border-green-500"} bg-slate-800`}>
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{p.category}</p>

                <div className="bg-slate-900/50 p-3 rounded-lg mb-4 space-y-1 text-white">
                  <p>Stock: <b>{p.stock}</b></p>
                  <p>Mínimo: <b>{p.minStock}</b></p>
                  <p>Precio: <b>${p.price.toLocaleString()}</b></p>
                </div>

                {p.stock <= p.minStock && (
                  <p className="flex items-center text-red-400 text-sm mb-3">
                    <AlertTriangle size={16} className="mr-1" />
                    Stock bajo
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addStock(p.id)} className="bg-green-600 py-2 rounded-lg hover:bg-green-700 transition text-white">+ Stock</button>
                  <button onClick={() => openEditProduct(p)} className="bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition text-white">
                    <Edit size={16} className="inline mr-1" />Editar
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="bg-red-600 py-2 rounded-lg col-span-2 hover:bg-red-700 transition text-white">
                    <Trash2 size={16} className="inline mr-1" />Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Estado vacío */}
          {filteredProducts.length === 0 && (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500">
              <Package size={64} />
              <p className="mt-2">No hay productos</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL - Formulario para agregar/editar producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[420px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
                <p className="text-slate-400 text-sm">Completá los datos del producto</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Nombre del producto</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Shampoo Sedal" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Categoría</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option>Varios</option>
                  <option>Cuidado Capilar</option>
                  <option>Coloración</option>
                  <option>Cuidado Personal</option>
                  <option>Alimentos</option>
                  <option>Bebidas</option>
                  <option>Limpieza</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Precio</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Stock inicial</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Stock mínimo</label>
                <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} placeholder="5" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition">Cancelar</button>
              <button onClick={saveProduct} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}