import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SafeImage } from '../components/common/SafeImage';
import { PublicLayout } from '../components/layout/PublicLayout';
import { useSiteData } from '../context/SiteDataContext';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { articles } = useSiteData();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#0F2747]">Artikel Tidak Ditemukan</h1>
          <p className="text-sm text-slate-600">
            Artikel yang Anda cari tidak tersedia atau telah diarsipkan.
          </p>
          <Link
            to="/wawasan"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0756B8] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Artikel</span>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <Link
            to="/wawasan"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0756B8] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Wawasan</span>
          </Link>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#0756B8]">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{article.publishedDate}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readMinutes} menit baca</span>
              <span aria-hidden="true">·</span>
              <span>{article.authorName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2747] leading-tight">
              {article.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {article.coverImageUrl && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <SafeImage
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 space-y-4 text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm font-medium text-[#0F2747]">
              Ingin mendiskusikan penerapan modul ini di laboratorium Anda?
            </div>
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#0756B8] rounded-lg hover:bg-[#0F2747] transition-colors whitespace-nowrap"
            >
              Minta Konsultasi
            </Link>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}
