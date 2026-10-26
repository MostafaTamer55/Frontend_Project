
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  Download,
  Eye,
  ChevronRight,
  ArrowLeft,
  Inbox,
} from 'lucide-react';

// لو مفيش امتحانات، سيب المصفوفة فاضية.
// لو فيه امتحانات، ضيف بياناتها هنا.
const pastExams = [
  // {
  //   id: 1,
  //   name: 'Exam paper 01',
  //   url: '/pdfs/past-exam-01.pdf',
  // },
  // {
  //   id: 2,
  //   name: 'Exam paper 02',
  //   url: '/pdfs/past-exam-02.pdf',
  // },
];

const PastExamsPage = () => {
  return (
    <div className="min-h-screen -m-4 sm:-m-6 bg-gradient-to-br from-[#f2f8e9] via-[#f7fafc] to-[#e0f2fe] px-5 py-8 sm:px-8 sm:py-10 lg:px-12 text-[#17343d]">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <nav className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <Link
            to="/exams"
            className="transition-colors hover:text-[#173b46]"
          >
            Exam Bank
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-[#173b46]">
            Past Exams
          </span>
        </nav>

        {/* Header */}
        <header className="mb-9">
          <h1 className="text-[36px] font-bold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-[52px]">
            Past Exams
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Previous examination papers in PDF format.
          </p>
        </header>

        {/* Show Empty State or Past Exams */}
        {pastExams.length === 0 ? (
          <main className="flex min-h-[380px] flex-col items-center justify-center rounded-[32px] border border-white/60 bg-white/70 p-8 text-center shadow-sm backdrop-blur-md sm:p-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ecfccb] text-[#17343d]">
              <Inbox size={32} strokeWidth={1.8} />
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              No past exams available yet
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500 sm:text-sm">
              Past exam PDFs will appear here once they are published.
            </p>

            <Link
              to="/exams"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Back to Exam Bank
            </Link>
          </main>
        ) : (
          <main className="space-y-2">
            {pastExams.map((exam) => (
              <div
                key={exam.id}
                className="group flex flex-wrap items-center justify-between gap-3 rounded-full border border-slate-200/90 bg-white/75 px-3 py-2 transition-all hover:border-lime-200 hover:bg-white hover:shadow-sm sm:px-4"
              >
                {/* File Name */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-100 text-[#173b46]">
                    <Archive size={15} strokeWidth={1.8} />
                  </div>

                  <Link
                    to={`/exams/past-exams/${exam.id}`}
                    className="truncate text-xs font-semibold transition-colors hover:text-sky-700"
                  >
                    {exam.name}
                  </Link>
                </div>

                {/* Category */}
                <span className="hidden text-xs text-slate-500 md:block">
                  Past exam
                </span>

                {/* File Type */}
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold">
                  PDF
                </span>

                {/* Actions */}
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <a
                    href={exam.url}
                    download
                    aria-label={`Download ${exam.name}`}
                    title="Download PDF"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:border-lime-300 hover:bg-lime-100"
                  >
                    <Download size={14} strokeWidth={1.8} />
                  </a>

                  <Link
                    to={`/exams/past-exams/${exam.id}`}
                    aria-label={`Preview ${exam.name}`}
                    className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium transition-colors hover:border-lime-300 hover:bg-lime-50"
                  >
                    <Eye size={14} strokeWidth={1.8} />
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </main>
        )}

        {/* Back to Exam Bank */}
        <div className="mt-10 border-t border-slate-200/70 pt-5">
          <Link
            to="/exams"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-700"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Exam Bank
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PastExamsPage;
