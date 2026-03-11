import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-3xl font-bold text-blue-600">🚀 Dloop</div>
          <nav className="hidden md:flex space-x-6 text-gray-700">
            <a href="#come-funziona" className="hover:text-blue-600">Come funziona</a>
            <a href="#dealer" className="hover:text-blue-600">Per Dealer</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Ordina dai tuoi Negozi Preferiti
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Consegna veloce in 30-45 minuti. Dai migliori dealer di Napoli.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
            <Link
              href="/catalog"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg"
            >
              🛍️ Ordina Ora
            </Link>
            <Link
              href="/chat"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
            >
              💬 Chat con Bot
            </Link>
            <a
              href="#dealer"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition"
            >
              📱 Diventa Partner
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 max-w-2xl mx-auto">
            <div>
              <div className="text-4xl font-bold">🏪</div>
              <p className="text-blue-100 mt-2">4 Dealer</p>
            </div>
            <div>
              <div className="text-4xl font-bold">🚚</div>
              <p className="text-blue-100 mt-2">30-45 min</p>
            </div>
            <div>
              <div className="text-4xl font-bold">📍</div>
              <p className="text-blue-100 mt-2">Napoli</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="come-funziona" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Come Funziona
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900">Sfoglia Catalogo</h3>
              <p className="text-gray-600">
                Scopri i migliori dealer di Napoli e i loro prodotti
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900">Aggiungi al Carrello</h3>
              <p className="text-gray-600">
                Seleziona i prodotti che preferisci con un click
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900">Paga Sicuro</h3>
              <p className="text-gray-600">
                Checkout rapido e sicuro con Stripe
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-4">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                4️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900">Ricevi Ordine</h3>
              <p className="text-gray-600">
                Traccia il tuo ordine in tempo reale
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEALERS SECTION */}
      <section id="dealer" className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">I Nostri Dealer</h2>
            <p className="text-xl text-gray-600">
              I migliori negozi di Napoli, direttamente su Dloop
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Dealer Cards */}
            {[
              { emoji: '🐾', name: 'Toelettatura Pet', category: 'Prodotti per animali', desc: 'Tutto per i tuoi amici a 4 zampe' },
              { emoji: '🛒', name: 'Piccolo Supermarket', category: 'Generi alimentari', desc: 'Spesa fresca e conveniente' },
              { emoji: '🥬', name: 'NaturaSì Vomero', category: 'Biologico', desc: 'Prodotti naturali e sostenibili' },
              { emoji: '👔', name: 'Yamamay/Carpisa', category: 'Moda & Accessori', desc: 'Collezioni esclusive e trendy' },
            ].map((dealer) => (
              <div key={dealer.name} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{dealer.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900">{dealer.name}</h3>
                <p className="text-sm text-blue-600 font-semibold mt-1">{dealer.category}</p>
                <p className="text-gray-600 mt-3">{dealer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-blue-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Perché Scegliere Dloop?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="text-4xl">⚡</div>
              <h3 className="text-xl font-bold text-gray-900">Super Veloce</h3>
              <p className="text-gray-600">Consegna in 30-45 minuti, non di più</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">🔒</div>
              <h3 className="text-xl font-bold text-gray-900">Pagamento Sicuro</h3>
              <p className="text-gray-600">Stripe verificato per transazioni protette</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">📍</div>
              <h3 className="text-xl font-bold text-gray-900">Tracciamento Real-Time</h3>
              <p className="text-gray-600">Vedi esattamente dove è il tuo ordine</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">💬</div>
              <h3 className="text-xl font-bold text-gray-900">Supporto WhatsApp</h3>
              <p className="text-gray-600">Parla con noi direttamente su WhatsApp</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">📱</div>
              <h3 className="text-xl font-bold text-gray-900">App Installabile</h3>
              <p className="text-gray-600">PWA - come un'app nativa sul tuo phone</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl">🎁</div>
              <h3 className="text-xl font-bold text-gray-900">Offerte Esclusive</h3>
              <p className="text-gray-600">Sconti e promo dai nostri dealer partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEALER CTA */}
      <section id="dealer-cta" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Sei un Dealer? Unisciti a Dloop
          </h2>
          <p className="text-lg text-blue-100">
            Raggiungi più clienti, aumenta le tue vendite, gestisci ordini facilmente
          </p>
          <a
            href="https://wa.me/39328?text=Salve%2C%20sono%20interessato%20a%20diventare%20dealer%20Dloop"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
          >
            💬 Contattaci su WhatsApp
          </a>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-4 text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Pronto a Ordinare?
        </h2>
        <Link
          href="/catalog"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg font-bold text-lg transition shadow-lg"
        >
          🛍️ Vai al Catalogo
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-white font-bold">🚀 Dloop - Consegna Locale Made Easy</p>
          <p className="text-sm">© 2026 Dloop. Tutti i diritti riservati.</p>
          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Termini</a>
            <a href="#" className="hover:text-white">Contatti</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
