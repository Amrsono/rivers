'use client';

import React, { useState } from 'react';
import { useRiversStore } from '@/lib/store/useRiversStore';
import { listingFormSchema, ListingFormValues } from '@/lib/schemas';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { Listing } from '@/lib/types';
import {
  Upload,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ListingCreatorModal: React.FC = () => {
  const { isListingCreatorOpen, closeListingCreator, addListing, currentUser } =
    useRiversStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState<ListingFormValues>({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    condition: 'LIKE_NEW',
    categoryId: MOCK_CATEGORIES[0].id,
    location: currentUser.location,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['Cyber', 'Tech', 'RiversEscrow'],
    flowFinanceEligible: true,
    safetyBadge: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isListingCreatorOpen) return null;

  // Add Image URL
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Add Tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim().replace(/^#/, '')],
    }));
    setTagInput('');
  };

  // Validate step before advancing
  const handleNextStep = () => {
    setValidationErrors({});

    if (currentStep === 1) {
      if (!formData.title || formData.title.length < 5) {
        setValidationErrors({ title: 'Title must be at least 5 characters.' });
        return;
      }
      if (!formData.description || formData.description.length < 20) {
        setValidationErrors({ description: 'Description must be at least 20 characters.' });
        return;
      }
    } else if (currentStep === 2) {
      if (formData.images.length === 0) {
        setValidationErrors({ images: 'At least 1 product photo is required.' });
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.price || formData.price <= 0) {
        setValidationErrors({ price: 'Price must be greater than $0.' });
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  // Final Submit
  const handleSubmitListing = () => {
    const parseResult = listingFormSchema.safeParse(formData);

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    const selectedCatObj = MOCK_CATEGORIES.find((c) => c.id === formData.categoryId);

    const newListing: Listing = {
      id: `lst_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      currency: formData.currency,
      condition: formData.condition,
      categoryId: formData.categoryId,
      categoryName: selectedCatObj?.name || 'General Tech',
      images: formData.images,
      location: formData.location,
      sellerId: currentUser.id,
      seller: currentUser,
      safetyBadge: formData.safetyBadge,
      flowFinanceEligible: formData.flowFinanceEligible,
      status: 'ACTIVE',
      tags: formData.tags,
      viewCount: 1,
      createdAt: new Date().toISOString(),
    };

    addListing(newListing);
    closeListingCreator();
  };

  const steps = [
    { num: 1, name: 'Basic Info' },
    { num: 2, name: 'Media Upload' },
    { num: 3, name: 'Pricing & Flow' },
    { num: 4, name: 'Preview & Publish' },
  ];

  return (
    <Modal
      isOpen={isListingCreatorOpen}
      onClose={closeListingCreator}
      title="Create Rivers P2P Listing"
      subtitle="Publish your item to thousands of verified buyers with instant Escrow and BNPL support."
      maxWidth="2xl"
    >
      {/* Step Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-800 -translate-y-1/2 z-0" />
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => isDone && setCurrentStep(step.num as any)}
                className={`relative z-10 flex flex-col items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'text-cyan-400 font-bold'
                    : isDone
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs transition-all ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 font-bold ring-4 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                      : isDone
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                      : 'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                </div>
                <span className="text-[11px] font-mono whitespace-nowrap">{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: BASIC INFO */}
      {currentStep === 1 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              Listing Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. AeroGlide Carbon Hydrofoil Board 2026 Edition"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
            />
            {validationErrors.title && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.title}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Category Stream *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
              >
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="NEW">Brand New (Sealed)</option>
                <option value="LIKE_NEW">Like New (Mint)</option>
                <option value="EXCELLENT">Excellent Condition</option>
                <option value="GOOD">Good Condition</option>
                <option value="FAIR">Fair Condition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              Description & Specifications *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe condition, technical specs, accessories included, and provenance..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 resize-none"
            />
            {validationErrors.description && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.description}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* STEP 2: MEDIA & IMAGE DRAG-DROP AREA */}
      {currentStep === 2 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
            Product Photos (Drag & Drop or Add Image URL)
          </label>

          {/* Interactive Drag & Drop Box Simulator */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-950/60 text-center hover:border-cyan-400 transition-colors">
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-semibold text-slate-200">
              Drag & Drop high-resolution product media here
            </p>
            <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP up to 20MB</p>

            <div className="mt-4 flex items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste image URL (e.g. Unsplash URL)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <Button onClick={handleAddImage} variant="secondary" size="sm">
                Add Image
              </Button>
            </div>
          </div>

          {validationErrors.images && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.images}
            </p>
          )}

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 h-24 bg-slate-900">
                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-red-400 hover:text-red-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-500/40">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* STEP 3: PRICING & FLOW FINANCE */}
      {currentStep === 3 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Asking Price ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-cyan-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="2400"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
              {validationErrors.price && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Location City / District
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Neo Tokyo / Shibuya"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Rivers Flow Finance Toggle Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Zap className="w-5 h-5 fill-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Enable Rivers Flow BNPL</h4>
                  <p className="text-xs text-slate-400">
                    Buyers can split payments into 4 installments. You get paid 100% upfront in Escrow.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.flowFinanceEligible}
                onChange={(e) => setFormData({ ...formData, flowFinanceEligible: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              Search Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag (e.g. Carbon, Watercraft)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <Button onClick={handleAddTag} variant="secondary" size="sm">
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 text-cyan-300 border border-slate-800 flex items-center gap-1"
                >
                  #{tag}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-400"
                    onClick={() =>
                      setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== idx) })
                    }
                  />
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 4: PREVIEW & PUBLISH */}
      {currentStep === 4 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Listing Live Preview
          </h4>

          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row gap-4">
            <img
              src={formData.images[0]}
              alt="Preview"
              className="w-full sm:w-40 h-32 rounded-xl object-cover border border-slate-800"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="cyan" size="sm">
                  {formData.condition}
                </Badge>
                {formData.flowFinanceEligible && (
                  <Badge variant="neon" size="sm">
                    <Zap className="w-3 h-3 fill-cyan-400" /> Rivers Flow
                  </Badge>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-1">{formData.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{formData.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                <span className="text-xl font-extrabold font-mono text-cyan-400">
                  ${formData.price.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-500">{formData.location}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between">
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1) as any)}
          disabled={currentStep === 1}
          variant="ghost"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        {currentStep < 4 ? (
          <Button onClick={handleNextStep} variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue to Step {currentStep + 1}
          </Button>
        ) : (
          <Button
            onClick={handleSubmitListing}
            variant="primary"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Publish Listing Live
          </Button>
        )}
      </div>
    </Modal>
  );
};
