import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { API_URL } from '../../constants';

export const CategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`);
      if (!res.ok) throw new Error('Error al cargar categoría');
      const data = await res.json();
      setName(data.name);
    } catch (error) {
      alert('Error al cargar categoría');
      console.error(error);
      navigate('/admin/categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEditing
        ? `${API_URL}/api/categories/${id}`
        : `${API_URL}/api/categories`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Error al guardar categoría');
      }

      alert(isEditing ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente');
      navigate('/admin/categorias');
    } catch (error: any) {
      alert(error.message || 'Error al guardar categoría');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/admin/categorias"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-gold-500 transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Volver a categorías
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-dark-900">
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </h1>
        <p className="text-neutral-500 mt-1">
          {isEditing ? 'Modifica los datos de la categoría' : 'Completa los datos para crear una nueva categoría'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-dark-900 mb-2">
              Nombre de la Categoría <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ej. Shampoo, Mascarilla, Acondicionador..."
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all"
              required
              disabled={saving}
            />
            <p className="text-sm text-neutral-500 mt-2">
              Ingresa un nombre descriptivo para la categoría
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-dark-900 text-white rounded-lg hover:bg-gold-500 hover:text-dark-900 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? 'Actualizar' : 'Crear'} Categoría
                </>
              )}
            </button>
            <Link
              to="/admin/categorias"
              className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};
