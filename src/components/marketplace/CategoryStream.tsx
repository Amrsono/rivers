'use client';

import React from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import {
  Car,
  Building2,
  Smartphone,
  Sofa,
  Briefcase,
  Shirt,
  Cpu,
  Zap,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const categoryIconMap: Record<string, React.ReactNode> = {
  Car: <Car className="w-6 h-6 sm:w-7 sm:h-7" />,
  Building2: <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />,
  Smartphone: <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />,
  Sofa: <Sofa className="w-6 h-6 sm:w-7 sm:h-7" />,
  Briefcase: <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />,
  Shirt: <Shirt className="w-6 h-6 sm:w-7 sm:h-7" />,
  Cpu: <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />,
  Zap: <Zap className="w-6 h-6 sm:w-7 sm:h-7" />,
};

export const CategoryStream: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    language,
    t,
  } = useRiversStore();

  const activeCategoryObj = MOCK_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <section id="categories-section" className="mx-auto max-w-7xl px-4 sm:px-6 mb-8">
      {/* Header Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            {t('intelligentCategoryStreams')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a category to explore verified ads, cars, properties, and electronics
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('all');
            setSelectedSubcategory('all');
          }}
          className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
          }`}
        >
          {t('allStreams')}
        </button>
      </div>

      {/* Main Categories Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
        {MOCK_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          const name = language === 'ar' && category.nameAr ? category.nameAr : category.name;
          const iconNode = categoryIconMap[category.icon] || <Zap className="w-6 h-6" />;

          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (isSelected) {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                } else {
                  setSelectedCategory(category.id);
                  setSelectedSubcategory('all');
                }
              }}
              className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300 text-center cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-blue-600/30 to-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Category Icon */}
              <div
                className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl mb-2 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-cyan-400 group-hover:text-cyan-300'
                }`}
              >
                {iconNode}
              </div>

              {/* Title */}
              <span
                className={`text-[11px] sm:text-xs font-bold line-clamp-1 leading-snug ${
                  isSelected ? 'text-cyan-300' : 'text-slate-200'
                }`}
              >
                {name}
              </span>

              {/* Item Count */}
              <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                {category.itemCount} ads
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Subcategory Filter Pills */}
      {activeCategoryObj && activeCategoryObj.subcategories && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 mt-4 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-xl"
        >
          <span className="text-xs text-cyan-400 font-bold font-mono px-2">Subcategories:</span>
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900'
            }`}
          >
            All {language === 'ar' && activeCategoryObj.nameAr ? activeCategoryObj.nameAr : activeCategoryObj.name}
          </button>
          {activeCategoryObj.subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubcategory(sub.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSubcategory === sub.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
              }`}
            >
              {language === 'ar' ? sub.nameAr : sub.nameEn}
            </button>
          ))}
        </motion.div>
      )}
    </section>
  );
};
