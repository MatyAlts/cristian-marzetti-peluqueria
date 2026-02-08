import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Upload } from 'lucide-react';
import { Product } from '../../types';
import { API_URL } from '../../constants';
import { useAuth } from './AuthContext';

interface Category {
  id: number;
  name: string;
}

export const ProductFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) throw new Error('Error al cargar categorías');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Error al cargar las categorías');
    }
  };

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (!res.ok) throw new Error();
        const product: Product = await res.json();
        setName(product.name);
        setDescription(product.description || '');
        setPrice(String(product.price));
        setCategoryId(String(product.category_id));
        if (product.image_url) {
          setImagePreview(`${API_URL}${product.image_url}`);
        }
      } catch {
        setError('No se pudo cargar el producto');
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category_id', categoryId);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const url = isEdit ? `${API_URL}/api/products/${id}` : `${API_URL}/api/products`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.status === 401) {
        logout();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Error al guardar');
      }
      navigate('/admin/productos');
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/admin/productos')}
        className="inline-flex items-center gap-1 text-neutral-500 hover:text-dark-900 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Volver a productos
      </button>

      <h1 className="text-2xl font-bold text-dark-900 mb-6">
        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            placeholder="Ej: Shampoo Nutritivo 350ml"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
            placeholder="Descripción del producto..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Precio *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="1"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="15000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Categoría *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent bg-white"
            >
              <option value="">Seleccionar categoría...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                No hay categorías disponibles. <a href="/#/admin/categorias/nueva" className="text-gold-500 hover:underline">Crear una</a>
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Imagen</label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-gold-500 hover:bg-gold-500/5 transition-colors overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center text-neutral-400">
                <Upload size={24} className="mb-2" />
                <span className="text-sm">Click para subir imagen</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-gold-500 text-dark-900 font-semibold hover:bg-gold-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Guardando...' : isEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="px-6 py-2.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
