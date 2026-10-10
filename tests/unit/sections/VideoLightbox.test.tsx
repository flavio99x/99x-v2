import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VideoLightbox } from "@/components/sections/VideoLightbox";

beforeAll(() => {
  // jsdom lacks dialog methods
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); };
});

describe("VideoLightbox", () => {
  it("loads the iframe only after opening and removes it on close", async () => {
    const user = userEvent.setup();
    render(<VideoLightbox youtubeId="0O8WkFGaLw4" label="Watch: This is 99x" />);
    expect(document.querySelector("iframe")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Watch: This is 99x" }));
    const iframe = document.querySelector("iframe")!;
    expect(iframe.src).toContain("youtube-nocookie.com/embed/0O8WkFGaLw4");
    await user.click(screen.getByRole("button", { name: "Close video" }));
    expect(document.querySelector("iframe")).toBeNull();
  });
});
