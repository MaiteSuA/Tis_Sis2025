import { useState } from 'react';

export default function RegisterModal({ open, onClose, onOpenLogin }) {
  if (!open) return null;

  // Estado para los campos y errores
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
    dia: '',
    mes: '',
    año: '',
    telefono: '',
    terminos: false
  });

  const [errors, setErrors] = useState({});
  
  // Estado para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Generar días 1–31
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Meses
  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  // Años dinámicos: desde 1945 hasta el año actual
  const currentYear = new Date().getFullYear();
  const startYear = 1945;
  const years = Array.from(
    { length: currentYear - startYear + 1 }, 
    (_, i) => currentYear - i
  );

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validaciones
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre completo es requerido';
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo) {
      newErrors.correo = 'El correo electrónico es requerido';
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'El correo debe contener @ y un dominio válido (ej: usuario@dominio.com)';
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 10) {
      newErrors.password = 'La contraseña debe tener al menos 10 caracteres';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'La contraseña debe incluir letras, números y al menos un carácter especial (@$!%*#?&)';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar fecha de nacimiento
    if (!formData.dia || !formData.mes || !formData.año) {
      newErrors.fechaNacimiento = 'Completa tu fecha de nacimiento';
    }

    // Validar teléfono
    const phoneRegex = /^\d{8}$/;
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener exactamente 8 dígitos numéricos';
    }

    // Validar términos
    if (!formData.terminos) {
      newErrors.terminos = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Formulario válido:', formData);
      alert('Registro exitoso!');
      onClose();
    }
  };

  // Función para abrir el modal de login
  const handleOpenLogin = () => {
    onClose(); // Cierra el modal de registro
    if (onOpenLogin) {
      onOpenLogin(); // Abre el modal de login
    }
  };

  // Clases CSS para inputs con error
  const inputClass = (fieldName) => 
    `w-full border rounded-md px-4 py-2 pr-10 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'
    }`;

  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para alternar visibilidad de confirmar contraseña
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-8 relative">
        {/* BOTÓN DE CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 text-2xl hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-center text-2xl font-bold text-[#898b8f] mb-6">
          REGISTRARSE
        </h2>

        {/* FORMULARIO */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="space-y-1">
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={inputClass('nombre')}
              placeholder="Nombre Completo"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{errors.nombre}</p>
            )}
          </div>

          {/* Correo */}
          <div className="space-y-1">
            <input
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={inputClass('correo')}
              placeholder="Correo electrónico"
            />
            {errors.correo && (
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{errors.correo}</p>
            )}
          </div>

          {/* Contraseña + Confirmación */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-3">
              {/* Campo de Contraseña */}
              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass('password')}
                  placeholder="Contraseña"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Campo de Confirmar Contraseña */}
              <div className="relative">
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass('confirmPassword')}
                  placeholder="Confirmar Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Mensajes de error para contraseñas */}
            <div className="grid grid-cols-2 gap-3 relative">
              <div className="min-h-[20px]">
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="min-h-[20px]">
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fecha de nacimiento con combos dinámicos */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Día */}
              <select 
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                className={`border rounded-md px-3 py-2 ${
                  errors.fechaNacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Día</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Mes */}
              <select 
                name="mes"
                value={formData.mes}
                onChange={handleChange}
                className={`border rounded-md px-3 py-2 ${
                  errors.fechaNacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Mes</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* Año */}
              <select 
                name="año"
                value={formData.año}
                onChange={handleChange}
                className={`border rounded-md px-3 py-2 ${
                  errors.fechaNacimiento ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Año</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {errors.fechaNacimiento && (
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{errors.fechaNacimiento}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <input
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={inputClass('telefono')}
              placeholder="Teléfono (8 dígitos)"
              maxLength="8"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{errors.telefono}</p>
            )}
          </div>

          {/* Aceptar términos */}
          {/*
          <div className="space-y-1">
            <label className={`text-sm flex items-start gap-2 ${
              errors.terminos ? 'text-red-500' : ''
            }`}>
              <input 
                name="terminos"
                type="checkbox" 
                checked={formData.terminos}
                onChange={handleChange}
                className={`mt-0.5 ${errors.terminos ? 'border-red-500' : ''}`}
              />
              <span>
                He leído y acepto los{" "}
                <a href="#" className="text-blue-600 underline">
                  Términos y condiciones
                </a>
              </span>
            </label>
            {errors.terminos && (
              <p className="text-red-500 text-sm mt-1 min-h-[20px]">{errors.terminos}</p>
            )}
          </div>
*/}
          {/* Botón registrar */}
          <button 
            type="submit"
            className="w-full bg-[#777c7a] text-white font-semibold py-2 rounded-full hover:bg-[#b3afa7] transition-colors"
          >
            Registrarme
          </button>

          <p className="text-center text-sm mt-2">
            ¿Ya tienes una cuenta?{" "}
            <button 
              type="button"
              className="text-blue-600 font-medium underline hover:text-blue-800"
              onClick={handleOpenLogin}
            >
              Iniciar Sesión
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}