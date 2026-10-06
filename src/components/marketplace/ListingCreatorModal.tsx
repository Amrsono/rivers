'use client';

import React, { useState, useCallback } from 'react';
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
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
  RefreshCw,
  Tag,
  DollarSign,
  Layers,
  Star,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── AI Mode Types ──────────────────────────────────────────────────────────
type AIMode =
  | 'generate_description'
  | 'suggest_price'
  | 'generate_tags'
  | 'polish_description'
  | 'detect_category'
  | 'score_listing';

interface AIResult {
  mode: AIMode;
  description?: string;
  polished?: string;
  priceMin?: number;
  priceSuggested?: number;
  priceMax?: number;
  tags?: string[];
  categoryId?: string;
  categoryName?: string;
  score?: number;
  scoreBreakdown?: { label: string; score: number; tip: string }[];
}

// ── Score colour helper ────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}
function scoreBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-400';
  return 'bg-red-500';
}

// ── AI Result Panel ────────────────────────────────────────────────────────
interface AIResultPanelProps {
  result: AIResult;
  onApply: (result: AIResult) => void;
  onDismiss: () => void;
  t: (key: string) => string;
}

const AIResultPanel: React.FC<AIResultPanelProps> = ({ result, onApply, onDismiss, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-violet-950/60 via-slate-950 to-cyan-950/40 border border-violet-500/30 shadow-xl shadow-violet-900/20 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
        <span className="text-[11px] font-mono font-semibold text-violet-300 uppercase tracking-wider">
          Rivers AI Suggestion
        </span>
        <button
          onClick={onDismiss}
          className="ml-auto p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content by mode */}
      {(result.mode === 'generate_description' || result.mode === 'polish_description') && (
        <div>
          <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-violet-500/50 pl-3">
            &ldquo;{result.description || result.polished}&rdquo;
          </p>
          <Button
            onClick={() => onApply(result)}
            variant="secondary"
            size="sm"
            className="mt-3"
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            {t('aiApplyDescription')}
          </Button>
        </div>
      )}

      {result.mode === 'suggest_price' && (
        <div>
          <p className="text-xs text-slate-400 mb-2">{t('aiPriceRangeLabel')}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">${result.priceMin?.toLocaleString()}</span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-600 to-violet-500 rounded-full" style={{ width: '60%' }} />
            </div>
            <span className="text-xs font-mono text-slate-500">${result.priceMax?.toLocaleString()}</span>
          </div>
          <div className="mt-2 text-center">
            <span className="text-lg font-extrabold font-mono text-cyan-400">
              ${result.priceSuggested?.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 ml-1">suggested</span>
          </div>
          <Button
            onClick={() => onApply(result)}
            variant="secondary"
            size="sm"
            className="mt-3 w-full"
            leftIcon={<DollarSign className="w-3.5 h-3.5" />}
          >
            {t('aiApplyPrice')}
          </Button>
        </div>
      )}

      {result.mode === 'generate_tags' && (
        <div>
          <p className="text-xs text-slate-400 mb-2">{t('aiTagsGenerated')}</p>
          <div className="flex flex-wrap gap-1.5">
            {result.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2 py-0.5 rounded-lg bg-violet-900/40 text-violet-300 border border-violet-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
          <Button
            onClick={() => onApply(result)}
            variant="secondary"
            size="sm"
            className="mt-3"
            leftIcon={<Tag className="w-3.5 h-3.5" />}
          >
            {t('aiApplyAll')}
          </Button>
        </div>
      )}

      {result.mode === 'detect_category' && (
        <div>
          <p className="text-xs text-slate-400 mb-1">{t('aiCategoryDetected')}</p>
          <span className="text-sm font-semibold text-cyan-300">{result.categoryName}</span>
          <Button
            onClick={() => onApply(result)}
            variant="secondary"
            size="sm"
            className="mt-3"
            leftIcon={<Layers className="w-3.5 h-3.5" />}
          >
            {t('aiApplyCategory')}
          </Button>
        </div>
      )}

      {result.mode === 'score_listing' && (
        <div className="space-y-3">
          {/* Overall score */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0">
              <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={result.score! >= 80 ? '#10b981' : result.score! >= 60 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                  strokeDasharray={`${result.score} ${100 - result.score!}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold font-mono ${scoreColor(result.score!)}`}>
                {result.score}
              </span>
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">{t('aiScoreLabel')}</p>
              <p className={`text-base font-bold ${scoreColor(result.score!)}`}>
                {result.score! >= 80 ? 'Excellent' : result.score! >= 60 ? 'Good — needs polish' : 'Needs work'}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            {result.scoreBreakdown?.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] text-slate-400">{item.label}</span>
                  <span className={`text-[11px] font-mono font-bold ${scoreColor(item.score)}`}>{item.score}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${scoreBarColor(item.score)} transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 italic">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ── AI Trigger Button ──────────────────────────────────────────────────────
interface AITriggerButtonProps {
  label: string;
  tooltip: string;
  icon: React.ReactNode;
  isLoading: boolean;
  onClick: () => void;
}

const AITriggerButton: React.FC<AITriggerButtonProps> = ({ label, tooltip, icon, isLoading, onClick }) => (
  <button
    onClick={onClick}
    title={tooltip}
    disabled={isLoading}
    className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-violet-950/50 border border-violet-500/25 text-violet-300 text-[11px] font-mono font-semibold hover:bg-violet-900/60 hover:border-violet-400/50 hover:text-violet-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
  >
    {isLoading ? (
      <Loader2 className="w-3 h-3 animate-spin" />
    ) : (
      <span className="w-3 h-3 shrink-0">{icon}</span>
    )}
    {label}
    <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);

// ── AI Assist Bar ──────────────────────────────────────────────────────────
interface AIAssistBarProps {
  modes: AIMode[];
  loadingMode: AIMode | null;
  onTrigger: (mode: AIMode) => void;
  t: (key: string) => string;
}

const modeConfig: Record<AIMode, { labelKey: string; tooltipKey: string; icon: React.ReactNode }> = {
  generate_description: {
    labelKey: 'aiGenerateDesc',
    tooltipKey: 'aiGenerateDescTooltip',
    icon: <Wand2 className="w-3 h-3" />,
  },
  polish_description: {
    labelKey: 'aiPolishDesc',
    tooltipKey: 'aiPolishDescTooltip',
    icon: <Sparkles className="w-3 h-3" />,
  },
  detect_category: {
    labelKey: 'aiDetectCategory',
    tooltipKey: 'aiDetectCategoryTooltip',
    icon: <Layers className="w-3 h-3" />,
  },
  suggest_price: {
    labelKey: 'aiSuggestPrice',
    tooltipKey: 'aiSuggestPriceTooltip',
    icon: <DollarSign className="w-3 h-3" />,
  },
  generate_tags: {
    labelKey: 'aiGenerateTags',
    tooltipKey: 'aiGenerateTagsTooltip',
    icon: <Tag className="w-3 h-3" />,
  },
  score_listing: {
    labelKey: 'aiScoreListing',
    tooltipKey: 'aiScoreListingTooltip',
    icon: <Star className="w-3 h-3" />,
  },
};

const AIAssistBar: React.FC<AIAssistBarProps> = ({ modes, loadingMode, onTrigger, t }) => (
  <div className="flex flex-wrap gap-1.5 items-center pt-1">
    <span className="flex items-center gap-1 text-[10px] font-mono text-violet-400/70 uppercase tracking-widest mr-1">
      <Sparkles className="w-2.5 h-2.5" />
      {t('aiAssistLabel')}
    </span>
    {modes.map((mode) => {
      const cfg = modeConfig[mode];
      return (
        <AITriggerButton
          key={mode}
          label={t(cfg.labelKey)}
          tooltip={t(cfg.tooltipKey)}
          icon={cfg.icon}
          isLoading={loadingMode === mode}
          onClick={() => onTrigger(mode)}
        />
      );
    })}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
export const ListingCreatorModal: React.FC = () => {
  const { isListingCreatorOpen, closeListingCreator, addListing, currentUser, t, language } =
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

  // AI state
  const [aiLoadingMode, setAiLoadingMode] = useState<AIMode | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);

  if (!isListingCreatorOpen) return null;

  // ── AI Call ──────────────────────────────────────────────────────────────
  const triggerAI = useCallback(
    async (mode: AIMode) => {
      setAiLoadingMode(mode);
      setAiResult(null);
      try {
        const selectedCat = MOCK_CATEGORIES.find((c) => c.id === formData.categoryId);
        const res = await fetch('/api/ai/enhance-listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode,
            title: formData.title,
            description: formData.description,
            category: selectedCat?.name,
            condition: formData.condition,
            price: formData.price,
            images: formData.images,
          }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAiResult({ mode, ...json.data });
        }
      } catch (e) {
        console.error('AI assist error', e);
      } finally {
        setAiLoadingMode(null);
      }
    },
    [formData]
  );

  // ── Apply AI Result ──────────────────────────────────────────────────────
  const applyAIResult = (result: AIResult) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (result.mode === 'generate_description' && result.description) {
        next.description = result.description;
      }
      if (result.mode === 'polish_description' && result.polished) {
        next.description = result.polished;
      }
      if (result.mode === 'suggest_price' && result.priceSuggested) {
        next.price = result.priceSuggested;
      }
      if (result.mode === 'generate_tags' && result.tags) {
        const merged = Array.from(new Set([...prev.tags, ...result.tags]));
        next.tags = merged;
      }
      if (result.mode === 'detect_category' && result.categoryId) {
        next.categoryId = result.categoryId;
      }
      return next;
    });
    setAiResult(null);
  };

  // ── Image Handlers ───────────────────────────────────────────────────────
  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrlInput.trim()] }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // ── Tag Handlers ─────────────────────────────────────────────────────────
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim().replace(/^#/, '')],
    }));
    setTagInput('');
  };

  // ── Step Navigation ──────────────────────────────────────────────────────
  const handleNextStep = () => {
    setValidationErrors({});
    setAiResult(null);

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

  // ── Final Submit ─────────────────────────────────────────────────────────
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
    { num: 1, nameKey: 'step1BasicInfo' as const },
    { num: 2, nameKey: 'step2MediaUpload' as const },
    { num: 3, nameKey: 'step3PricingFlow' as const },
    { num: 4, nameKey: 'step4PreviewPublish' as const },
  ];

  // Shared AI result panel (shown under whichever step triggered it)
  const aiPanel = aiResult ? (
    <AnimatePresence mode="wait">
      <AIResultPanel
        key={aiResult.mode}
        result={aiResult}
        onApply={applyAIResult}
        onDismiss={() => setAiResult(null)}
        t={t as any}
      />
    </AnimatePresence>
  ) : null;

  return (
    <Modal
      isOpen={isListingCreatorOpen}
      onClose={closeListingCreator}
      title={t('createListingTitle')}
      subtitle={t('createListingSubtitle')}
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
                <span className="text-[11px] font-mono whitespace-nowrap">{t(step.nameKey)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── STEP 1: BASIC INFO ───────────────────────────────────────────── */}
      {currentStep === 1 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              {t('listingTitleLabel')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('titlePlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
            />
            {validationErrors.title && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.title}
              </p>
            )}
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                {t('categoryStreamLabel')}
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
              >
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {t(cat.id as any) !== cat.id ? t(cat.id as any) : cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                {t('conditionLabel')}
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400"
              >
                <option value="NEW">{t('condNew')}</option>
                <option value="LIKE_NEW">{t('condLikeNew')}</option>
                <option value="EXCELLENT">{t('condExcellent')}</option>
                <option value="GOOD">{t('condGood')}</option>
                <option value="FAIR">{t('condFair')}</option>
              </select>
            </div>
          </div>

          {/* Description + AI */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              {t('descSpecsLabel')}
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('descPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 resize-none"
              />
              {aiLoadingMode === 'generate_description' || aiLoadingMode === 'polish_description' ? (
                <div className="absolute inset-0 rounded-xl bg-slate-900/80 backdrop-blur-sm flex items-center justify-center gap-2 text-violet-300 text-xs font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('aiGeneratingLabel')}
                </div>
              ) : null}
            </div>
            {validationErrors.description && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.description}
              </p>
            )}

            {/* AI Assist bar — Step 1 */}
            <AIAssistBar
              modes={['generate_description', 'polish_description', 'detect_category']}
              loadingMode={aiLoadingMode}
              onTrigger={triggerAI}
              t={t as any}
            />
          </div>

          {/* AI Result Panel */}
          {aiResult && (
            ['generate_description', 'polish_description', 'detect_category'].includes(aiResult.mode) &&
            aiPanel
          )}
        </motion.div>
      )}

      {/* ── STEP 2: MEDIA & IMAGE DRAG-DROP ─────────────────────────────── */}
      {currentStep === 2 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
            {t('productPhotosLabel')}
          </label>

          {/* Drag & Drop Box */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-950/60 text-center hover:border-cyan-400 transition-colors">
            <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-pulse" />
            <p className="text-sm font-semibold text-slate-200">{t('dragDropText')}</p>
            <p className="text-xs text-slate-500 mt-1">{t('dragDropSubtext')}</p>

            <div className="mt-4 flex items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder={t('imageUrlPlaceholder')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <Button onClick={handleAddImage} variant="secondary" size="sm">
                {t('addImageBtn')}
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
                  className="absolute top-1 ltr:right-1 rtl:left-1 p-1 rounded-full bg-slate-950/80 text-red-400 hover:text-red-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 ltr:left-1 rtl:right-1 px-1.5 py-0.5 text-[9px] font-mono bg-cyan-950 text-cyan-300 rounded border border-cyan-500/40">
                    {t('coverBadge')}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* AI Readiness tip in step 2 */}
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-300">
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>Tip: Listings with 3+ photos see <strong>2.4× more buyer interest</strong> on Rivers.</span>
          </div>
        </motion.div>
      )}

      {/* ── STEP 3: PRICING & FLOW FINANCE ──────────────────────────────── */}
      {currentStep === 3 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                {t('askingPriceLabel')}
              </label>
              <div className="relative">
                <span className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 font-mono text-cyan-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="2400"
                  className="w-full ltr:pl-8 ltr:pr-4 rtl:pr-8 rtl:pl-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm font-mono font-bold focus:outline-none focus:border-cyan-400"
                />
              </div>
              {validationErrors.price && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.price}
                </p>
              )}
              {/* AI Price Assist */}
              <AIAssistBar
                modes={['suggest_price']}
                loadingMode={aiLoadingMode}
                onTrigger={triggerAI}
                t={t as any}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                {t('locationLabel')}
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

          {/* AI Price Result */}
          {aiResult?.mode === 'suggest_price' && aiPanel}

          {/* Rivers Flow Finance Toggle */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Zap className="w-5 h-5 fill-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{t('enableBnpl')}</h4>
                  <p className="text-xs text-slate-400">{t('enableBnplDesc')}</p>
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

          {/* Tags + AI Tags */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
              {t('searchTagsLabel')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t('addTagPlaceholder')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
              <Button onClick={handleAddTag} variant="secondary" size="sm">
                {t('addTagBtn')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
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
            {/* AI Tag Bar */}
            <AIAssistBar
              modes={['generate_tags']}
              loadingMode={aiLoadingMode}
              onTrigger={triggerAI}
              t={t as any}
            />
            {/* AI Tag Result */}
            {aiResult?.mode === 'generate_tags' && aiPanel}
          </div>
        </motion.div>
      )}

      {/* ── STEP 4: PREVIEW & PUBLISH ────────────────────────────────────── */}
      {currentStep === 4 && (
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            {t('livePreviewHeader')}
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

          {/* AI Score — final review */}
          <div className="pt-1">
            <AIAssistBar
              modes={['score_listing']}
              loadingMode={aiLoadingMode}
              onTrigger={triggerAI}
              t={t as any}
            />
            {aiResult?.mode === 'score_listing' && aiPanel}
          </div>

          {/* Tags preview */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-4 border-t border-slate-900 flex items-center justify-between">
        <Button
          onClick={() => {
            setAiResult(null);
            setCurrentStep((prev) => Math.max(1, prev - 1) as any);
          }}
          disabled={currentStep === 1}
          variant="ghost"
          size="md"
          leftIcon={language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        >
          {t('backBtn')}
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={handleNextStep}
            variant="primary"
            size="md"
            rightIcon={language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {t('continueStepBtn', { step: currentStep + 1 })}
          </Button>
        ) : (
          <Button
            onClick={handleSubmitListing}
            variant="primary"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {t('publishLiveBtn')}
          </Button>
        )}
      </div>
    </Modal>
  );
};
