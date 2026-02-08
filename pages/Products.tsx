import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { API_URL } from '../constants';
import { Filter, ShoppingBag, Loader2, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `${API_URL}/api/products?category_id=${selectedCategory}`
        : `${API_URL}/api/products`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-dark-900">Productos</h1>
            <p className="text-neutral-500 mt-1">Calidad profesional para tu hogar</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-neutral-50 transition-colors ${
                selectedCategory ? 'border-gold-500 text-gold-600' : 'border-neutral-300'
              }`}
            >
              <Filter size={18} />
              <span>Filtrar</span>
              {selectedCategory && (
                <span className="ml-1 px-2 py-0.5 bg-gold-500 text-white text-xs rounded-full">
                  1
                </span>
              )}
            </button>

            {/* Filter dropdown */}
            {showFilter && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 z-10">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-dark-900">Categorías</h3>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-1 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === null
                          ? 'bg-gold-500 text-white font-semibold'
                          : 'hover:bg-neutral-100'
                      }`}
                    >
                      Todas las categorías
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowFilter(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-gold-500 text-white font-semibold'
                            : 'hover:bg-neutral-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filters */}
        {selectedCategory && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-neutral-600">Filtro activo:</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm">
              <span>{categories.find((c) => c.id === selectedCategory)?.name}</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className="hover:bg-gold-200 rounded-full p-0.5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-gold-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            No hay productos disponibles.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/productos/${product.id}`}
                className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col hover:shadow-lg hover:border-gold-500 transition-all duration-300 group"
              >
                <div className="aspect-square relative overflow-hidden">
                   <img
                    src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/400x400?text=Sin+imagen'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-gold-600 uppercase mb-1">{product.category}</div>
                  <h3 className="font-bold text-dark-900 mb-2 line-clamp-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-neutral-500 mb-2 line-clamp-2">{product.description}</p>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://wa.me/5492612692207?text=Hola,%20me%20interesa%20el%20producto%20${product.name}`, '_blank');
                      }}
                      className="p-2 bg-dark-900 text-white rounded-full hover:bg-gold-500 hover:text-dark-900 transition-colors"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
