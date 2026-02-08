import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { API_URL } from '../../constants';

interface Category {
  id: number;
  name: string;
  created_at: string;
}

export const CategoryListPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      alert('Error al cargar categorías');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Eliminar la categoría "${name}"?`)) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Error al eliminar categoría');
      }

      alert('Categoría eliminada exitosamente');
      fetchCategories();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar categoría');
      console.error(error);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-dark-900">Categorías</h1>
          <p className="text-neutral-500 mt-1">Gestiona las categorías de productos</p>
        </div>
        <Link
          to="/admin/categorias/nueva"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 text-dark-900 font-semibold hover:bg-gold-400 transition-colors"
        >
          <Plus size={18} />
          Nueva Categoría
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-neutral-200">
          <p className="text-neutral-500 mb-4">No hay categorías creadas</p>
          <Link
            to="/admin/categorias/nueva"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 text-dark-900 font-semibold hover:bg-gold-400 transition-colors"
          >
            <Plus size={18} />
            Crear Primera Categoría
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: Cards */}
          <div className="grid gap-4 md:hidden">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-dark-900 text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-neutral-500">
                      ID: #{category.id} • Creada: {new Date(category.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-neutral-100">
                  <Link
                    to={`/admin/categorias/${category.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 text-dark-900 rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    <Pencil size={16} />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-dark-900">ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-900">Nombre</th>
                  <th className="text-left px-6 py-4 font-semibold text-dark-900">Fecha de Creación</th>
                  <th className="text-right px-6 py-4 font-semibold text-dark-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-6 py-4 text-neutral-600">#{category.id}</td>
                    <td className="px-6 py-4 font-semibold text-dark-900">{category.name}</td>
                    <td className="px-6 py-4 text-neutral-600">
                      {new Date(category.created_at).toLocaleDateString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/categorias/${category.id}`}
                          className="p-2 text-neutral-600 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
