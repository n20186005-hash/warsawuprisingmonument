import { useTranslations, useMessages } from 'next-intl';

type ComparisonItem = {
  name: string;
  nameLocal: string;
  type: string;
  location: string;
  commemorates: string;
  access: string;
  note: string;
};

export default function ComparisonSection() {
  const t = useTranslations('comparison');
  const messages = useMessages() as any;
  const items = (messages?.comparison?.items || []) as ComparisonItem[];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-4 text-center"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-6 mx-auto" style={{ background: 'var(--accent)' }} />
        <p
          className="text-lg leading-relaxed text-center mb-12 max-w-3xl mx-auto"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.nameLocal}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                boxShadow: index === 0 ? '0 0 0 2px var(--accent)' : 'none',
              }}
            >
              <div className="mb-5">
                <h3
                  className="font-display text-xl font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.name}
                </h3>
                <p className="text-sm italic mt-1" style={{ color: 'var(--text-muted)' }}>
                  {item.nameLocal}
                </p>
              </div>

              <dl className="space-y-3 text-sm flex-1">
                <Row label={t('labels.type')} value={item.type} />
                <Row label={t('labels.location')} value={item.location} />
                <Row label={t('labels.commemorates')} value={item.commemorates} />
                <Row label={t('labels.access')} value={item.access} />
              </dl>

              <div
                className="mt-5 rounded-lg px-3 py-2 text-sm"
                style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--text-primary)' }}
              >
                {item.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
      <dt className="uppercase tracking-wide text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </dt>
      <dd className="font-medium" style={{ color: 'var(--text-primary)' }}>
        {value}
      </dd>
    </div>
  );
}
