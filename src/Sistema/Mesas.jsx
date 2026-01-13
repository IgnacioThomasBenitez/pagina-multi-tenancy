import React, { useState } from 'react';
import { X, Plus, Trash2, Settings, LogOut, ShoppingCart, Package, BarChart3 } from 'lucide-react';

export default function RestaurantTableManager() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Mesa 1', status: 'OCUPADO', orders: [
      { id: 1, name: 'Hamburguesa completa', category: 'Comida 1', price: 4500, quantity: 1 },
      { id: 2, name: 'Coca Cola', category: 'Bebidas', price: 2000, quantity: 1 }
    ], attendedBy: 'Juan', date: '9/1/2025, 03:34:48' },
    { id: 2, name: 'Mesa 2', status: 'ESPERA', orders: [], attendedBy: 'María', date: '9/1/2025, 04:15:22' },
    { id: 3, name: 'Mesa 3', status: 'LIBRE', orders: [], attendedBy: '-', date: '-' }
  ]);
  
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const statusColors = {
    OCUPADO: 'bg-orange-500',
    ESPERA: 'bg-yellow-500',
    LIBRE: 'bg-green-500'
  };

  const allMenuItems = [
    { id: 1, name: 'Hamburguesa completa', price: 4500, category: 'Hamburguesas' },
    { id: 2, name: 'Hamburguesa simple', price: 3500, category: 'Hamburguesas' },
    { id: 3, name: 'Pizza Napolitana', price: 6000, category: 'Pizzas' },
    { id: 4, name: 'Pizza Muzzarella', price: 5500, category: 'Pizzas' },
    { id: 5, name: 'Coca Cola', price: 2000, category: 'Bebidas' },
    { id: 6, name: 'Cerveza', price: 3000, category: 'Bebidas' },
    { id: 7, name: 'Agua', price: 1500, category: 'Bebidas' }
  ];

  const categories = ['Todas', 'Hamburguesas', 'Pizzas', 'Bebidas'];

  const filteredMenuItems = selectedCategory === 'Todas' 
    ? allMenuItems 
    : allMenuItems.filter(item => item.category === selectedCategory);

  const addNewTable = () => {
    if (newTableName.trim()) {
      const newTable = {
        id: Date.now(),
        name: newTableName,
        status: 'LIBRE',
        orders: [],
        attendedBy: '-',
        date: '-'
      };
      setTables([...tables, newTable]);
      setNewTableName('');
      setShowAddTableModal(false);
    }
  };

  const openTable = (table) => {
    setSelectedTable({ ...table });
    setShowModal(true);
  };

  const addOrderItem = (item) => {
    const existingItem = selectedTable.orders.find(o => o.name === item.name);
    
    if (existingItem) {
      const updatedOrders = selectedTable.orders.map(o =>
        o.name === item.name ? { ...o, quantity: o.quantity + 1 } : o
      );
      setSelectedTable({ ...selectedTable, orders: updatedOrders });
    } else {
      const newOrder = { ...item, id: Date.now(), quantity: 1 };
      setSelectedTable({ ...selectedTable, orders: [...selectedTable.orders, newOrder] });
    }
  };

  const removeOrderItem = (id) => {
    const updatedOrders = selectedTable.orders.filter(item => item.id !== id);
    setSelectedTable({ ...selectedTable, orders: updatedOrders });
  };

  const updateQuantity = (id, delta) => {
    const updatedOrders = selectedTable.orders.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    setSelectedTable({ ...selectedTable, orders: updatedOrders });
  };

  const calculateTotal = () => {
    return selectedTable.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const sendOrder = () => {
    const currentDate = new Date().toLocaleString();
    const updatedTable = {
      ...selectedTable,
      status: 'OCUPADO',
      date: currentDate,
      attendedBy: selectedTable.attendedBy === '-' ? 'Mesero' : selectedTable.attendedBy
    };
    
    setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
    alert('¡Pedido enviado a cocina!');
    setShowModal(false);
  };

  const closeTable = () => {
    if (window.confirm('¿Estás seguro de cerrar esta mesa?')) {
      const updatedTable = {
        ...selectedTable,
        status: 'LIBRE',
        orders: [],
        attendedBy: '-',
        date: '-'
      };
      
      setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
      setShowModal(false);
      alert(`Mesa cerrada. Total: $${calculateTotal()}`);
    }
  };

  const deleteTable = (tableId) => {
    if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      setTables(tables.filter(t => t.id !== tableId));
    }
  };

  const changeTableStatus = (status) => {
    const updatedTable = { ...selectedTable, status };
    setSelectedTable(updatedTable);
    setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar - Barra lateral de navegación */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col overflow-y-auto">
        {/* Header del sidebar con logo y nombre del comercio */}
        <div className="mb-6">
          {/* Logo del comercio con emoji */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mb-3 flex items-center justify-center text-3xl">
            🍽️
          </div>
          <h2 className="text-white font-bold text-lg">Restaurante</h2>
        </div>

        {/* Menú de navegación */}
        <nav className="space-y-6 flex-1">
          {/* INFORMES */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Informes</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                <BarChart3 className="inline mr-3" size={16} /> Dashboard
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                📄 Resúmenes
              </button>
            </div>
          </div>

          {/* FINANZAS */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Finanzas</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                <ShoppingCart className="inline mr-3" size={16} /> Registrar Ventas
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                💰 Contabilidad
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                📊 Ingresos y Egresos
              </button>
            </div>
          </div>

          {/* STOCK */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Stock</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                <Package className="inline mr-3" size={16} /> Productos
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                🚚 Proveedores
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                🛒 Compras
              </button>
            </div>
          </div>

          {/* ADMINISTRACIÓN */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Administración</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg bg-purple-600/20 text-purple-400 transition text-sm">
                🪑 Mesas
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                👥 Empleados
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                🕐 Turnos
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                💳 Métodos de Pago
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/50 transition text-sm">
                <Settings className="inline mr-3" size={16} /> Configuración
              </button>
            </div>
          </div>
        </nav>
        
        {/* Botón de Cerrar Sesión */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all mt-auto">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mesas</h1>
            <p className="text-slate-400">Gestiona las mesas del restaurante. Total de mesas: {tables.length}</p>
          </div>

          {/* Status badges */}
          <div className="flex gap-3 mb-8 items-center">
            <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg font-medium">
              OCUPADO ({tables.filter(t => t.status === 'OCUPADO').length})
            </span>
            <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium">
              ESPERA ({tables.filter(t => t.status === 'ESPERA').length})
            </span>
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium">
              LIBRE ({tables.filter(t => t.status === 'LIBRE').length})
            </span>
            <button 
              onClick={() => setShowAddTableModal(true)}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <Plus size={20} />
              Agregar Mesa
            </button>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-4 gap-4">
            {tables.map(table => (
              <div
                key={table.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition relative group"
              >
                <div 
                  onClick={() => openTable(table)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-white text-lg">{table.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${statusColors[table.status]}`}>
                      {table.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div>Atendido por: {table.attendedBy}</div>
                    <div className="text-xs">{table.date}</div>
                    {table.orders.length > 0 && (
                      <div className="text-xs text-purple-400 mt-2">
                        {table.orders.length} producto(s) - ${table.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable(table.id);
                  }}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-300 bg-slate-900 p-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showModal && selectedTable && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedTable.name}</h3>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex gap-2">
                      {['LIBRE', 'ESPERA', 'OCUPADO'].map(status => (
                        <button
                          key={status}
                          onClick={() => changeTableStatus(status)}
                          className={`px-3 py-1 rounded-full text-xs text-white font-medium transition ${
                            selectedTable.status === status 
                              ? statusColors[status]
                              : 'bg-slate-700 hover:bg-slate-600'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
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
                  {selectedTable.orders.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <ShoppingCart size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No hay productos en el pedido</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedTable.orders.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-800 border border-slate-700 p-4 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="text-sm text-slate-400">{item.category}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-slate-700 rounded-lg">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-1 hover:bg-slate-600 rounded-l-lg text-white"
                              >
                                -
                              </button>
                              <span className="px-3 text-white font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-1 hover:bg-slate-600 rounded-r-lg text-white"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-semibold text-white w-20 text-right">
                              ${item.price * item.quantity}
                            </span>
                            <button 
                              onClick={() => removeOrderItem(item.id)} 
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className="flex justify-between text-xl font-bold text-white mb-6">
                      <span>Total</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={sendOrder}
                        disabled={selectedTable.orders.length === 0}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition font-medium"
                      >
                        Enviar pedido a cocina
                      </button>
                      <button 
                        onClick={closeTable}
                        disabled={selectedTable.orders.length === 0}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 disabled:bg-slate-800 disabled:cursor-not-allowed text-red-400 disabled:text-slate-500 py-3 rounded-lg transition font-medium"
                      >
                        Cerrar mesa y cobrar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Agregar productos Section */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Agregar productos</h4>
                  <div className="mb-4">
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {categories.map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-lg text-sm transition ${
                            selectedCategory === cat
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredMenuItems.map(item => (
                      <div 
                        key={item.id} 
                        className="border border-slate-700 bg-slate-800 hover:bg-slate-750 hover:border-purple-500 rounded-lg p-4 transition cursor-pointer"
                        onClick={() => addOrderItem(item)}
                      >
                        <div className="font-medium text-white">{item.name}</div>
                        <div className="text-sm text-slate-400 mt-1">${item.price}</div>
                        <div className="text-xs text-slate-500 mt-1">{item.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Agregar Nueva Mesa</h3>
              <button onClick={() => setShowAddTableModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Nombre de la Mesa
              </label>
              <input
                type="text"
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Ej: Mesa 4"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                onKeyPress={(e) => e.key === 'Enter' && addNewTable()}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddTableModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={addNewTable}
                disabled={!newTableName.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-3 rounded-lg transition font-medium"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}