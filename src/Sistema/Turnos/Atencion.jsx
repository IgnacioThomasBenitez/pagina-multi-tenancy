// ==============================
// IMPORTS
// ==============================

// React y hooks
import React, { useState, useEffect } from "react";

// Íconos de lucide-react
import { X, Calendar, Clock } from "lucide-react";

// Componente reutilizable
import Sidebar from "../../components/Sidebar";

// Imágenes de los servicios
import corteImg from "../../assets/services/corte.png";
import manicureImg from "../../assets/services/manicure.png";
import facialImg from "../../assets/services/facial.png";
import masajeImg from "../../assets/services/masaje.png";
import depilacionImg from "../../assets/services/depilacion.png";
import pedicureImg from "../../assets/services/pedicure.png";

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
export default function Dashboard() {
  // ==============================
  // ESTADOS
  // ==============================
  
  // Servicio seleccionado para el turno
  const [selectedService, setSelectedService] = useState(null);

  // Controla si el modal está visible
  const [showModal, setShowModal] = useState(false);

  // Hora actual (se actualiza cada segundo)
  const [currentTime, setCurrentTime] = useState(new Date());

  // Datos del formulario de turno
  const [formData, setFormData] = useState({
    cliente: "",
    telefono: "",
    fecha: "",
    hora: "",
  });

  // ==============================
  // EFECTO: ACTUALIZA EL RELOJ
  // ==============================
  useEffect(() => {
    // Intervalo que actualiza la hora cada segundo
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Limpieza del intervalo
    return () => clearInterval(timer);
  }, []);

  // ==============================
  // SERVICIOS DISPONIBLES
  // ==============================
  const services = [
    {
      id: 1,
      nombre: "Corte de Cabello",
      precio: 500,
      img: corteImg,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      nombre: "Manicure",
      precio: 350,
      img: manicureImg,
      color: "from-pink-500 to-pink-600",
    },
    {
      id: 3,
      nombre: "Tratamiento Facial",
      precio: 800,
      img: facialImg,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 4,
      nombre: "Masaje Relajante",
      precio: 400,
      img: masajeImg,
      color: "from-green-500 to-green-600",
    },
    {
      id: 5,
      nombre: "Depilación",
      precio: 600,
      img: depilacionImg,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: 6,
      nombre: "Pedicure",
      precio: 300,
      img: pedicureImg,
      color: "from-red-500 to-red-600",
    },
  ];

  // ==============================
  // HANDLERS
  // ==============================

  // Cuando el usuario elige un servicio
  const handleServiceClick = (service) => {
    setSelectedService(service); // Guarda el servicio
    setShowModal(true); // Abre el modal
    // Resetea el formulario
    setFormData({ cliente: "", telefono: "", fecha: "", hora: "" });
  };

  // Maneja cambios en inputs
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Confirmar turno
  const handleConfirm = () => {
    // Aquí irá la lógica para guardar el turno
    console.log("Turno confirmado:", {
      servicio: selectedService,
      ...formData,
    });
    setShowModal(false);
  };

  // ==============================
  // FORMATEO DE FECHA Y HORA
  // ==============================
  const formatDateTime = (date) => ({
    date: date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const { date, time } = formatDateTime(currentTime);

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= CONTENIDO ================= */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="bg-gray-800/50 rounded-2xl p-6 mb-8 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Servicios Disponibles
              </h1>
              <p className="text-gray-400">
                Selecciona un servicio para agendar
              </p>
            </div>

            {/* Fecha y hora */}
            <div className="text-right">
              <div className="text-gray-400 flex items-center gap-2 justify-end">
                <Calendar size={16} /> {date}
              </div>
              <div className="text-white text-2xl font-bold flex items-center gap-2 justify-end">
                <Clock size={20} /> {time}
              </div>
            </div>
          </header>

          {/* Grid de servicios */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700 hover:border-blue-500 hover:scale-105 transition"
              >
                {/* Imagen */}
                <div
                  className={`bg-gradient-to-br ${service.color} h-32 rounded-xl flex items-center justify-center mb-3`}
                >
                  <img
                    src={service.img}
                    alt={service.nombre}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                {/* Info */}
                <h3 className="text-white font-bold">{service.nombre}</h3>
                <p className="text-green-400 text-xl font-bold">
                  ${service.precio}
                </p>
              </button>
            ))}
          </section>
        </div>
      </main>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-3xl p-8 w-full max-w-md relative">
            {/* Cerrar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <h3 className="text-2xl font-bold text-white mb-4">
              Agendar Turno
            </h3>

            {/* Info del servicio seleccionado */}
            {selectedService && (
              <div className="mb-4 p-4 bg-gray-800 rounded-xl">
                <p className="text-gray-400 text-sm">Servicio seleccionado:</p>
                <p className="text-white font-bold">{selectedService.nombre}</p>
                <p className="text-green-400 font-bold">
                  ${selectedService.precio}
                </p>
              </div>
            )}

            {/* Inputs */}
            <input
              name="cliente"
              value={formData.cliente}
              placeholder="Nombre del cliente"
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="telefono"
              value={formData.telefono}
              placeholder="Teléfono"
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleInputChange}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Confirmar */}
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white font-bold transition"
            >
              Confirmar Turno
            </button>
          </div>
        </div>
      )}
    </div>
  );
}