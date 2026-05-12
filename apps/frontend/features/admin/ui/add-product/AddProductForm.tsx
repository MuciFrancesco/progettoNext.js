'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MuiButton from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
  const [validationAttempted, setValidationAttempted] = useState(false);
  const allowedImageTypes = new Set<string>(PRODUCT_IMAGE_ACCEPTED_MIME_TYPES);

  const atMax = draft.imagePaths.length >= maxImages;
  const featureRows = draft.features ?? [];
  const specificationRows = draft.specifications ?? [];
  const showFieldErrors = validationAttempted;
  const titleError = showFieldErrors && !draft.title.trim();
  const nameError = showFieldErrors && !draft.name.trim();
  const descriptionError = showFieldErrors && !draft.description.trim();
  const imageError = showFieldErrors && draft.imagePaths.length === 0;
  const stockError =
    showFieldErrors && (!Number.isFinite(Number(draft.stockQuantity)) || Number(draft.stockQuantity) < 0);
  const hasFeatureErrors =
    showFieldErrors && featureRows.some((feature) => !feature.text.trim());
  const hasSpecificationErrors =
    showFieldErrors &&
    specificationRows.some(
      (specification) => !specification.label.trim() || !specification.value.trim()
    );

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

  function handleSubmitClick() {
    setValidationAttempted(true);
    if (
      titleError ||
      nameError ||
      descriptionError ||
      imageError ||
      stockError ||
      hasFeatureErrors ||
      hasSpecificationErrors ||
      !draft.title.trim() ||
      !draft.name.trim() ||
      !draft.description.trim() ||
      draft.imagePaths.length === 0 ||
      !Number.isFinite(Number(draft.stockQuantity)) ||
      Number(draft.stockQuantity) < 0 ||
      featureRows.some((feature) => !feature.text.trim()) ||
      specificationRows.some(
        (specification) => !specification.label.trim() || !specification.value.trim()
      )
    ) {
      setValidationToast({ message: t('productFormRequiredFieldsError'), severity: 'warning' });
      return;
    }
    submit();
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
          error={titleError}
          helperText={titleError ? t('productFormRequiredFieldsError') : undefined}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
        <TextField
          label={`${t('productFieldName')} *`}
          fullWidth
          value={draft.name}
          error={nameError}
          helperText={nameError ? t('productFormRequiredFieldsError') : undefined}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <TextField
          label={t('productFieldBrand')}
          fullWidth
          value={draft.brand ?? ''}
          onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
        />
        <TextField
          label={t('productFieldOriginalPrice')}
          type="number"
          slotProps={{ htmlInput: { min: 0 } }}
          value={draft.originalPriceInCents ?? ''}
          onChange={(e) =>
            setDraft({
              ...draft,
              originalPriceInCents: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
        <TextField
          label={`${t('productFieldDescription')} *`}
          fullWidth
          multiline
          minRows={4}
          value={draft.description}
          error={descriptionError}
          helperText={descriptionError ? t('productFormRequiredFieldsError') : undefined}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          className={styles.fullWidthField}
        />
        <Box className={`${styles.fullWidthField} ${imageError ? styles.invalidGroup : ''}`}>
          <Typography variant="body2" className={styles.imageLabel}>
            {t('productFieldPhotoUrl')} * ({draft.imagePaths.length}/{maxImages})
          </Typography>
          {imageError ? (
            <Typography variant="caption" color="error">
              {t('productFormRequiredFieldsError')}
            </Typography>
          ) : null}

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
          error={stockError}
          helperText={stockError ? t('productFormInvalidStockError') : undefined}
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
        <FormControlLabel
          className={styles.fullWidthField}
          control={
            <Checkbox
              checked={draft.isAvailableForPurchase ?? true}
              onChange={(event) =>
                setDraft({ ...draft, isAvailableForPurchase: event.target.checked })
              }
              disabled={isPending}
            />
          }
          label={t('productFieldAvailableForPurchase')}
        />
        <FormControlLabel
          className={styles.fullWidthField}
          control={
            <Checkbox
              checked={draft.isRebuyable ?? false}
              onChange={(event) => setDraft({ ...draft, isRebuyable: event.target.checked })}
              disabled={isPending}
            />
          }
          label={t('productFieldRebuyable')}
        />
        <Box className={styles.fullWidthField}>
          <Typography variant="body2" className={styles.imageLabel}>
            {t('productFeaturesAdminTitle')}
          </Typography>
          <Typography variant="caption" color="text.secondary" className={styles.fieldHelp}>
            {t('productFeaturesAdminHelp')}
          </Typography>
          {featureRows.map((feature, index) => {
            const featureError = showFieldErrors && !feature.text.trim();
            return (
            <Box key={String(index)} className={styles.inlineFields}>
              <TextField
                fullWidth
                value={feature.text}
                label={`${t('productFeatureItemLabel')} ${index + 1}`}
                error={featureError}
                helperText={featureError ? t('productFormRequiredFieldsError') : undefined}
                onChange={(event) => {
                  const features = [...(draft.features ?? [])];
                  features[index] = { ...feature, text: event.target.value };
                  setDraft({ ...draft, features });
                }}
              />
              <MuiButton
                variant="outlined"
                onClick={() =>
                  setDraft({
                    ...draft,
                    features: (draft.features ?? [])
                      .filter((_, featureIndex) => featureIndex !== index)
                      .map((item, nextIndex) => ({ ...item, sortOrder: nextIndex })),
                  })
                }
              >
                Rimuovi
              </MuiButton>
            </Box>
            );
          })}
          <MuiButton
            variant="outlined"
            onClick={() =>
              setDraft({
                ...draft,
                features: [
                  ...(draft.features ?? []),
                  { text: '', sortOrder: draft.features?.length ?? 0 },
                ],
              })
            }
          >
            {t('productFeatureAddButton')}
          </MuiButton>
          {featureRows.length > 0 ? (
            <Box className={styles.previewPanel}>
              <Typography variant="body2" className={styles.previewTitle}>
                {t('productFeaturesPreviewTitle')}
              </Typography>
              <Box className={styles.previewGrid}>
                {featureRows.map((feature, index) => (
                  <Box key={String(index)} className={styles.previewItem}>
                    {feature.text.trim() || t('productFeatureEmptyPreview')}
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
        <Box className={styles.fullWidthField}>
          <Typography variant="body2" className={styles.imageLabel}>
            {t('productSpecsAdminTitle')}
          </Typography>
          <Typography variant="caption" color="text.secondary" className={styles.fieldHelp}>
            {t('productSpecsAdminHelp')}
          </Typography>
          {specificationRows.map((specification, index) => {
            const labelError = showFieldErrors && !specification.label.trim();
            const valueError = showFieldErrors && !specification.value.trim();
            return (
            <Box key={String(index)} className={styles.inlineFields}>
              <TextField
                value={specification.label}
                label={t('productSpecNameLabel')}
                error={labelError}
                helperText={labelError ? t('productFormRequiredFieldsError') : undefined}
                onChange={(event) => {
                  const specifications = [...(draft.specifications ?? [])];
                  specifications[index] = { ...specification, label: event.target.value };
                  setDraft({ ...draft, specifications });
                }}
              />
              <TextField
                value={specification.value}
                label={t('productSpecValueLabel')}
                error={valueError}
                helperText={valueError ? t('productFormRequiredFieldsError') : undefined}
                onChange={(event) => {
                  const specifications = [...(draft.specifications ?? [])];
                  specifications[index] = { ...specification, value: event.target.value };
                  setDraft({ ...draft, specifications });
                }}
              />
              <MuiButton
                variant="outlined"
                onClick={() =>
                  setDraft({
                    ...draft,
                    specifications: (draft.specifications ?? [])
                      .filter((_, specificationIndex) => specificationIndex !== index)
                      .map((item, nextIndex) => ({ ...item, sortOrder: nextIndex })),
                  })
                }
              >
                Rimuovi
              </MuiButton>
            </Box>
            );
          })}
          <MuiButton
            variant="outlined"
            onClick={() =>
              setDraft({
                ...draft,
                specifications: [
                  ...(draft.specifications ?? []),
                  { label: '', value: '', sortOrder: draft.specifications?.length ?? 0 },
                ],
              })
            }
          >
            {t('productSpecAddButton')}
          </MuiButton>
          {specificationRows.length > 0 ? (
            <Box className={styles.previewPanel}>
              <Typography variant="body2" className={styles.previewTitle}>
                {t('productSpecsPreviewTitle')}
              </Typography>
              <Box className={styles.previewGrid}>
                {specificationRows.map((specification, index) => (
                  <Box key={String(index)} className={styles.previewItem}>
                    <strong>
                      {specification.label.trim() || t('productSpecNameLabel')}
                    </strong>
                    <span>
                      {specification.value.trim() || t('productSpecEmptyPreview')}
                    </span>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      <MuiButton
        variant="contained"
        className="btn-add"
        disabled={isPending || imageUploading}
        onClick={handleSubmitClick}
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
