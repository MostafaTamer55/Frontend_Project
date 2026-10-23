import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { Award, CheckCircle2, XCircle, ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react';

export const ExamResultsPage = () => {
  const { examId } = useParams();

  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 08 Exam Results</Badge>
          <span className="font-medium">Assigned to: Developer 4 (Assessment Engine)</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/exams/{examId || 'midterm-2024'}/results</code></span>
      </div>

      <div className="flex items-center justify-between">
        <Link to="/exams" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Exam Bank
        </Link>
        <Link to={`/exams/${examId || 'midterm-2024'}`}>
          <Button variant="outline" size="sm" icon={RotateCcw}>
            Retake Exam
          </Button>
        </Link>
      </div>

      {/* Score Summary Hero */}
      <Card className="text-center p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-sm">
          <Award className="w-9 h-9" />
        </div>
        <Badge variant="success" size="md" dot>Passed with Distinction</Badge>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">94%</h2>
        <p className="text-xs text-slate-500 mt-1">23 out of 25 Questions Correct • Time Spent: 48m 12s</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto mt-6 pt-6 border-t border-slate-100 text-left">
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Z-Transform</span>
            <span className="text-sm font-bold text-slate-800">100% (8/8)</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">FFT Algorithms</span>
            <span className="text-sm font-bold text-slate-800">88% (7/8)</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Filter Design</span>
            <span className="text-sm font-bold text-slate-800">95% (8/9)</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Class Percentile</span>
            <span className="text-sm font-bold text-brand-600">Top 3%</span>
          </div>
        </div>
      </Card>

      {/* Question Review Accordion Scaffolding */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Question Review & Explanations</h3>
        <Card>
          <CardBody className="p-4 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Q1: Condition for BIBO stability in causal discrete-time LTI systems</p>
                <p className="text-slate-600 mt-0.5">Your answer: <span className="font-semibold text-emerald-700">All poles must lie strictly inside the unit circle (|z| &lt; 1)</span></p>
                <p className="text-slate-500 mt-1 text-[11px] italic bg-white/70 p-2 rounded">
                  Explanation: For a causal LTI system, the ROC is |z| &gt; max(|p_i|). For stability, the ROC must include the unit circle (|z| = 1). Thus, all poles must lie strictly inside the unit circle.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ExamResultsPage;
