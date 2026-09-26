import React from 'react';
import { Cpu, Video, Scan, Database, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

export const PipelineArchitectureView = () => {
  const pipelineSteps = [
    {
      step: 1,
      name: 'RTSP Stream Ingestion',
      icon: Video,
      latency: '8 ms',
      tech: 'OpenCV / FFmpeg H.264',
      description: 'Dynamic RTSP multi-camera feed ingestion with frame buffer dropping and timestamp synchronization.',
    },
    {
      step: 2,
      name: 'YOLOv8 Object Detection',
      icon: Cpu,
      latency: '14 ms',
      tech: 'Ultralytics YOLOv8n (PyTorch / TensorRT)',
      description: 'Real-time vehicle detection (Car, SUV, Truck, Bus, Motorcycle) and spatial bounding box cropping.',
    },
    {
      step: 3,
      name: 'ANPR License Plate OCR',
      icon: Scan,
      latency: '18 ms',
      tech: 'EasyOCR + Bilateral Filter',
      description: 'High-Security Registration Plate (HSRP) localization, character recognition, and confidence scoring.',
    },
    {
      step: 4,
      name: 'Cross-Camera Correlation',
      icon: Activity,
      latency: '4 ms',
      tech: 'GIS Trajectory Engine',
      description: 'Chronological camera-to-camera movement reconstruction, speed telemetry, and route anomaly detection.',
    },
    {
      step: 5,
      name: 'SQLite Indexing & BOLO Alerting',
      icon: Database,
      latency: '2 ms',
      tech: 'SQLite 3 + Indexed Detections',
      description: 'Indexed sub-millisecond database insertion, instant BOLO watchlist matching, and WebSocket / REST broadcast.',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Pipeline Architecture & Data Flow
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
            End-to-End Latency: 46 ms
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Technical specifications of the multi-stage surveillance processing pipeline from RTSP frame capture to live dashboard alerting.
        </p>
      </div>

      {/* Pipeline Steps Sequence */}
      <div className="space-y-4">
        {pipelineSteps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div key={step.step} className="relative">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">STAGE 0{step.step}</span>
                      <h3 className="text-base font-bold text-slate-900">{step.name}</h3>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                      {step.latency}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">{step.tech}</p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Summary Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processing Throughput</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">120 FPS Aggregate</p>
          <p className="text-xs text-slate-400 mt-0.5">Across 4 concurrent video pipelines</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ANPR Precision</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">98.6% Accuracy</p>
          <p className="text-xs text-slate-400 mt-0.5">High Security Registration Plate OCR</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Database Storage</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">SQLite 3 (Indexed)</p>
          <p className="text-xs text-slate-400 mt-0.5">Sub-5ms query response time</p>
        </div>
      </div>

    </div>
  );
};
