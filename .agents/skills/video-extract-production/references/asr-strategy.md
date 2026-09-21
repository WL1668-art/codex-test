# ASR strategy

Only consider ASR after recording the platform subtitle audit: official, CC, automatic, and multipart availability. If access needs user-authorized browser cookies, keep credentials inside the browser workflow and out of every artifact.

Before model selection, inventory GPU/CUDA, CPU, installed backends, existing compatible models, available runtimes, language, and audio duration. Reuse what is present. Do not alter system configuration or install heavyweight dependencies just to make a preferred backend available.

For long audio on CPU-only hardware, do not assume the largest available model is appropriate. When the likely runtime is uncertain, transcribe a representative 2–3 minute clip, calculate real-time factor as `processing_seconds / audio_seconds`, and estimate full duration. If the estimate is unreasonable for the task, select a smaller or more quantized suitable model, use a different existing backend, or ask for direction.

Convert to a stable ASR input format only when needed (commonly 16 kHz mono WAV) and retain the original downloaded audio. Keep timestamped segments and a readable text version. A successful process is insufficient: require nonempty output, readable sampled text, and final-segment tail validation against `ffprobe` duration.

For independent long processes, do one status observation when asked: process state, latest log position, CPU activity, and output presence. Do not repeatedly poll or restart a still-running job.
