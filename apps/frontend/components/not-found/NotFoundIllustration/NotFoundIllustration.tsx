import Box from '@mui/material/Box';
import styles from './NotFoundIllustration.module.scss';

export function NotFoundIllustration() {
  return (
    <Box className={styles.wrapper} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 400 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="404 illustration"
      >
        {/* Background circle */}
        <circle cx="200" cy="175" r="140" className={styles.bgCircle} />

        {/* Large "4" left */}
        <text
          x="105"
          y="200"
          textAnchor="middle"
          className={styles.digit}
          fontSize="140"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          4
        </text>

        {/* Large "0" center — broken ring */}
        <circle
          cx="200"
          cy="150"
          r="42"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
          className={styles.zeroRing}
        />
        <line
          x1="228"
          y1="122"
          x2="248"
          y2="100"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className={styles.zeroBreak}
        />

        {/* Large "4" right */}
        <text
          x="295"
          y="200"
          textAnchor="middle"
          className={styles.digit}
          fontSize="140"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          4
        </text>

        {/* Question mark */}
        <text
          x="200"
          y="270"
          textAnchor="middle"
          className={styles.questionMark}
          fontSize="28"
          fontWeight="600"
          fontFamily="system-ui, sans-serif"
        >
          ?
        </text>

        {/* Decorative dots */}
        <circle cx="80" cy="80" r="6" className={styles.dot} />
        <circle cx="320" cy="60" r="4" className={styles.dot} />
        <circle cx="340" cy="280" r="5" className={styles.dot} />
        <circle cx="60" cy="290" r="3" className={styles.dot} />
        <circle cx="150" cy="50" r="3" className={styles.dot} />
        <circle cx="280" cy="310" r="4" className={styles.dot} />

        {/* Wavy line at bottom */}
        <path
          d="M80 310 Q120 290, 160 310 T240 310 T320 310"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className={styles.wavyLine}
        />
      </svg>
    </Box>
  );
}
