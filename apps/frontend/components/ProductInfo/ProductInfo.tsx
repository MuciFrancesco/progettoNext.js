import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import type { ProductFeature, ProductSpecification } from '@/types/api/product';
import styles from './ProductInfo.module.scss';

type ProductInfoLabels = {
  readonly featuresTitle: string;
  readonly specsTitle: string;
};

type ProductInfoProps = {
  readonly brand: string | null;
  readonly title: string;
  readonly subtitle: string;
  readonly categoryLabel: string;
  readonly description: string;
  readonly features: readonly ProductFeature[];
  readonly specifications: readonly ProductSpecification[];
  readonly rating: ReactNode;
  readonly labels: ProductInfoLabels;
};

export function ProductInfo({
  brand,
  title,
  subtitle,
  categoryLabel,
  description,
  features,
  specifications,
  rating,
  labels,
}: Readonly<ProductInfoProps>) {
  return (
    <Stack component="section" spacing={2.5} className={styles.content}>
      <Box>
        {brand ? (
          <Typography variant="body2" className={styles.brand}>
            {brand}
          </Typography>
        ) : null}
        <Typography component="h1" variant="h3" className={styles.title}>
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </Box>

      <Box className={styles.ratingRow}>
        {rating}
        <Chip size="small" label={categoryLabel} />
      </Box>

      <Typography>{description}</Typography>

      {features.length ? (
        <Stack spacing={1}>
          <Typography component="h2" variant="h6">
            {labels.featuresTitle}
          </Typography>
          <Box component="ul" className={styles.featureList}>
            {features.map((feature) => (
              <Typography component="li" key={feature.id ?? feature.text}>
                {feature.text}
              </Typography>
            ))}
          </Box>
        </Stack>
      ) : null}

      {specifications.length ? (
        <Stack spacing={1}>
          <Typography component="h2" variant="h6">
            {labels.specsTitle}
          </Typography>
          <Table size="small">
            <TableBody>
              {specifications.map((specification) => (
                <TableRow key={specification.id ?? specification.label}>
                  <TableCell>{specification.label}</TableCell>
                  <TableCell>{specification.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      ) : null}
    </Stack>
  );
}
