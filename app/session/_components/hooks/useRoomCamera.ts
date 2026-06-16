"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_POINTER_TILT = 4; // degrees
const MANUAL_STEP = 6; // degrees
const MAX_MANUAL_YAW = 18; // degrees
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 1.15;
const ZOOM_STEP = 0.08;

/** Drives the "look around" feel of the 3D room: subtle pointer-based
 * parallax plus manual pan/zoom controls, combined into one CSS transform
 * applied to the room's inner wrapper. */
export function useRoomCamera() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerTilt, setPointerTilt] = useState({ x: 0, y: 0 });
  const [manualYaw, setManualYaw] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      setPointerTilt({
        x: (0.5 - py) * 2 * (MAX_POINTER_TILT * 0.6),
        y: (px - 0.5) * 2 * MAX_POINTER_TILT,
      });
    };

    const handlePointerLeave = () => setPointerTilt({ x: 0, y: 0 });

    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const panLeft = useCallback(() => {
    setManualYaw((yaw) => Math.max(yaw - MANUAL_STEP, -MAX_MANUAL_YAW));
  }, []);

  const panRight = useCallback(() => {
    setManualYaw((yaw) => Math.min(yaw + MANUAL_STEP, MAX_MANUAL_YAW));
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(Number((z + ZOOM_STEP).toFixed(2)), MAX_ZOOM));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(Number((z - ZOOM_STEP).toFixed(2)), MIN_ZOOM));
  }, []);

  const resetView = useCallback(() => {
    setManualYaw(0);
    setZoom(1);
  }, []);

  const transform = `rotateX(${pointerTilt.x.toFixed(2)}deg) rotateY(${(
    pointerTilt.y + manualYaw
  ).toFixed(2)}deg) scale(${zoom})`;

  return {
    containerRef,
    transform,
    manualYaw,
    zoom,
    panLeft,
    panRight,
    zoomIn,
    zoomOut,
    resetView,
  };
}
