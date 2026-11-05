
"use client";

import { useRef, useState } from "react";
import {
  Clapperboard, Upload, Play, Pause, Scissors,
  Type, Music2, Image, Video, Settings2,
  Download, Plus, Film, Layers, Sparkles,
  Volume2, Undo2, Redo2, MousePointer2
} from "lucide-react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
const [timelineClips, setTimelineClips] = useState<File[]>([]);
  const [selected, setSelected] = useState<File | null>(null);
  const [playing, setPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
  const [activeTool, setActiveTool] = useState("Media");
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
function importFiles(list: FileList | null) {
  if (!list) return;
  const imported = Array.from(list);
  setFiles(old => [...old, ...imported]);
  if (!selected) setSelected(imported[0]);
}

  async function togglePlayback() {
  const video = videoRef.current;
  if (!video) return;

  if (video.paused) {
    try {
      await video.play();
    } catch (error) {
      console.error("Playback failed:", error);
    }
  } else {
    video.pause();
  }
}

  const isVideo = selected?.type.startsWith("video/");
  const previewUrl = selected ? URL.createObjectURL(selected) : null;
function formatTime(time: number) {
  if (!Number.isFinite(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
  return (
    <main className="studio">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Clapperboard size={22}/></div>
          <div>
            <h1>KRIS <span>AI</span> STUDIO</h1>
            <small>CREATIVE VIDEO WORKSPACE</small>
          </div>
        </div>
        <div className="project-name">Untitled Project <span>• Saved locally in browser session</span></div>
        <button className="export-btn" onClick={() => alert("Video export will be added in a later mission.")}>
          <Download size={16}/> Export
        </button>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <p className="section-label">WORKSPACE</p>
          {[
            ["Media", Image], ["Audio", Music2],
            ["Text", Type], ["Effects", Sparkles],
            ["Layers", Layers], ["Settings", Settings2]
          ].map(([name, Icon]: any) => (
            <button key={name} className={`tool ${activeTool === name ? "active" : ""}`}
              onClick={() => setActiveTool(name)}>
              <Icon size={19}/>{name}
            </button>
          ))}
          <div className="ai-card">
            <Sparkles size={20}/>
            <strong>AI Director</strong>
            <p>Your creative assistant is getting ready.</p>
            <span>COMING SOON</span>
          </div>
        </aside>

        <section className="media-panel">
          <div className="panel-heading">
            <h2>{activeTool.toUpperCase()}</h2>
            <button className="icon-btn" onClick={() => inputRef.current?.click()}>
              <Plus size={18}/>
            </button>
          </div>
          <input ref={inputRef} type="file" accept="video/*,image/*,audio/*"
            multiple hidden onChange={e => importFiles(e.target.files)}/>
          <button className="upload-box" onClick={() => inputRef.current?.click()}>
            <Upload size={24}/>
            <strong>Import Media</strong>
            <small>Video, images and audio</small>
          </button>
          <div className="media-count">PROJECT ASSETS · {files.length}</div>
          <div className="asset-list">
            {files.map((file, index) => (
              <button key={`${file.name}-${index}`}
                className={`asset ${selected === file ? "selected" : ""}`}
                onClick={() => {
  setSelected(file);
  if (file.type.startsWith("video/")) {
    setTimelineClips(old => [...old, file]);
  }
}}>
                {file.type.startsWith("video/") ? <Video/> :
                  file.type.startsWith("audio/") ? <Music2/> : <Image/>}
                <span>{file.name}</span>
              </button>
            ))}
            {files.length === 0 && <p className="empty">Your media will appear here.</p>}
          </div>
        </section>

        <section className="editor">
          <div className="preview-heading">
            <div><span className="live-dot"/> PREVIEW MONITOR</div>
            <span>9:16 · VERTICAL</span>
          </div>
          <div className="preview-area">
            <div className="preview-frame">
              {selected && isVideo && previewUrl ?
                <video
  ref={videoRef}
  src={previewUrl}
  controls={false}
  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
  onPlay={() => setPlaying(true)}
  onPause={() => setPlaying(false)}
  onEnded={() => {
    setPlaying(false);
    setCurrentTime(0);
  }}
/> :
                selected && previewUrl ?
                  <img src={previewUrl} alt="Selected media"/> :
                  <div className="placeholder">
                    <Film size={46}/>
                    <h2>Your vision starts here.</h2>
                    <p>Import a video or image to begin editing.</p>
                  </div>}
            </div>
          </div>
          <div className="playback">
            <button className="icon-btn"><Undo2 size={18}/></button>
            <button className="icon-btn"><Redo2 size={18}/></button>
            <button className="play-btn" onClick={togglePlayback}>
              {playing ? <Pause size={19}/> : <Play size={19}/>}
            </button>
            <span>
  {formatTime(currentTime)} / {formatTime(duration)}
</span>
            <button className="icon-btn"><Volume2 size={18}/></button>
          </div>

          <div className="timeline">
            <div className="timeline-heading">
              <div><Layers size={17}/> <strong>TIMELINE</strong></div>
              <span>30 FPS</span>
            </div>
            <div className="ruler">
              {["00:00","00:05","00:10","00:15","00:20","00:25"].map(t =>
                <span key={t}>{t}</span>)}
            </div>
            {[
              ["VIDEO 1", Video], ["OVERLAY", Type], ["AUDIO 1", Music2]
            ].map(([label, Icon]: any) => (
              <div className="track" key={label}>
                <div className="track-label"><Icon size={15}/>{label}</div>
                <div className="track-content">
                  {label === "VIDEO 1" &&
  timelineClips.map((clip, index) => (
    <div className="clip" key={`${clip.name}-${index}`}>
      {clip.name}
    </div>
  ))}
                  {label === "OVERLAY" &&
                    <div className="empty-track">Add text overlays</div>}
                  {label === "AUDIO 1" &&
                    <div className="empty-track">Add music or voiceover</div>}
                </div>
              </div>
            ))}
            <div className="timeline-footer">
              <MousePointer2 size={14}/> Select a clip to begin
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
