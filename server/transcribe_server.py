import os
import sys
import shutil
import tempfile
import traceback
import imageio_ffmpeg
from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import MyMemoryTranslator

# Setup ffmpeg path for Whisper
ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
ffmpeg_dir = os.path.dirname(ffmpeg_exe)
ffmpeg_alias = os.path.join(ffmpeg_dir, 'ffmpeg.exe')
if not os.path.exists(ffmpeg_alias):
    try:
        shutil.copyfile(ffmpeg_exe, ffmpeg_alias)
    except Exception:
        pass
os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")

import whisper

app = Flask(__name__)
CORS(app)

print("Loading Whisper model (tiny.en)...", flush=True)
model = whisper.load_model("tiny.en")
print("Whisper model loaded successfully! Server ready on port 5001.", flush=True)

translator = MyMemoryTranslator(source='en-US', target='vi-VN')

def format_timestamp(seconds):
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"

def batch_translate(text_list):
    """Translates a list of strings efficiently with batching"""
    if not text_list:
        return []
    
    results = []
    # Batch into chunks of 5 lines to avoid API rate limits and keep it fast
    chunk_size = 5
    for i in range(0, len(text_list), chunk_size):
        chunk = text_list[i:i + chunk_size]
        joined = " [SEP] ".join(chunk)
        try:
            translated = translator.translate(joined)
            if translated and "[SEP]" in translated:
                parts = [p.strip() for p in translated.split("[SEP]")]
                # In case count matches
                if len(parts) == len(chunk):
                    results.extend(parts)
                    continue
            elif translated:
                # If separator lost, try individual for this small chunk
                for c in chunk:
                    try:
                        results.append(translator.translate(c) or c)
                    except Exception:
                        results.append(c)
                continue
        except Exception as e:
            print(f"Batch translation error: {e}", flush=True)
        
        # Fallback: keep original if translation fails
        results.extend(chunk)

    return results

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model": "whisper-tiny.en", "service": "Antigravity Whisper Audio Engine"})

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided in request"}), 400

    audio_file = request.files['audio']
    if not audio_file.filename:
        return jsonify({"error": "Empty filename"}), 400

    suffix = os.path.splitext(audio_file.filename)[1] or '.mp3'
    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            audio_file.save(tmp.name)
            temp_path = tmp.name

        print(f"[Whisper] Transcribing '{audio_file.filename}'...", flush=True)
        result = model.transcribe(temp_path, fp16=False)

        raw_text_en = result.get("text", "").strip()
        raw_segments = result.get("segments", [])

        # Filter meaningful segments
        clean_segments = []
        for seg in raw_segments:
            text_en = seg.get("text", "").strip()
            if text_en:
                clean_segments.append({
                    "start": round(seg.get("start", 0), 1),
                    "end": round(seg.get("end", 0), 1),
                    "textEn": text_en
                })

        # Batch translate segment texts
        en_texts = [s["textEn"] for s in clean_segments]
        vi_texts = batch_translate(en_texts)

        lines = []
        for idx, seg in enumerate(clean_segments):
            vi = vi_texts[idx] if idx < len(vi_texts) else seg["textEn"]
            lines.append({
                "id": idx + 1,
                "timeStart": format_timestamp(seg["start"]),
                "timeSeconds": int(seg["start"]),
                "textEn": seg["textEn"],
                "textVi": vi
            })

        max_duration = int(clean_segments[-1]["end"]) if clean_segments else 60

        # Translate paragraph
        try:
            # If short enough, translate in one shot
            if len(raw_text_en) < 400:
                paragraph_vi = translator.translate(raw_text_en) or " ".join(l["textVi"] for l in lines)
            else:
                paragraph_vi = " ".join(l["textVi"] for l in lines)
        except Exception:
            paragraph_vi = " ".join(l["textVi"] for l in lines)

        print(f"[Whisper] Done! {len(lines)} lines extracted for '{audio_file.filename}'.", flush=True)

        return jsonify({
            "success": True,
            "fileName": audio_file.filename,
            "duration": format_timestamp(max_duration),
            "durationSeconds": max_duration,
            "paragraphEn": raw_text_en,
            "paragraphVi": paragraph_vi,
            "lines": lines
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=False)
