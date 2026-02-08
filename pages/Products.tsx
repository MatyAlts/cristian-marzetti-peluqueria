import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { API_URL } from '../constants';
import { Filter, ShoppingBag, Loader2 } from 'lucide-react';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

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

          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg bg-white hover:bg-neutral-50">
                <Filter size={18} />
                <span>Filtrar</span>
             </button>
          </div>
        </div>

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
