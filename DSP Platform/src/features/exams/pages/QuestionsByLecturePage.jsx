
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Eye,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

const lectures = [
  {
    id: 1,
    title: 'Lecture title',
    files: [
      {
        id: 1,
        name: 'Question file 01',
        url: '/pdfs/lecture-01-questions-01.pdf',
      },
      {
        id: 2,
        name: 'Question file 02',
        url: '/pdfs/lecture-01-questions-02.pdf',
      },
    ],
  },
  {
    id: 2,
    title: 'Lecture title',
    files: [
      {
        id: 1,
        name: 'Question file 01',
        url: '/pdfs/lecture-02-questions-01.pdf',
      },
    ],
  },
  {
    id: 3,
    title: 'Lecture title',
    files: [],
  },
  {
    id: 4,
    title: 'Lecture title',
    files: [
      {
        id: 1,
        name: 'Question file 01',
        url: '/pdfs/lecture-04-questions-01.pdf',
      },
      {
        id: 2,
        name: 'Question file 02',
        url: '/pdfs/lecture-04-questions-02.pdf',
      },
    ],
  },
];

const QuestionsByLecturePage = () => {
  const totalFiles = lectures.reduce(
    (total, lecture) => total + lecture.files.length,
    0
  );

  return (
    <div className="min-h-screen -m-4 sm:-m-6 bg-gradient-to-br from-lime-50 via-white to-sky-100 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link
            to="/exams"
            className="transition-colors hover:text-[#173b46]"
          >
            Exam Bank
          </Link>

          <ChevronRight size={13} />

          <span className="font-medium text-[#173b46]">
            Questions by Lecture
          </span>
        </nav>

        {/* Header */}
        <header className="mb-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-[36px] font-bold leading-tight tracking-[-0.03em] text-[#17343d] sm:text-5xl lg:text-[52px]">
                Questions by Lecture
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Question PDFs grouped by lecture or topic.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-sky-600" />
              {totalFiles} PDF files
            </span>
          </div>
        </header>

        {/* Lectures */}
        <main className="space-y-6">
          {lectures.map((lecture) => (
            <section key={lecture.id}>

              {/* Lecture Header */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-5">
                  <h2 className="text-base font-bold text-[#17343d]">
                    Lecture {String(lecture.id).padStart(2, '0')}
                  </h2>

                  <span className="text-xs text-slate-500">
                    {lecture.title}
                  </span>
                </div>

                <span
                  className={`rounded-full border px-4 py-1 text-[10px] font-medium ${lecture.files.length === 0
                    ? 'border-orange-100 bg-orange-50 text-orange-600'
                    : 'border-slate-200 bg-white text-[#17343d]'
                    }`}
                >
                  {lecture.files.length === 0
                    ? 'No files'
                    : `${lecture.files.length} ${lecture.files.length === 1 ? 'file' : 'files'
                    }`}
                </span>
              </div>

              {/* File List */}
              {lecture.files.length > 0 ? (
                <div className="space-y-2">
                  {lecture.files.map((file) => (
                    <div
                      key={file.id}
                      className="group flex flex-wrap items-center justify-between gap-3 rounded-full border border-slate-200/90 bg-white/75 px-3 py-2 transition-all duration-200 hover:border-lime-200 hover:bg-white hover:shadow-sm sm:px-4"
                    >
                      {/* File Name */}
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-100 text-[#173b46]">
                          <FileText size={15} strokeWidth={1.8} />
                        </div>

                        <Link
                          to={`/exams/questions/${lecture.id}/${file.id}`}
                          className="truncate text-xs font-semibold text-[#17343d] transition-colors hover:text-sky-700"
                        >
                          {file.name}
                        </Link>
                      </div>

                      {/* Lecture Name */}
                      <span className="hidden text-xs text-slate-500 md:block">
                        Lecture {String(lecture.id).padStart(2, '0')}
                      </span>

                      {/* PDF Badge */}
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-[#17343d]">
                        PDF
                      </span>

                      {/* Actions */}
                      <div className="ml-auto flex shrink-0 items-center gap-2">
                        <a
                          href={file.url}
                          download
                          aria-label={`Download ${file.name}`}
                          title="Download PDF"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[#17343d] transition-colors hover:border-lime-300 hover:bg-lime-100"
                        >
                          <Download size={14} strokeWidth={1.8} />
                        </a>

                        <Link
                          to={`/exams/questions/${lecture.id}/${file.id}`}
                          aria-label={`Preview ${file.name}`}
                          className="inline-flex h-8 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-[#17343d] transition-colors hover:border-lime-300 hover:bg-lime-50"
                        >
                          <Eye size={14} strokeWidth={1.8} />
                          Preview
                        </Link>

                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-full border border-dashed border-slate-200 bg-white/40 px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <BookOpen size={15} strokeWidth={1.8} />
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    No question file is available for this lecture yet.
                  </p>
                </div>
              )}
            </section>
          ))}
        </main>

        {/* Back to Exam Bank */}
        <div className="mt-10 border-t border-slate-200/70 pt-5">
          <Link
            to="/exams"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#173b46] transition-colors hover:text-sky-700"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Exam Bank
          </Link>
        </div>

      </div>
    </div>
  );
};

export default QuestionsByLecturePage;
