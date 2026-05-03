type GlobalPageLoadingProps = {
  readonly title: string;
  readonly subtitle: string;
};

export function GlobalPageLoading({ title, subtitle }: Readonly<GlobalPageLoadingProps>) {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6">
      <div className="size-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
