const FOOTER_LINKS = [
  {
    title: '💡 Think Shop',
    links: ['Chi siamo', 'Lavora con noi', 'Sostenibilità', 'Press'],
  },
  {
    title: 'Assistenza',
    links: ['Centro aiuto', 'Chat live', 'FAQ', 'Traccia ordine'],
  },
  {
    title: 'Acquista',
    links: ['Offerte del giorno', 'Nuovi arrivi', 'Top rated', 'Usato OK'],
  },
  {
    title: 'Legale',
    links: ['Privacy', 'Cookie', 'Termini di servizio', 'GDPR'],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <p className="footer__col-title">{col.title}</p>
            {col.links.map((link) => (
              <button key={link} className="footer__link">
                {link}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        © 2025 Think Shop s.r.l. · P.IVA 12345678901 · Tutti i diritti riservati
      </div>
    </footer>
  )
}
