
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  Download,
  ArrowLeft,
  Minus,
  Plus,
  FileText,
} from 'lucide-react';

const lectures = [
  {
    id: 1,
    files: [
      { id: 1, name: 'Question file 01' },
      { id: 2, name: 'Question file 02' },
    ],
  },
  {
    id: 2,
    files: [
      { id: 1, name: 'Question file 01' },
    ],
  },
  {
    id: 3,
    files: [],
  },
  {
    id: 4,
    files: [
      { id: 1, name: 'Question file 01' },
      { id: 2, name: 'Question file 02' },
    ],
  },
];

const QuestionPdfPage = () => {
  const { lectureId, fileId } = useParams();

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages] = useState(1);
  const [scale, setScale] = useState(1);

  const lecture = lectures.find(
    (item) => item.id === Number(lectureId)
  );

  const file = lecture?.files.find(
    (item) => item.id === Number(fileId)
  );

  if (!file || !lecture) {
    return (
      <div className="min-h-screen p-8 text-[#17343d]">
        <h1 className="text-2xl font-bold">File not found</h1>

        <Link
          to="/exams/questions"
          className="mt-4 inline-block text-sky-700 underline"
        >
          Back to questions
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen -m-4 sm:-m-6 bg-gradient-to-br from-lime-50 via-white to-sky-100 px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Breadcrumb */}
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <Link to="/exams" className="hover:text-[#173b46]">
            Exam Bank
          </Link>

          <ChevronRight size={12} />

          <Link
            to="/exams/questions"
            className="hover:text-[#173b46]"
          >
            Questions by Lecture
          </Link>

          <ChevronRight size={12} />

          <span className="font-semibold text-[#17343d]">
            {file.name}
          </span>
        </nav>

        {/* Toolbar */}
        <header className="mb-3 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm">

          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/exams/questions"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-[#17343d] hover:bg-lime-50"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to questions</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-bold text-[#17343d] sm:text-sm">
                {file.name}
              </h1>

              <p className="text-[10px] text-slate-500">
                Questions · Lecture {String(lecture.id).padStart(2, '0')}
              </p>
            </div>

            <span className="hidden rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-[#17343d] sm:inline-block">
              File
            </span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPageNumber(1)}
              disabled={pageNumber === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="min-w-[35px] text-center text-[10px] font-semibold text-[#17343d]">
              {pageNumber} / {numPages}
            </span>

            <button
              type="button"
              onClick={() => setPageNumber(1)}
              disabled={pageNumber === numPages}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => setScale((value) => Math.max(0.5, value - 0.1))}
              disabled={scale <= 0.5}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 disabled:opacity-40"
              aria-label="Zoom out"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-[35px] text-center text-[10px] font-semibold text-[#17343d]">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              onClick={() => setScale((value) => Math.min(2, value + 0.1))}
              disabled={scale >= 2}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 disabled:opacity-40"
              aria-label="Zoom in"
            >
              <Plus size={14} />
            </button>

            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-lime-300 px-4 py-2 text-xs font-semibold text-[#17343d] opacity-70"
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </header>

        {/* Placeholder Viewer */}
        <main className="h-[65vh] min-h-[450px] overflow-auto rounded-[24px] border border-slate-200/80 bg-[#f3f7f8] p-4 sm:h-[72vh] sm:p-6">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e8f0f2] px-3 py-1 text-[10px] text-slate-600">
            <span className="h-2 w-2 rounded-full bg-cyan-600" />
            File preview
          </div>

          <div className="flex justify-center">
            <div
              className="min-h-[500px] w-full max-w-[600px] origin-top rounded-md bg-white p-8 shadow-lg transition-transform duration-200 sm:p-10"
              style={{ transform: `scale(${scale})` }}
            >
              <div className="mb-8 flex items-center gap-3">
                <FileText size={28} className="text-[#173b46]" />

                <div>
                  <h2 className="text-sm font-bold text-[#17343d]">
                    {file.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Lecture {String(lecture.id).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                <div className="h-2 w-1/3 rounded-full bg-slate-100" />

                <div className="space-y-2 pt-4">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className="h-2 rounded-full bg-slate-100"
                      style={{
                        width: `${index % 3 === 0 ? 100 : index % 3 === 1 ? 92 : 96}%`,
                      }}
                    />
                  ))}
                </div>

                <div className="my-7 h-28 rounded-lg border border-slate-200 bg-slate-50" />

                <div className="space-y-2">
                  {Array.from({ length: 7 }, (_, index) => (
                    <div
                      key={index}
                      className="h-2 rounded-full bg-slate-100"
                      style={{
                        width: `${index % 3 === 1 ? 90 : index % 3 === 2 ? 96 : 100}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-10 border-t border-slate-100 pt-4 text-center text-[10px] text-slate-400">
                Preview placeholder · Page {pageNumber}
              </p>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default QuestionPdfPage;
