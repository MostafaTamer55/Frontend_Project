import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import { ArrowLeft, Terminal, Download, UploadCloud, CheckCircle } from 'lucide-react';

export const SectionDetailPage = () => {
  const { sectionId } = useParams();

  return (
    <div className="space-y-6">
      {/* Dev & Figma Scope Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Figma 07 Sections Detail</Badge>
          <span className="font-medium">Assigned to: Developer 3 (Lectures & Sections)</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/sections/{sectionId || '1'}</code></span>
      </div>

      <div className="flex items-center justify-between">
        <Link to="/sections" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Back to Sections
        </Link>
        <Button variant="outline" size="sm" icon={Download}>
          Download Starter Code (.zip)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand" size="sm">Lab Session #{sectionId || '1'}</Badge>
              <Badge variant="neutral" size="sm">Python 3.11 / NumPy</Badge>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Lab Exercise: Fast Fourier Transform Implementation & Benchmarking
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Problem Statement & Objectives</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>
                In this practical recitation, you will code a recursive Radix-2 Decimation-in-Time FFT algorithm from scratch without using <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">numpy.fft.fft</code>.
              </p>
              <h4 className="font-bold text-slate-900 uppercase tracking-wide">Tasks:</h4>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Implement bit-reversal sorting on an input vector of length N = 2^m.</li>
                <li>Compute the twiddle factors W_N^k and perform butterfly operations across log2(N) stages.</li>
                <li>Compare execution time against standard DFT for N = 64, 128, 512, 1024.</li>
              </ul>
            </CardBody>
          </Card>

          {/* Starter Code Preview */}
          <div className="rounded-xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto shadow-md border border-slate-800">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-slate-400">
              <span>fft_student_template.py</span>
              <span className="text-[10px] text-emerald-400">Template v1.2</span>
            </div>
            <pre className="leading-relaxed">
{`import numpy as np

def radix2_dit_fft(x):
    """
    x: 1D numpy array representing time-domain discrete signal
    Returns: X (DFT frequency domain complex vector)
    """
    N = len(x)
    if N <= 1:
        return x
    
    # Even and odd index decomposition
    even = radix2_dit_fft(x[0::2])
    odd  = radix2_dit_fft(x[1::2])
    
    # Twiddle factor calculation
    W = np.exp(-2j * np.pi * np.arange(N // 2) / N)
    return np.concatenate([even + W * odd, even - W * odd])
`}
            </pre>
          </div>
        </div>

        {/* Right Submission Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Submission</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-400 transition-colors cursor-pointer bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-brand-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">Drag & drop your code file</p>
                <p className="text-[11px] text-slate-400 mt-1">.py, .ipynb, or .m (Max 25MB)</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Due Date:</span>
                  <span className="font-semibold text-slate-900">Nov 02, 11:59 PM</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Grading Weight:</span>
                  <span className="font-semibold text-slate-900">10% Course Total</span>
                </div>
              </div>

              <Button variant="primary" className="w-full">
                Submit Solution
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SectionDetailPage;
