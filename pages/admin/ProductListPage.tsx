import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, PackageOpen } from 'lucide-react';
import { Product } from '../../types';
import { API_URL } from '../../constants';
import { useAuth } from './AuthContext';

export const ProductListPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        logout();
        return;
      }
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // ignore
    }
  };

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-dark-900">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 text-dark-900 font-semibold hover:bg-gold-400 transition-colors"
        >
          <Plus size={18} />
          Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <PackageOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay productos cargados.</p>
          <Link to="/admin/productos/nuevo" className="text-gold-500 hover:underline mt-2 inline-block">
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Imagen</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase hidden sm:table-cell">Categoría</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase">Precio</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={p.image_url ? `${API_URL}${p.image_url}` : 'https://placehold.co/48x48?text=—'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-200"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-dark-900">{p.name}</td>
                    <td className="px-4 py-3 text-neutral-500 hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/productos/${p.id}`}
                          className="p-2 text-neutral-400 hover:text-gold-500 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
