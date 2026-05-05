'use client';

import React, { useRef, useState } from 'react';
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
import styles from './AddProductForm.module.scss';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { AdminRoutes } from '@/lib/routes';
import { resolveProductImageSrc } from '@/lib/shop/format';
import {
  PRODUCT_IMAGE_ACCEPT,
  PRODUCT_IMAGE_ACCEPTED_MIME_TYPES,
  PRODUCT_IMAGE_MAX_SIZE_BYTES,
} from '@/lib/constants';
import {
  ToastNotification,
  type ToastMessage,
} from '@/components/ToastNotification/ToastNotification';

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
  const [validationToast, setValidationToast] = useState<ToastMessage | null>(null);
  const allowedImageTypes = new Set<string>(PRODUCT_IMAGE_ACCEPTED_MIME_TYPES);

  const atMax = draft.imagePaths.length >= maxImages;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!allowedImageTypes.has(file.type)) {
      setValidationToast({ message: t('productImageFormatError'), severity: 'warning' });
      e.target.value = '';
      return;
    }
    if (file.size > PRODUCT_IMAGE_MAX_SIZE_BYTES) {
      setValidationToast({ message: t('productImageFormatError'), severity: 'warning' });
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
        <Alert severity="warning" className={styles.duplicateAlert}>
          <Typography variant="body2" className={styles.duplicateTitle}>
            {t('productDuplicateWarningTitle')}
          </Typography>
          {similarProducts.map((item) => (
            <Box
              key={item.id}
              className={styles.duplicateItem}
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
          <Box className={styles.duplicateActions}>
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
        <Typography variant="h5" className={styles.title}>
          {t('addProductPageTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('addProductPageSubtitle')}
        </Typography>
      </header>
      <Box className={styles.formGrid}>
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
          className={styles.fullWidthField}
        />
        <Box className={styles.fullWidthField}>
          <Typography variant="body2" className={styles.imageLabel}>
            {t('productFieldPhotoUrl')} * ({draft.imagePaths.length}/{maxImages})
          </Typography>

          {/* Image cards */}
          {draft.imagePaths.length > 0 && (
            <Box className={styles.imageList}>
              {draft.imagePaths.map((path, index) => (
                <Box key={path + String(index)} className={styles.imageItem}>
                  <Card
                    variant="outlined"
                    className={styles.imageCard}
                  >
                    <CardMedia component="div" className={styles.imageMedia}>
                      <Image
                        src={resolveProductImageSrc(path)}
                        alt={`${t('productImageRemoveAlt')} ${index + 1}`}
                        fill
                        className={styles.containImage}
                        unoptimized
                      />
                    </CardMedia>
                  </Card>
                  <IconButton
                    size="small"
                    aria-label={t('productImageRemoveAlt')}
                    onClick={() => removeImage(index)}
                    className={styles.removeImageButton}
                  >
                    <CloseIcon className={styles.smallIcon} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Add image button */}
          <Box className={styles.imageActions}>
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
            accept={PRODUCT_IMAGE_ACCEPT}
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
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
      <ToastNotification
        toast={validationToast}
        onClose={() => setValidationToast(null)}
        autoHideDuration={4000}
      />
    </>
  );
}
