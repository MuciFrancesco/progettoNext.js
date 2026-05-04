'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MuiButton from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { CreateProductInput, PRODUCT_CATEGORIES } from '@/types/api/product';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { AdminRoutes } from '@/lib/routes';
import { resolveProductImageSrc } from '@/lib/shop/format';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

type SimilarProduct = {
  id: string;
  title: string;
  name: string;
  imagePath: string;
  stockQuantity: number;
};

export default function AddProductForm({
  locale,
  draft,
  setDraft,
  submit,
  isPending,
  message,
  onImagesSelect,
  removeImage,
  imageUploading,
  similarProducts,
  confirmDuplicate,
  cancelDuplicate,
  maxImages,
}: Readonly<{
  locale: Locale;
  draft: CreateProductInput;
  setDraft: React.Dispatch<React.SetStateAction<CreateProductInput>>;
  submit: () => void;
  isPending: boolean;
  message?: string | null;
  onImagesSelect: (file: File) => void;
  removeImage: (index: number) => void;
  imageUploading: boolean;
  similarProducts: SimilarProduct[];
  confirmDuplicate: () => void;
  cancelDuplicate: () => void;
  maxImages: number;
}>) {
  const t = createTranslator(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const atMax = draft.imagePaths.length >= maxImages;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      alert(t('productImageFormatError'));
      e.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert(t('productImageFormatError'));
      e.target.value = '';
      return;
    }
    onImagesSelect(file);
    e.target.value = '';
  }

  function handleGoToEdit(product: SimilarProduct) {
    const params = new URLSearchParams({ q: product.name, id: product.id });
    router.push(`${AdminRoutes.UPDATE_PRODUCT}?${params.toString()}`);
  }

  return (
    <>
      {similarProducts.length > 0 ? (
        <Alert severity="warning" sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {t('productDuplicateWarningTitle')}
          </Typography>
          {similarProducts.map((item) => (
            <Box
              key={item.id}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}
            >
              <Typography variant="body2">
                {item.title} ({item.name})
              </Typography>
              <MuiButton
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => handleGoToEdit(item)}
              >
                {t('productDuplicateGoToEdit')}
              </MuiButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <MuiButton
              size="small"
              variant="contained"
              onClick={confirmDuplicate}
              disabled={isPending}
            >
              {t('productDuplicateCreateAnyway')}
            </MuiButton>
            <MuiButton size="small" variant="outlined" onClick={cancelDuplicate}>
              {t('productDuplicateCancel')}
            </MuiButton>
          </Box>
        </Alert>
      ) : null}
      {!similarProducts.length && message ? (
        <Alert severity="info" variant="outlined">
          {message}
        </Alert>
      ) : null}
      <header>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('addProductPageTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('addProductPageSubtitle')}
        </Typography>
      </header>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { md: '1fr 1fr' } }}>
        <TextField
          label={`${t('productFieldTitle')} *`}
          fullWidth
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <TextField
          label={`${t('productFieldName')} *`}
          fullWidth
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <TextField
          label={`${t('productFieldDescription')} *`}
          fullWidth
          multiline
          minRows={4}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          sx={{ gridColumn: { md: 'span 2' } }}
        />
        <Box sx={{ gridColumn: { md: 'span 2' } }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            {t('productFieldPhotoUrl')} * ({draft.imagePaths.length}/{maxImages})
          </Typography>

          {/* Image cards */}
          {draft.imagePaths.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1.5 }}>
              {draft.imagePaths.map((path, index) => (
                <Box key={path + String(index)} sx={{ position: 'relative', flexShrink: 0 }}>
                  <Card
                    variant="outlined"
                    sx={{ width: 88, height: 88, borderRadius: 2, overflow: 'hidden' }}
                  >
                    <CardMedia component="div" sx={{ width: 88, height: 88, position: 'relative' }}>
                      <Image
                        src={resolveProductImageSrc(path)}
                        alt={`${t('productImageRemoveAlt')} ${index + 1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                        unoptimized
                      />
                    </CardMedia>
                  </Card>
                  <IconButton
                    size="small"
                    aria-label={t('productImageRemoveAlt')}
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': { backgroundColor: 'error.light', color: 'white' },
                      width: 22,
                      height: 22,
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Add image button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip
              title={atMax ? t('productImageMaxReached') : ''}
              disableHoverListener={!atMax}
              disableFocusListener={!atMax}
              disableTouchListener={!atMax}
            >
              <span>
                <MuiButton
                  variant="outlined"
                  size="small"
                  startIcon={<AddPhotoAlternateIcon />}
                  disabled={atMax || imageUploading || isPending}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('productImageAddButton')}
                </MuiButton>
              </span>
            </Tooltip>
            {imageUploading && (
              <Typography variant="caption" color="text.secondary">
                {t('productImageUploading')}
              </Typography>
            )}
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={imageUploading || isPending || atMax}
          />
        </Box>
        <TextField
          label={`${t('productFieldMaxOrderQty')} *`}
          type="number"
          slotProps={{ htmlInput: { min: 0 } }}
          value={draft.stockQuantity}
          onChange={(e) => setDraft({ ...draft, stockQuantity: Number(e.target.value) })}
        />
        <FormControl fullWidth>
          <InputLabel>{t('productFieldCategory')}</InputLabel>
          <Select
            value={draft.category}
            label={t('productFieldCategory')}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {t(categoryTranslationKey(cat))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <MuiButton
        variant="contained"
        className="btn-add"
        disabled={isPending || imageUploading || draft.imagePaths.length === 0}
        onClick={submit}
      >
        {t('productSaveButton')}
      </MuiButton>
    </>
  );
}
