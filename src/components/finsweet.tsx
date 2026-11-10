"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type FsModule = {
  restart?: () => Promise<unknown> | unknown;
  loading?: Promise<unknown>;
};

type FsApi = {
  process?: Set<string>;
  modules?: Record<string, FsModule>;
  push?: (entry: ["list", () => void]) => void;
};

declare global {
  interface Window {
    FinsweetAttributes?: FsApi | ["list", () => void][];
  }
}

function markReady() {
  document.querySelectorAll('[fs-list-element="wrapper"]').forEach((element) => {
    element.classList.add("is-list-ready");
  });
}

export function FinsweetListBridge() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const earlyInput = new Map<HTMLInputElement, { checked: boolean; value: string }>();
    const capture = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (!target.closest('[fs-list-element="filters"]')) return;
      earlyInput.set(target, { checked: target.checked, value: target.value });
    };
    document.addEventListener("input", capture, true);

    const finish = () => {
      document.removeEventListener("input", capture, true);
      if (cancelled) return;
      for (const [input, state] of earlyInput) {
        input.checked = state.checked;
        if (input.type === "search" || input.type === "text") input.value = state.value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      markReady();
    };

    window.FinsweetAttributes ||= [];
    const api = window.FinsweetAttributes;
    const alreadyRunning = !Array.isArray(api) && api.process?.has("list");
    if (alreadyRunning && api.modules?.list?.restart) {
      Promise.resolve(api.modules.list.restart()).finally(finish);
      return () => {
        cancelled = true;
        document.removeEventListener("input", capture, true);
      };
    }
    if (Array.isArray(api)) api.push(["list", finish]);
    else api.push?.(["list", finish]);

    return () => {
      cancelled = true;
      document.removeEventListener("input", capture, true);
    };
  }, [pathname]);

  return null;
}
