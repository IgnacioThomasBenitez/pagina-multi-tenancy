import React, { useState, useEffect } from 'react';
import { Clock, Users, CheckCircle, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const RestaurantOrders = () => {
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [finalizados, setFinalizados] = useState(0);

  // Cargar órdenes desde localStorage
  useEffect(() => {
    loadOrders();
    loadFinalizados();
    
    // Actualizar cada 2 segundos para detectar nuevas órdenes
    const interval = setInterval(() => {
      loadOrders();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Incrementar tiempo cada minuto
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order => {
          const newTime = order.time + 1;
          let newStatus = order.status;
          
          if (newTime > 20) newStatus = 'muy-tarde';
          else if (newTime > 10) newStatus = 'tardando';
          
          return { ...order, time: newTime, status: newStatus };
        });
        
        // Guardar en localStorage
        if (updatedOrders.length > 0) {
          localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));
        }
        
        return updatedOrders;
      });
    }, 60000); // Cada minuto

    return () => clearInterval(timeInterval);
  }, []);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('kitchenOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  };

  const loadFinalizados = () => {
    const count = localStorage.getItem('finalizadosCount');
    if (count) {
      setFinalizados(parseInt(count));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'entrante': return 'bg-green-500';
      case 'tardando': return 'bg-yellow-500';
      case 'muy-tarde': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'entrante': return 'Entrante';
      case 'tardando': return 'Tardando';
      case 'muy-tarde': return 'Muy tarde';
      default: return 'Desconocido';
    }
  };

  const groupedOrders = {
    entrante: orders.filter(o => o.status === 'entrante'),
    tardando: orders.filter(o => o.status === 'tardando'),
    'muy-tarde': orders.filter(o => o.status === 'muy-tarde')
  };

  const markAsReady = (orderId) => {
    // Incrementar contador de finalizados
    const newCount = finalizados + 1;
    setFinalizados(newCount);
    localStorage.setItem('finalizadosCount', newCount.toString());
    
    // Eliminar la orden
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('kitchenOrders', JSON.stringify(updatedOrders));
    setSelectedTable(null);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Sistema de Órdenes - Cocina</h1>
              <p className="text-gray-400 mt-1">Las órdenes se actualizan automáticamente desde Mesas</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Finalizados</p>
                <p className="text-2xl font-bold text-blue-400">{finalizados}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Entrante</p>
                <p className="text-2xl font-bold text-green-400">{groupedOrders.entrante.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Preparando</p>
                <p className="text-2xl font-bold text-yellow-400">{groupedOrders.tardando.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center border border-gray-700">
                <p className="text-xs text-gray-400 mb-1">Total Activos</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 lg:col-span-3 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Estados de Órdenes</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between gap-3 p-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                    <span className="font-medium">Entrante</span>
                  </div>
                  <span className="text-2xl font-bold">{groupedOrders.entrante.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                    <span className="font-medium">Preparando</span>
                  </div>
                  <span className="text-2xl font-bold">{groupedOrders.tardando.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3 p-4 bg-gray-700 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
                    <span className="font-medium">Muy tarde</span>
                  </div>
                  <span className="text-2xl font-bold">{groupedOrders['muy-tarde'].length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedTable(order)}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                  selectedTable?.id === order.id ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{order.table}</h3>
                    <p className="text-xs text-gray-500">Orden #{order.id}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <Clock size={14} />
                      <span>{formatTime(order.time)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Users size={14} />
                      <span>{order.guests} {order.guests === 1 ? 'item' : 'items'}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm flex justify-between bg-gray-700 bg-opacity-30 p-2 rounded">
                      <span className="text-gray-200">{item.name}</span>
                      <span className="text-gray-400 font-semibold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 rounded p-3 mb-4">
                    <p className="text-xs text-yellow-100">
                      <strong>Notas:</strong> {order.notes}
                    </p>
                  </div>
                )}

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsReady(order.id);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-all hover:shadow-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Finalizar pedido
                </button>
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-2xl font-semibold">No hay órdenes activas</p>
              <p className="text-sm mt-2">Las nuevas órdenes aparecerán aquí cuando se envíen desde Mesas</p>
            </div>
          )}
        </div>
      </div>

      {selectedTable && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={() => setSelectedTable(null)}
          />
          
          <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl overflow-y-auto transform transition-transform z-50 border-l-4 border-blue-500">
            <div className="p-6">
              <button
                onClick={() => setSelectedTable(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2 transition-all hover:rotate-90 duration-300"
              >
                <X size={24} />
              </button>
              
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-1">{selectedTable.table}</h2>
                <p className="text-gray-400">Orden #{selectedTable.id}</p>
              </div>

              <div className="mb-6">
                <div className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedTable.status)} shadow-lg`}>
                  {getStatusText(selectedTable.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-700 bg-opacity-30 rounded-xl p-5">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                    <Clock size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tiempo transcurrido</p>
                    <p className="font-bold text-lg">{formatTime(selectedTable.time)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                    <Users size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="font-bold text-lg">{selectedTable.guests}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Items del pedido</h3>
                <div className="bg-gray-700 bg-opacity-30 rounded-xl p-4 space-y-3">
                  {selectedTable.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-600 last:border-0">
                      <div className="flex-1">
                        <span className="font-medium text-lg">{item.name}</span>
                        {item.notes && (
                          <p className="text-xs text-yellow-400 mt-1">📝 {item.notes}</p>
                        )}
                      </div>
                      <span className="text-gray-400 font-bold bg-gray-700 px-3 py-1 rounded-full">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTable.notes && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Notas especiales</h3>
                  <div className="bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 rounded-lg p-4">
                    <p className="text-sm text-yellow-100 leading-relaxed">{selectedTable.notes}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={() => markAsReady(selectedTable.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl transition-all hover:shadow-lg font-medium text-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle size={22} />
                  Finalizar pedido
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantOrders;