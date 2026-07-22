"use client";

import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

export default function AiChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatWindow open={open} onClose={() => setOpen(false)} />
      <ChatButton open={open} onClick={() => setOpen(!open)} />
    </>
  );
}
