import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function ResourcesPage() {
  const { articles } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(articles.map((a) => a.category)))],
    [articles]
  );

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const catOk = selectedCategory === 'Semua' || a.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      const searchOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [articles, selectedCategory, searchTerm]);

  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-sky-50/60 to-white border-b border-slate-200 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold text-[#0756B8]">Wawasan &amp; Referensi</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747]">
              Artikel Teknologi &amp; Kendali Mutu Laboratorium
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Panduan praktis penerapan Smart LIS, aturan Westgard, Delta Check, dan tata kelola operasional laboratorium klinik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-white text-[#0F2747] shadow-sm'
                      : 'text-slate-600 hover:text-[#0F2747]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari topik artikel..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0756B8]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-600">
              Belum ada artikel yang cocok dengan filter pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((article) => (
                <article
                  key={article.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-slate-100 border-b border-slate-200 overflow-hidden">
                      <SafeImage
                        src={article.coverImageUrl}
                        alt={article.title}
                        fallbackLabel={article.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#0756B8]">{article.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{article.publishedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readMinutes} mnt baca</span>
                      </div>

                      <h2 className="text-lg font-bold text-[#0F2747] leading-snug">
                        <Link to={`/wawasan/${article.slug}`} className="hover:text-[#0756B8]">
                          {article.title}
                        </Link>
                      </h2>

                      <p className="text-sm text-slate-600 leading-relaxed">{article.excerpt}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <Link
                      to={`/wawasan/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0756B8] hover:text-[#0F2747]"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
