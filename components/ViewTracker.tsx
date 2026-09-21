"use client"

import { useEffect, useRef } from "react";
import { incrementView } from "@/lib/action";

const ViewTracker = ({ id }: { id: string }) => {
  const tracked = useRef(false);

  useEffect(() => {
    // Guard against the double effect run in React Strict Mode
    if (tracked.current) return;
    tracked.current = true;
    incrementView(id).catch(console.error);
  }, [id]);

  return null;
};

export default ViewTracker;
