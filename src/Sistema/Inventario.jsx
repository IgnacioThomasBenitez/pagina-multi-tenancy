// Importación de React y hooks necesarios
import React, { useState, useEffect } from "react";
// Hook para navegación entre rutas
import { useNavigate } from "react-router-dom";

// Importación de iconos de lucide-react para la interfaz
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
  X,
} from "lucide-react";

// Componente principal de gestión de Inventario
const Inventory = () => {
  /* =========================
     ESTADOS - Usando localStorage compartido
  ========================== */
  // Estado de productos inicializado desde localStorage compartido
  // Si existe data guardada la parsea, sino inicia con array vacío
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("shared-products");
    return saved ? JSON.parse(saved) : [];
  });
  
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para la categoría seleccionada en el filtro
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // Estado para controlar la visibilidad del modal de agregar/editar
  const [showModal, setShowModal] = useState(false);
  
  // Estado para saber qué producto se está editando (null si es nuevo)
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado del formulario de producto
  const [form, setForm] = useState({
    name: "",
    category: "Varios",
    price: "",
    stock: "",
    minStock: "",
  });

  /* =========================
     PERSISTENCIA - Guardar en localStorage compartido
  ========================== */
  // Efecto que se ejecuta cada vez que cambia el estado de products
  // Guarda automáticamente en localStorage
  useEffect(() => {
    localStorage.setItem("shared-products", JSON.stringify(products));
  }, [products]);

  /* =========================
     SINCRONIZACIÓN - Escuchar cambios desde otras pestañas
  ========================== */
  // Efecto para sincronizar datos entre múltiples pestañas/ventanas
  useEffect(() => {
    // Función manejadora del evento storage
    const handleStorageChange = (e) => {
      // Solo actualiza si el cambio es en la key "shared-products"
      if (e.key === "shared-products" && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
    };

    // Agregar listener del evento storage
    window.addEventListener("storage", handleStorageChange);
    // Cleanup: remover listener al desmontar componente
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /* =========================
     FILTROS
  ========================== */
  // Crear array de categorías únicas desde los productos existentes
  const categories = ["Todos", ...new Set(products.map((p) => p.category))];

  // Filtrar productos según búsqueda y categoría seleccionada
  const filteredProducts = products.filter((p) => {
    // Verificar si el nombre incluye el término de búsqueda (case insensitive)
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Verificar si coincide con la categoría seleccionada
    const matchCategory =
      selectedCategory === "Todos" || p.category === selectedCategory;
    // Devolver solo productos que cumplen ambas condiciones
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
    setEditingProduct(null); // No hay producto en edición
    // Resetear formulario con valores por defecto
    setForm({
      name: "",
      category: "Varios",
      price: "",
      stock: "",
      minStock: "",
    });
    setShowModal(true); // Mostrar modal
  };

  // Abrir modal para editar un producto existente
  const openEditProduct = (product) => {
    setEditingProduct(product); // Guardar referencia del producto a editar
    setForm(product); // Cargar datos del producto en el formulario
    setShowModal(true); // Mostrar modal
  };

  // Guardar producto (crear nuevo o actualizar existente)
  const saveProduct = () => {
    // Validar que los campos obligatorios estén completos
    if (!form.name || !form.price || !form.stock) return;

    if (editingProduct) {
      // ACTUALIZAR: reemplazar producto existente
      setProducts(products.map((p) => (p.id === form.id ? form : p)));
    } else {
      // CREAR: agregar nuevo producto al array
      setProducts([
        ...products,
        {
          ...form,
          id: Date.now(), // Generar ID único usando timestamp
          price: Number(form.price), // Convertir a número
          stock: Number(form.stock), // Convertir a número
          minStock: Number(form.minStock) || 5, // Convertir a número, default 5
        },
      ]);
    }
    setShowModal(false); // Cerrar modal después de guardar
  };

  // Eliminar un producto del inventario
  const deleteProduct = (id) => {
    // Confirmar antes de eliminar
    if (confirm("¿Eliminar producto?")) {
      // Filtrar todos los productos excepto el que se elimina
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Incrementar stock de un producto en 1 unidad
  const addStock = (id) => {
    setProducts(
      products.map((p) => 
        p.id === id ? { ...p, stock: p.stock + 1 } : p
      )
    );
  };

  // Limpiar todo el inventario
  const clearData = () => {
    // Confirmar antes de limpiar
    if (confirm("¿Borrar todo el inventario?")) {
      setProducts([]); // Vaciar array de productos
      localStorage.removeItem("shared-products"); // Eliminar de localStorage
    }
  };

  /* =========================
     UI - Interfaz de usuario
  ========================== */
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* SIDEBAR - Barra lateral con controles y estadísticas */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        {/* Título del módulo */}
        <h2 className="text-blue-400 font-bold text-xl mb-1">Inventario</h2>
        <p className="text-slate-400 text-sm mb-6">Gestión de stock</p>

        {/* Botón para navegar a Ventas */}
        <button
          onClick={() => navigate("/ventas")}
          className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          <Package className="inline mr-2" size={18} /> Ir a Ventas
        </button>
        
        {/* Botón para agregar nuevo producto */}
        <button
          onClick={openNewProduct}
          className="w-full mb-4 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-700"
        >
          <Plus className="inline mr-2" size={18} />
          Nuevo producto
        </button>

        {/* Tarjetas de estadísticas */}
        <div className="space-y-3">
          {/* Total de productos */}
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Productos</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>

          {/* Productos con stock bajo (alerta) */}
          <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg">
            <p className="text-red-400 text-sm">Stock bajo</p>
            <p className="text-2xl font-bold">{lowStock}</p>
          </div>

          {/* Valor total del inventario */}
          <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
            <p className="text-green-400 text-sm">Valor total</p>
            <p className="text-xl font-bold">${totalValue.toLocaleString()}</p>
          </div>

          {/* Selector de categorías para filtrar */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Botón para limpiar todos los datos */}
          <button
            onClick={clearData}
            className="w-full py-2 bg-red-900/40 text-red-400 rounded-lg hover:bg-red-900/60"
          >
            Limpiar datos
          </button>
        </div>
      </div>

      {/* CONTENIDO - Área principal con lista de productos */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-12 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white"
          />
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              // Clase condicional: borde rojo si stock bajo, verde si normal
              className={`rounded-xl p-6 border-2 ${
                p.stock <= p.minStock ? "border-red-500" : "border-green-500"
              } bg-slate-800`}
            >
              {/* Nombre y categoría del producto */}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{p.category}</p>

              {/* Información de stock y precio */}
              <div className="bg-slate-900/50 p-3 rounded-lg mb-4 space-y-1">
                <p>
                  Stock: <b>{p.stock}</b>
                </p>
                <p>
                  Mínimo: <b>{p.minStock}</b>
                </p>
                <p>
                  Precio: <b>${p.price.toLocaleString()}</b>
                </p>
              </div>

              {/* Alerta de stock bajo */}
              {p.stock <= p.minStock && (
                <p className="flex items-center text-red-400 text-sm mb-3">
                  <AlertTriangle size={16} className="mr-1" />
                  Stock bajo
                </p>
              )}

              {/* Botones de acción */}
              <div className="grid grid-cols-2 gap-2">
                {/* Aumentar stock */}
                <button
                  onClick={() => addStock(p.id)}
                  className="bg-green-600 py-2 rounded-lg hover:bg-green-700"
                >
                  + Stock
                </button>
                {/* Editar producto */}
                <button
                  onClick={() => openEditProduct(p)}
                  className="bg-purple-600 py-2 rounded-lg hover:bg-purple-700"
                >
                  <Edit size={16} className="inline mr-1" />
                  Editar
                </button>
                {/* Eliminar producto */}
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-600 py-2 rounded-lg col-span-2 hover:bg-red-700"
                >
                  <Trash2 size={16} className="inline mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Estado vacío - se muestra cuando no hay productos filtrados */}
        {filteredProducts.length === 0 && (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500">
            <Package size={64} />
            <p className="mt-2">No hay productos</p>
          </div>
        )}
      </div>

      {/* MODAL - Formulario para agregar/editar producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-[420px] p-6 shadow-xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {/* Título dinámico según si es edición o creación */}
                <h2 className="text-xl font-bold text-white">
                  {editingProduct ? "Editar producto" : "Nuevo producto"}
                </h2>
                <p className="text-slate-400 text-sm">
                  Completá los datos del producto
                </p>
              </div>
              {/* Botón de cerrar modal */}
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              {/* Campo: Nombre */}
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Nombre del producto
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Shampoo Sedal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Campo: Categoría */}
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Categoría
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Varios</option>
                  <option>Cuidado Capilar</option>
                  <option>Coloración</option>
                  <option>Cuidado Personal</option>
                  <option>Alimentos</option>
                  <option>Bebidas</option>
                  <option>Limpieza</option>
                </select>
              </div>

              {/* Campos: Precio y Stock (en dos columnas) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
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
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Campo: Stock mínimo */}
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Stock mínimo
                </label>
                <input
                  type="number"
                  value={form.minStock}
                  onChange={(e) =>
                    setForm({ ...form, minStock: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Footer del modal con botones de acción */}
            <div className="flex justify-end gap-3 mt-6">
              {/* Botón cancelar */}
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              {/* Botón guardar */}
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

// Exportación del componente
export default Inventory;