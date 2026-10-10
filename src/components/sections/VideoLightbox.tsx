"use client";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

export function VideoLightbox({ youtubeId, label }: { youtubeId: string; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); dialog.current?.showModal(); }}
        className="group/play flex items-center gap-3 rounded-md bg-ink p-1 pr-4 text-paper"
      >
        <span className="grid size-8 place-items-center rounded-sm bg-accent text-ink transition-transform duration-500 ease-house group-hover/play:scale-110">
          <Icon name="play" className="size-4 fill-current" />
        </span>
        <span className="font-mono text-button font-light uppercase">{label}</span>
      </button>
      <dialog
        ref={dialog}
        aria-label={label}
        onClose={() => setOpen(false)}
        className="m-auto w-[min(92vw,calc(var(--u)*72))] overflow-visible bg-transparent p-0 backdrop:bg-ink/90"
      >
        <button type="button" onClick={() => dialog.current?.close()} className="absolute -top-14 right-0 grid size-12 place-items-center rounded-full bg-accent text-ink">
          <Icon name="close" />
          <span className="sr-only">Close video</span>
        </button>
        {open && (
          <iframe
            className="aspect-video w-full rounded-md"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={label}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        )}
      </dialog>
    </>
  );
}
