'use client';

import Image from 'next/image';
import MuiButton from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MuiCard from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { BackendUser } from '@/types/api/user';
import styles from './UserCards.module.scss';

interface UserCardProps {
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly badgeLabel: string;
  readonly detailsLabel: string;
  readonly testIdPrefix?: string;
}

interface UserCardsProps {
  readonly users: BackendUser[];
  readonly cardUnknownUserLabel: string;
  readonly cardIdPrefixLabel: string;
  readonly cardBadgeLabel: string;
  readonly cardDetailsLabel: string;
  readonly cardImageAltLabel: string;
}

// â”€â”€ Single card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function UserCard({
  imageSrc,
  imageAlt,
  title,
  description,
  content,
  badgeLabel,
  detailsLabel,
  testIdPrefix,
}: Readonly<UserCardProps>) {
  return (
    <MuiCard
      data-testid={testIdPrefix ? `${testIdPrefix}-card` : undefined}
      variant="outlined"
      className={styles.card}
    >
      <Box
        data-testid={testIdPrefix ? `${testIdPrefix}-overlay` : undefined}
        className={styles.overlay}
      />
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={500}
        height={300}
        data-testid={testIdPrefix ? `${testIdPrefix}-image` : undefined}
        className="relative z-20 aspect-video w-full object-cover brightness-75 dark:brightness-50"
      />
      <CardHeader
        title={
          <Typography
            variant="subtitle1"
            className={styles.title}
            data-testid={testIdPrefix ? `${testIdPrefix}-title` : undefined}
          >
            {title}
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            color="text.secondary"
            data-testid={testIdPrefix ? `${testIdPrefix}-description` : undefined}
          >
            {description}
          </Typography>
        }
        action={
          <Chip
            label={badgeLabel}
            size="small"
            color="primary"
            data-testid={testIdPrefix ? `${testIdPrefix}-badge` : undefined}
          />
        }
      />
      <CardContent className={styles.cardContent}>
        <Typography
          variant="body2"
          data-testid={testIdPrefix ? `${testIdPrefix}-content` : undefined}
        >
          {content}
        </Typography>
      </CardContent>
      <CardActions>
        <MuiButton
          variant="contained"
          fullWidth
          disableElevation
          data-testid={testIdPrefix ? `${testIdPrefix}-details-button` : undefined}
          className={styles.detailsButton}
        >
          {detailsLabel}
        </MuiButton>
      </CardActions>
    </MuiCard>
  );
}

// â”€â”€ Grid of cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function UserCards({
  users,
  cardUnknownUserLabel,
  cardIdPrefixLabel,
  cardBadgeLabel,
  cardDetailsLabel,
  cardImageAltLabel,
}: Readonly<UserCardsProps>) {
  return (
    <Box data-testid="admin-users-grid" className={styles.grid}>
      {users.map((user, index) => {
        const fullName = [user.firstname, user.secondname, user.lastname]
          .filter(Boolean)
          .join(' ')
          .trim();

        return (
          <UserCard
            key={user.id}
            imageSrc="/user-card-placeholder.svg"
            imageAlt={cardImageAltLabel}
            title={fullName || cardUnknownUserLabel}
            description={user.email}
            content={`${cardIdPrefixLabel}: ${user.id}`}
            badgeLabel={cardBadgeLabel}
            detailsLabel={cardDetailsLabel}
            testIdPrefix={`admin-user-card-${index}`}
          />
        );
      })}
    </Box>
  );
}

export { UserCards, UserCard };
export type { UserCardsProps, UserCardProps };
