import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { API_URL } from '../constants';
import { ArrowLeft, ShoppingBag, Loader2, Tag } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Producto no encontrado');
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-50 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center py-20">
            <h1 className="font-serif text-3xl font-bold text-dark-900 mb-4">
              Producto no encontrado
            </h1>
            <p className="text-neutral-500 mb-8">
              El producto que buscás no existe o fue eliminado.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-900 text-white rounded-lg hover:bg-gold-500 hover:text-dark-900 transition-colors"
            >
              <ArrowLeft size={18} />
              Volver a productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-gold-500 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Volver a productos
        </Link>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg border border-neutral-100 sticky top-24">
              <img
                src={product.image_url ? `${API_URL}${product.image_url}` : 'https://placehold.co/600x600?text=Sin+imagen'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="flex items-center gap-2 text-gold-600 mb-4">
              <Tag size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-dark-900 mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-8">
              <div className="text-sm text-neutral-500 mb-2">Precio</div>
              <div className="text-4xl font-bold text-dark-900">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-sm font-bold text-neutral-700 uppercase tracking-wider mb-3">
                  Descripción
                </h2>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-auto pt-8 border-t border-neutral-200">
              <a
                href={`https://wa.me/5492612692207?text=Hola,%20me%20interesa%20el%20producto%20${encodeURIComponent(product.name)}%20(${formatPrice(product.price)})`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-dark-900 text-white rounded-xl hover:bg-gold-500 hover:text-dark-900 transition-colors font-semibold text-lg shadow-lg"
              >
                <ShoppingBag size={24} />
                Consultar por WhatsApp
              </a>
              <p className="text-center text-sm text-neutral-500 mt-4">
                Te responderemos a la brevedad con más información
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
