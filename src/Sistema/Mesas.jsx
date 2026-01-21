import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function RestaurantTableManager() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableAttendant, setNewTableAttendant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const attendants = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Lucía'];

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

  // Cargar mesas desde localStorage al iniciar
  useEffect(() => {
    const storedTables = localStorage.getItem('restaurantTables');
    if (storedTables) {
      setTables(JSON.parse(storedTables));
    } else {
      const initialTables = [
        { id: 1, name: 'Mesa 1', status: 'OCUPADO', orders: [
          { id: 1, name: 'Hamburguesa completa', category: 'Hamburguesas', price: 4500, quantity: 1, notes: '' },
          { id: 2, name: 'Coca Cola', category: 'Bebidas', price: 2000, quantity: 1, notes: '' }
        ], attendedBy: 'Juan', date: new Date().toLocaleString() },
        { id: 2, name: 'Mesa 2', status: 'ESPERA', orders: [], attendedBy: 'María', date: new Date().toLocaleString() },
        { id: 3, name: 'Mesa 3', status: 'LIBRE', orders: [], attendedBy: '-', date: '-' }
      ];
      setTables(initialTables);
      localStorage.setItem('restaurantTables', JSON.stringify(initialTables));
    }
  }, []);

  // Guardar mesas en localStorage cada vez que cambien
  const saveTables = (updatedTables) => {
    setTables(updatedTables);
    localStorage.setItem('restaurantTables', JSON.stringify(updatedTables));
  };

  const addNewTable = () => {
    if (newTableName.trim()) {
      const newTable = {
        id: Date.now(),
        name: newTableName,
        status: 'LIBRE',
        orders: [],
        attendedBy: newTableAttendant || '-',
        date: '-'
      };
      saveTables([...tables, newTable]);
      setNewTableName('');
      setNewTableAttendant('');
      setShowAddTableModal(false);
    }
  };

  const openTable = (table) => {
    setSelectedTable({ ...table });
    setShowModal(true);
  };

  const addOrderItem = (item) => {
    const newOrder = { ...item, id: Date.now(), quantity: 1, notes: '' };
    setSelectedTable({ ...selectedTable, orders: [...selectedTable.orders, newOrder] });
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

  const updateOrderNotes = (id, notes) => {
    const updatedOrders = selectedTable.orders.map(item =>
      item.id === id ? { ...item, notes } : item
    );
    setSelectedTable({ ...selectedTable, orders: updatedOrders });
  };

  const calculateTotal = () => {
    return selectedTable.orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const sendOrder = () => {
    if (selectedTable.orders.length === 0) {
      alert('⚠️ No hay productos en el pedido');
      return;
    }

    const currentDate = new Date().toLocaleString();
    const updatedTable = {
      ...selectedTable,
      status: 'OCUPADO',
      date: currentDate,
      attendedBy: selectedTable.attendedBy === '-' ? 'Mesero' : selectedTable.attendedBy
    };
    
    // Actualizar mesas
    const updatedTables = tables.map(t => t.id === updatedTable.id ? updatedTable : t);
    saveTables(updatedTables);

    // Crear orden para cocina
    const kitchenOrder = {
      id: Date.now(),
      tableId: updatedTable.id,
      table: updatedTable.name,
      status: 'entrante',
      items: updatedTable.orders.map(order => ({
        name: order.name,
        quantity: order.quantity,
        notes: order.notes
      })),
      notes: updatedTable.orders.filter(o => o.notes).map(o => `${o.name}: ${o.notes}`).join(', '),
      time: 0,
      guests: updatedTable.orders.reduce((sum, item) => sum + item.quantity, 0),
      sentAt: currentDate
    };

    // Agregar a órdenes de cocina
    const existingOrders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
    const updatedOrders = [...existingOrders, kitchenOrder];
    localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));

    alert('✅ ¡Pedido enviado a cocina!');
    setShowModal(false);
  };

  const closeTable = () => {
    if (window.confirm('¿Estás seguro de cerrar esta mesa?')) {
      const total = calculateTotal();
      const updatedTable = {
        ...selectedTable,
        status: 'LIBRE',
        orders: [],
        attendedBy: '-',
        date: '-'
      };
      
      const updatedTables = tables.map(t => t.id === updatedTable.id ? updatedTable : t);
      saveTables(updatedTables);

      // Eliminar órdenes de cocina de esta mesa
      const existingOrders = JSON.parse(localStorage.getItem('kitchenOrders') || '[]');
      const filteredOrders = existingOrders.filter(o => o.tableId !== selectedTable.id);
      localStorage.setItem('kitchenOrders', JSON.stringify(filteredOrders));

      setShowModal(false);
      alert(`Mesa cerrada. Total: $${total}`);
    }
  };

  const deleteTable = (tableId) => {
    if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      const updatedTables = tables.filter(t => t.id !== tableId);
      saveTables(updatedTables);
    }
  };

  const changeTableStatus = (status) => {
    const updatedTable = { ...selectedTable, status };
    setSelectedTable(updatedTable);
    const updatedTables = tables.map(t => t.id === updatedTable.id ? updatedTable : t);
    saveTables(updatedTables);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Mesas</h1>
            <p className="text-slate-400">Gestiona las mesas del restaurante. Total de mesas: {tables.length}</p>
          </div>

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

      {/* Modal de Pedido */}
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
                        <div key={item.id} className="bg-slate-800 border border-slate-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-3">
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
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => updateOrderNotes(item.id, e.target.value)}
                            placeholder="Ej: Sin cebolla, sin mayonesa, extra queso..."
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
                          />
                          {item.notes && (
                            <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                              <span>📝</span>
                              <span className="font-medium">{item.notes}</span>
                            </div>
                          )}
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

      {/* Modal Agregar Mesa */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-md m-4 p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-white">Agregar Nueva Mesa</h3>
              <button onClick={() => setShowAddTableModal(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
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

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Atendido por (opcional)
                </label>
                <select
                  value={newTableAttendant}
                  onChange={(e) => setNewTableAttendant(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                >
                  <option value="">Seleccionar mesero...</option>
                  {attendants.map(attendant => (
                    <option key={attendant} value={attendant}>{attendant}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddTableModal(false);
                  setNewTableName('');
                  setNewTableAttendant('');
                }}
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