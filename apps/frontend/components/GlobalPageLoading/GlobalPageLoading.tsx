import styles from './GlobalPageLoading.module.scss';

type GlobalPageLoadingProps = {
  readonly title: string;
  readonly subtitle: string;
};

export function GlobalPageLoading({ title, subtitle }: Readonly<GlobalPageLoadingProps>) {
  return (
    <section className={styles.section}>
      <div className={styles.spinner} />
      <div className={styles.textBlock}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
