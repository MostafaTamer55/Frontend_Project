import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardBody, CardHeader, CardTitle, CardFooter } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { Flag, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export const ExamRunnerPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const mockQuestions = [
    {
      id: 1,
      text: 'For a causal discrete-time LTI system to be bounded-input bounded-output (BIBO) stable, what is the condition on the poles of its transfer function H(z)?',
      options: [
        'All poles must lie strictly outside the unit circle (|z| > 1)',
        'All poles must lie strictly inside the unit circle (|z| < 1)',
        'At least one pole must lie on the real axis',
        'The number of poles must strictly equal the number of zeros',
      ],
      correctOption: 1,
    },
    {
      id: 2,
      text: 'What is the computational complexity of computing an N-point Discrete Fourier Transform (DFT) directly versus using the Radix-2 FFT algorithm?',
      options: [
        'Direct DFT: O(N), Radix-2 FFT: O(log N)',
        'Direct DFT: O(N log N), Radix-2 FFT: O(N²)',
        'Direct DFT: O(N²), Radix-2 FFT: O(N log₂ N)',
        'Direct DFT: O(2^N), Radix-2 FFT: O(N²)',
      ],
      correctOption: 2,
    },
  ];

  const currentQ = mockQuestions[currentQIndex] || mockQuestions[0];

  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 08 Exam Runner</Badge>
          <span className="font-medium">Assigned to: Developer 4 (Assessment Engine)</span>
        </div>
        <span className="text-slate-400 text-[11px]">Route: <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">/exams/{examId || 'test'}</code></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Active Question Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700">
              <span className="text-xs font-mono font-semibold text-brand-400 uppercase tracking-wider">
                Question {currentQIndex + 1} of {mockQuestions.length}
              </span>
              <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors">
                <Flag className="w-3.5 h-3.5" /> Flag for review
              </button>
            </div>

            <h3 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
              {currentQ.text}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => (
                <label
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                    selectedAnswer === idx
                      ? 'bg-brand-600/20 border-brand-500 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="question-option"
                    checked={selectedAnswer === idx}
                    onChange={() => setSelectedAnswer(idx)}
                    className="mt-0.5 text-brand-500 focus:ring-brand-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-slate-700 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(prev - 1, 0))}
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                icon={ArrowLeft}
              >
                Previous
              </Button>

              <div className="flex gap-3">
                {currentQIndex < mockQuestions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setCurrentQIndex(prev => prev + 1);
                      setSelectedAnswer(null);
                    }}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/exams/${examId || 'midterm-2024'}/results`)}
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    Finish & Submit Exam
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Question Palette */}
        <div className="space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Question Palette
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQIndex(i < mockQuestions.length ? i : 0)}
                  className={`h-9 rounded-lg text-xs font-mono font-semibold transition-all ${
                    i === currentQIndex
                      ? 'bg-brand-600 text-white ring-2 ring-brand-400'
                      : i === 0
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700/80 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                <span>Answered (1)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700 inline-block" />
                <span>Unanswered (14)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRunnerPage;
