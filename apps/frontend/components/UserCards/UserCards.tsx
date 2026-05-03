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
      sx={{
        position: 'relative',
        mx: 'auto',
        width: '100%',
        maxWidth: 384,
        overflow: 'hidden',
        pt: 0,
      }}
    >
      <Box
        data-testid={testIdPrefix ? `${testIdPrefix}-overlay` : undefined}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 30,
          aspectRatio: '16/9',
          bgcolor: 'rgba(0,0,0,0.30)',
        }}
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
            sx={{ fontWeight: 600 }}
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
      <CardContent sx={{ pt: 0 }}>
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
          sx={{
            bgcolor: 'var(--accent)',
            color: 'var(--accent-foreground)',
            '&:hover': { bgcolor: 'rgba(var(--accent-rgb, 217 179 16) / 0.85)' },
          }}
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
    <div
      data-testid="admin-users-grid"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
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
    </div>
  );
}

export { UserCards, UserCard };
export type { UserCardsProps, UserCardProps };
