import React from 'react';
import { PRODUCTS } from '../constants';
import { Button } from '../components/Button';
import { Filter, ShoppingBag } from 'lucide-react';

export const Products: React.FC = () => {
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col">
              <div className="aspect-square relative overflow-hidden group">
                 <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="text-xs font-bold text-gold-600 uppercase mb-1">{product.category}</div>
                <h3 className="font-bold text-dark-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-bold text-lg">{product.price}</span>
                  <a 
                    href={`https://wa.me/5492612692207?text=Hola,%20me%20interesa%20el%20producto%20${product.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-dark-900 text-white rounded-full hover:bg-gold-500 hover:text-dark-900 transition-colors"
                  >
                    <ShoppingBag size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};