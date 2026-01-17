import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import {
  ShoppingCart,
  Package,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  Search,
  DollarSign,
  History,
  Edit,
  Trash2,
  Plus,
  Minus,
  X,
  Check,
  Filter,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";

const Sales = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("shared-products");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Shampoo Premium",
            category: "Cuidado Capilar",
            price: 2600,
            stock: 49,
            minStock: 10,
          },
          {
            id: 2,
            name: "Acondicionador",
            category: "Cuidado Capilar",
            price: 2400,
            stock: 35,
            minStock: 10,
          },
          {
            id: 3,
            name: "Tratamiento Capilar",
            category: "Cuidado Capilar",
            price: 4500,
            stock: 20,
            minStock: 5,
          },
          {
            id: 4,
            name: "Tinte Profesional",
            category: "Coloración",
            price: 3800,
            stock: 15,
            minStock: 8,
          },
          {
            id: 5,
            name: "Decolorante",
            category: "Coloración",
            price: 3200,
            stock: 8,
            minStock: 10,
          },
          {
            id: 6,
            name: "Crema de Manos",
            category: "Cuidado Personal",
            price: 1500,
            stock: 60,
            minStock: 15,
          },
        ];
  });

  const [salesHistory, setSalesHistory] = useState(() => {
    const saved = localStorage.getItem("shared-sales");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            date: "2026-01-09",
            time: "10:30",
            items: 2,
            total: 3675,
            customer: "Cliente 1",
          },
          {
            id: 2,
            date: "2026-01-09",
            time: "14:15",
            items: 1,
            total: 2600,
            customer: "Cliente 2",
          },
        ];
  });

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    minStock: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    localStorage.setItem("shared-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("shared-sales", JSON.stringify(salesHistory));
  }, [salesHistory]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "shared-products" && e.newValue) {
        setProducts(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const categories = ["Todos", ...new Set(products.map((p) => p.category))];
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock === 0) return;
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.qty < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        );
      }
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQty = (productId, newQty) => {
    if (newQty === 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (newQty > product.stock) return;
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const todaySales = salesHistory
    .filter((sale) => sale.date === "2026-01-09")
    .reduce((sum, sale) => sum + sale.total, 0);
  const monthSales = salesHistory.reduce((sum, sale) => sum + sale.total, 0);

  const processSale = () => {
    if (cart.length === 0) return;
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      return cartItem
        ? { ...product, stock: product.stock - cartItem.qty }
        : product;
    });
    setProducts(updatedProducts);

    const newSale = {
      id: salesHistory.length + 1,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: cartItemsCount,
      total: cartTotal,
      customer: customerName || "Cliente General",
      payment: paymentMethod,
      products: [...cart],
    };
    setSalesHistory([newSale, ...salesHistory]);
    setCart([]);
    setCustomerName("");
    setShowCheckoutModal(false);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    const product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category || "Varios",
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock) || 5,
    };
    setProducts([...products, product]);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      stock: "",
      minStock: "",
    });
    setShowProductModal(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    setProducts(
      products.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Ventas</h1>
            <p className="text-slate-400">{filteredProducts.length} productos disponibles</p>
          </div>
          <button
            onClick={() => setShowProductModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-slate-400 text-sm">{product.category}</p>
                </div>
                {product.stock <= product.minStock && (
                  <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs font-semibold">Bajo</div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                <span className="text-slate-400 text-sm">Stock</span>
                <span className={`font-bold ${product.stock <= product.minStock ? "text-red-400" : "text-green-400"}`}>
                  {product.stock}
                </span>
              </div>

              <p className="text-3xl font-bold text-green-400 mb-4">${product.price.toLocaleString()}</p>

              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-xl font-semibold transition mb-3 ${
                  product.stock === 0 ? "bg-slate-700 text-slate-500" : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {product.stock === 0 ? "Sin Stock" : "Agregar"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-2 bg-slate-700/50 rounded-lg hover:bg-blue-600/30 text-slate-400"
                >
                  <Edit size={18} className="mx-auto" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-slate-700/50 rounded-lg hover:bg-red-600/30 text-slate-400"
                >
                  <Trash2 size={18} className="mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-96 bg-slate-900/80 border-l border-slate-700/50 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {cart.length === 0 ? "Carrito vacío" : `Carrito (${cartItemsCount})`}
          </h2>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-red-400 hover:text-red-300">
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
            <ShoppingCart size={64} className="mb-4" />
            <p>Agrega productos</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto mb-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-slate-400 text-sm">${item.price.toLocaleString()} c/u</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
                    <button
                      onClick={() => updateCartQty(item.id, item.qty - 1)}
                      className="w-8 h-8 rounded bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-white font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      disabled={item.qty >= item.stock}
                      className="w-8 h-8 rounded bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-green-400 font-bold text-xl">
                    ${(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between py-4 mb-4">
            <span className="text-2xl font-bold text-white">Total</span>
            <span className="text-3xl font-bold text-green-400">${cartTotal.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setShowCheckoutModal(true)}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
            disabled={cart.length === 0}
          >
            <DollarSign className="inline mr-2" /> Procesar Venta
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-md border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white">Finalizar Venta</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-slate-300 mb-2">Cliente (Opcional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nombre"
                  className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Método de Pago</label>
                <div className="grid grid-cols-3 gap-2">
                  {["efectivo", "tarjeta", "transferencia"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl font-semibold capitalize ${
                        paymentMethod === method ? "bg-purple-600 text-white" : "bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Productos:</span>
                  <span className="text-white font-semibold">{cartItemsCount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-300">Método:</span>
                  <span className="text-white font-semibold capitalize">{paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-600 mt-3">
                  <span className="text-xl font-bold text-white">Total:</span>
                  <span className="text-2xl font-bold text-green-400">${cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={processSale}
              className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Check size={20} /> Confirmar Venta
            </button>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-md border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white">Nuevo Producto</h3>
              <button onClick={() => setShowProductModal(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nombre"
              />
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Categoría"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Precio"
                />
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Stock"
                />
              </div>
              <input
                type="number"
                value={newProduct.minStock}
                onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Stock Mínimo"
              />

              <button
                onClick={handleAddProduct}
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
              >
                <Plus className="inline mr-2" size={20} /> Agregar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl p-8 w-full max-w-md border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white">Editar Producto</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                  className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <input
                type="number"
                value={editingProduct.minStock}
                onChange={(e) => setEditingProduct({ ...editingProduct, minStock: parseInt(e.target.value) })}
                className="w-full bg-slate-700/50 text-white rounded-xl px-4 py-3 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={handleEditProduct}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                <Check className="inline mr-2" size={20} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;