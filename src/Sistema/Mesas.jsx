import React, { useState } from 'react';
import { X, Plus, Trash2, Settings, LogOut, ShoppingCart, Package } from 'lucide-react';

export default function RestaurantTableManager() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Mesa 5', status: 'OCUPADO', orders: [], attendedBy: 'Juan', date: '9/1/2025, 03:34:48' }
  ]);
  
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statusColors = {
    OCUPADO: 'bg-orange-500',
    ESPERA: 'bg-yellow-500',
    LIBRE: 'bg-green-500'
  };

  const menuItems = [
    { id: 1, name: 'Hamburguesa', price: 4500, category: 'Hamburguesas' },
    { id: 2, name: 'Pizza', price: 6000, category: 'Pizza' },
    { id: 3, name: 'Coca Cola', price: 2000, category: 'Bebidas' },
    { id: 4, name: 'Cerveza', price: 3000, category: 'Bebidas' }
  ];

  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Hamburguesa completa', category: 'Comida 1', price: 4500, quantity: 1 },
    { id: 2, name: 'Hamburguesa completa', category: 'Comida 1', price: 4500, quantity: 1 }
  ]);

  const addOrderItem = (item) => {
    setOrderItems([...orderItems, { ...item, quantity: 1, id: Date.now() }]);
  };

  const removeOrderItem = (id) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800">
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          <div>
            <h2 className="text-white font-semibold">Nombre del Comercio</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <ShoppingCart size={20} />
            <span>Mesas</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <Settings size={20} />
            <span>Configuración</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <Package size={20} />
            <span>Barbería</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <Package size={20} />
            <span>Almacén / Kiosco</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-slate-800 rounded-lg">
            <ShoppingCart size={20} />
            <span>Restaurantes</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <ShoppingCart size={20} />
            <span>Atención</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mesas</h1>
            <p className="text-slate-400">Gestiona las mesas del restaurante.</p>
          </div>

          {/* Status badges */}
          <div className="flex gap-3 mb-8">
            <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-medium">OCUPADO</span>
            <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium">ESPERA</span>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium">LIBRE</span>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-4 gap-4">
            {tables.map(table => (
              <div
                key={table.id}
                onClick={() => { setSelectedTable(table); setShowModal(true); }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-white text-lg">{table.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${statusColors[table.status]}`}>
                    {table.status}
                  </span>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <div>Atendido por: {table.attendedBy}</div>
                  <div>{table.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedTable.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${statusColors[selectedTable.status]}`}>
                      {selectedTable.status}
                    </span>
                    <span className="text-slate-400 text-sm">Atendido por: {selectedTable.attendedBy}</span>
                    <span className="text-slate-400 text-sm">{selectedTable.date}</span>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Pedidos Section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Pedidos</h4>
                  <div className="space-y-3">
                    {orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-800 border border-slate-700 p-4 rounded-lg">
                        <div>
                          <div className="font-medium text-white">{item.name}</div>
                          <div className="text-sm text-slate-400">{item.category}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white">${item.price}</span>
                          <button onClick={() => removeOrderItem(item.id)} className="text-red-400 hover:text-red-300 transition">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className="flex justify-between text-xl font-bold text-white mb-6">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg transition font-medium">
                        Enviar pedido
                      </button>
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg transition font-medium">
                        Editar
                      </button>
                      <button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-lg transition font-medium">
                        Cerrar mesa
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agregar productos Section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Agregar productos</h4>
                  <div className="mb-4">
                    <div className="flex gap-2 mb-4">
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition">Comidas</button>
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition">Bebidas</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.map(item => (
                      <div 
                        key={item.id} 
                        className="border border-slate-700 bg-slate-800 hover:bg-slate-750 hover:border-slate-600 rounded-lg p-4 transition cursor-pointer"
                        onClick={() => addOrderItem(item)}
                      >
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-slate-400 mt-1">${item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}