/**
 * Mock data for Lectures supporting 3 states:
 * 1. 'platform': Video is hosted and played directly on the platform (Figma screen/lectures/video/player)
 * 2. 'external': Video is hosted externally on Google Drive (Figma screen/lectures/video/external-link)
 * 3. 'upcoming': (State 3 - reserved for upcoming design)
 */
export const MOCK_LECTURES = [
  {
    id: '1',
    number: 'Lecture 01',
    title: 'Lecture title',
    description: 'Introduction to Discrete-Time Signals & Systems.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '45:20',
    videoUrl: 'https://example.com/video1.mp4',
    externalDriveUrl: null,
  },
  {
    id: '2',
    number: 'Lecture 02',
    title: 'Lecture title',
    description: 'Discrete Fourier Transform (DFT) and Frequency Analysis.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '52:10',
    videoUrl: 'https://example.com/video2.mp4',
    externalDriveUrl: null,
  },
  {
    id: '3',
    number: 'Lecture 03',
    title: 'Lecture title',
    description: 'Fast Fourier Transform (FFT) Algorithms & Implementations.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '48:30',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp-lecture-03',
  },
  {
    id: '4',
    number: 'Lecture 04',
    title: 'Lecture title',
    description: 'Z-Transform and LTI Systems Analysis Handouts.',
    videoType: 'none',
    hasVideo: false,
    hasPdf: true,
    videoDuration: null,
    videoUrl: null,
    externalDriveUrl: null,
  },
  {
    id: '5',
    number: 'Lecture 05',
    title: 'Lecture title',
    description: 'Digital Filter Design (FIR Filters - Windowing Method).',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '55:15',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp-lecture-05',
  },
  {
    id: '6',
    number: 'Lecture 06',
    title: 'Lecture title',
    description: 'IIR Digital Filter Design (Bilinear Transformation).',
    videoType: 'none',
    hasVideo: false,
    hasPdf: true,
    videoDuration: null,
    videoUrl: null,
    externalDriveUrl: null,
  },
  {
    id: '7',
    number: 'Lecture 07',
    title: 'Lecture title',
    description: 'Filter Structures and Finite Word Length Effects.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '42:18',
    videoUrl: 'https://example.com/video7.mp4',
    externalDriveUrl: null,
  },
  {
    id: '8',
    number: 'Lecture 08',
    title: 'Lecture title',
    description: 'Multirate DSP, Decimation and Interpolation Applications.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '49:00',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp-lecture-08',
  },
];

/**
 * Helper to fetch a lecture by ID with fallback
 */
export const getLectureById = (id) => {
  const found = MOCK_LECTURES.find((lec) => lec.id === String(id));
  if (found) return found;

  const num = parseInt(id, 10) || 1;
  return {
    id: String(id),
    number: `Lecture ${num.toString().padStart(2, '0')}`,
    title: 'Lecture title',
    description: 'Optional lecture description appears here.',
    videoType: num % 2 === 1 ? 'external' : 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '45:00',
    videoUrl: num % 2 === 0 ? 'https://example.com/video.mp4' : null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp',
  };
};
