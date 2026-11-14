
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Clapperboard, Upload, Play, Pause, Image, Video,
  Music2, Settings2, Download, Plus, Film, Layers,
  Sparkles, Volume2, Undo2, Redo2, MousePointer2,
  GripVertical, Trash2, Type
} from "lucide-react";

type TimelineClip = {
  id: string;
  file: File;
};

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [timelineClips, setTimelineClips] = useState<TimelineClip[]>([]);
  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTool, setActiveTool] = useState("Media");

  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create one preview URL per selected file, and clean it up.
  useEffect(() => {
    if (!selected) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selected]);

  // Reset playback information when a different asset is selected.
  useEffect(() => {
    videoRef.current?.pause();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [selected]);

  function formatTime(time: number) {
    if (!Number.isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function importFiles(list: FileList | null) {
    if (!list) return;

    const imported = Array.from(list);
    setFiles(old => [...old, ...imported]);

    if (!selected && imported.length > 0) {
      setSelected(imported[0]);
    }
  }

  function addToTimeline(file: File) {
    setTimelineClips(old => [
      ...old,
      { id: `${Date.now()}-${Math.random()}`, file }
    ]);
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Video playback failed:", error);
      }
    } else {
      video.pause();
    }
  }

  function seekVideo(value: number) {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  }

  function handleTrackDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const assetIndex = event.dataTransfer.getData("asset-index");
    const clipId = event.dataTransfer.getData("clip-id");

    if (assetIndex !== "") {
      const file = files[Number(assetIndex)];
      if (file?.type.startsWith("video/")) {
        addToTimeline(file);
      }
    }

    if (clipId) {
      const dragged = timelineClips.find(clip => clip.id === clipId);
      if (dragged) {
        setTimelineClips(old => [
          ...old.filter(clip => clip.id !== clipId),
          dragged
        ]);
      }
    }
  }

  function moveClip(draggedId: string, targetId: string) {
    if (draggedId === targetId) return;

    setTimelineClips(old => {
      const next = [...old];
      const from = next.findIndex(c => c.id === draggedId);
      const to = next.findIndex(c => c.id === targetId);

      if (from < 0 || to < 0) return old;

      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  const isVideo = selected?.type.startsWith("video/");
  const isImage = selected?.type.startsWith("image/");

  return (
    <main className="studio">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Clapperboard size={22} /></div>
          <div>
            <h1>KRIS <span>AI</span> STUDIO</h1>
            <small>CREATIVE VIDEO WORKSPACE</small>
          </div>
        </div>

        <div className="project-name">
          Untitled Project <span>• Saved locally in browser session</span>
        </div>

        <button
          className="export-btn"
          onClick={() => alert("Video export engine is coming in a later mission.")}
        >
          <Download size={16} /> Export
        </button>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <p className="section-label">WORKSPACE</p>

          {[
            ["Media", Image],
            ["Audio", Music2],
            ["Text", Type],
            ["Effects", Sparkles],
            ["Layers", Layers],
            ["Settings", Settings2]
          ].map(([name, Icon]: any) => (
            <button
              key={name}
              className={`tool ${activeTool === name ? "active" : ""}`}
              onClick={() => setActiveTool(name)}
            >
              <Icon size={19} /> {name}
            </button>
          ))}

          <div className="ai-card">
            <Sparkles size={20} />
            <strong>AI Director</strong>
            <p>Your creative assistant is getting ready.</p>
            <span>COMING SOON</span>
          </div>
        </aside>

        <section className="media-panel">
          <div className="panel-heading">
            <h2>{activeTool.toUpperCase()}</h2>
            <button
              className="icon-btn"
              onClick={() => inputRef.current?.click()}
            >
              <Plus size={18} />
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="video/*,image/*,audio/*"
            multiple
            hidden
            onChange={e => {
              importFiles(e.target.files);
              e.currentTarget.value = "";
            }}
          />

          <button
            className="upload-box"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={24} />
            <strong>Import Media</strong>
            <small>Video, images and audio</small>
          </button>

          <div className="media-count">
            PROJECT ASSETS · {files.length}
          </div>

          <div className="asset-list">
            {files.map((file, index) => (
              <button
                key={`${file.name}-${index}`}
                draggable={file.type.startsWith("video/")}
                onDragStart={event => {
                  event.dataTransfer.setData("asset-index", String(index));
                }}
                className={`asset ${selected === file ? "selected" : ""}`}
                onClick={() => setSelected(file)}
                onDoubleClick={() => {
                  if (file.type.startsWith("video/")) addToTimeline(file);
                }}
              >
                {file.type.startsWith("video/") ? <Video /> :
                  file.type.startsWith("audio/") ? <Music2 /> : <Image />}
                <span>{file.name}</span>
              </button>
            ))}

            {files.length === 0 && (
              <p className="empty">Your media will appear here.</p>
            )}
          </div>
        </section>

        <section className="editor">
          <div className="preview-heading">
            <div><span className="live-dot" /> PREVIEW MONITOR</div>
            <span>9:16 · VERTICAL</span>
          </div>

          <div className="preview-area">
            <div className="preview-frame">
              {selected && isVideo && previewUrl ? (
                <video
                  key={`${selected.name}-${selected.size}-${selected.lastModified}`}
                  ref={videoRef}
                  src={previewUrl}
                  playsInline
                  preload="metadata"
                  controls={false}
                  onLoadedMetadata={e => {
                    setDuration(e.currentTarget.duration);
                    setCurrentTime(0);
                  }}
                  onTimeUpdate={e => {
                    setCurrentTime(e.currentTarget.currentTime);
                  }}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                />
              ) : selected && isImage && previewUrl ? (
                <img src={previewUrl} alt={selected.name} />
              ) : (
                <div className="placeholder">
                  <Film size={46} />
                  <h2>Your vision starts here.</h2>
                  <p>Import a video or image to begin editing.</p>
                </div>
              )}
            </div>
          </div>

          <div className="playback">
            <button className="icon-btn" title="Undo">
              <Undo2 size={18} />
            </button>

            <button className="icon-btn" title="Redo">
              <Redo2 size={18} />
            </button>

            <button
              className="play-btn"
              onClick={togglePlayback}
              disabled={!isVideo || !previewUrl}
              title="Play or pause"
            >
              {playing ? <Pause size={19} /> : <Play size={19} />}
            </button>

            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <button className="icon-btn" title="Volume">
              <Volume2 size={18} />
            </button>
          </div>

          <div className="seek-wrap">
            <input
              className="seek-bar"
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={Math.min(currentTime, duration || 0)}
              disabled={!isVideo || !duration}
              onChange={e => seekVideo(Number(e.target.value))}
            />
          </div>

          <div className="timeline">
            <div className="timeline-heading">
              <div><Layers size={17} /> <strong>TIMELINE</strong></div>
              <span>30 FPS</span>
            </div>

            <div className="ruler">
              {["00:00", "00:05", "00:10", "00:15", "00:20", "00:25"].map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="track">
              <div className="track-label">
                <Video size={15} /> VIDEO 1
              </div>

              <div
                className="track-content"
                onDragOver={event => event.preventDefault()}
                onDrop={handleTrackDrop}
              >
                {timelineClips.map((clip) => (
                  <div
                    className="clip"
                    key={clip.id}
                    draggable
                    onDragStart={event => {
                      event.dataTransfer.setData("clip-id", clip.id);
                    }}
                    onDragOver={event => event.preventDefault()}
                    onDrop={event => {
                      event.preventDefault();
                      event.stopPropagation();

                      const draggedId = event.dataTransfer.getData("clip-id");
                      if (draggedId) moveClip(draggedId, clip.id);
                    }}
                    onClick={() => setSelected(clip.file)}
                    title="Drag to rearrange"
                  >
                    <GripVertical size={13} />
                    <span>{clip.file.name}</span>
                    <button
                      className="remove-clip"
                      title="Remove clip"
                      onClick={event => {
                        event.stopPropagation();
                        setTimelineClips(old =>
                          old.filter(item => item.id !== clip.id)
                        );
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {timelineClips.length === 0 && (
                  <div className="empty-track">
                    Drag a video asset here
                  </div>
                )}
              </div>
            </div>

            <div className="track">
              <div className="track-label">
                <Type size={15} /> OVERLAY
              </div>
              <div className="track-content">
                <div className="empty-track">Add text overlays</div>
              </div>
            </div>

            <div className="track">
              <div className="track-label">
                <Music2 size={15} /> AUDIO 1
              </div>
              <div className="track-content">
                <div className="empty-track">Add music or voiceover</div>
              </div>
            </div>

            <div className="timeline-footer">
              <MousePointer2 size={14} />
              Drag video assets into the timeline · Double-tap an asset to add it
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
