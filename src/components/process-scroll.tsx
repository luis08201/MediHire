"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ProcessStep = {
  id: string;
  group: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

export function ProcessScroll({
  title,
  intro,
  steps,
}: {
  title: string;
  intro: string;
  steps: ProcessStep[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const pin = root.current?.querySelector<HTMLElement>(".process-pin");
      const track = root.current?.querySelector<HTMLElement>(".process-track");
      const viewport = root.current?.querySelector<HTMLElement>(".process-viewport");
      const images = gsap.utils.toArray<HTMLElement>(".process-bg", root.current);
      if (!pin || !track || !viewport || images.length < 2) return;

      const points = gsap.utils.toArray<HTMLElement>(".process-point", track);
      gsap.set(images, { autoAlpha: 0 });
      gsap.set(images[0], { autoAlpha: 1 });

      const xFor = (index: number) => {
        const card = points[index];
        if (!card) return 0;
        return viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top 4.5rem",
          end: () => `+=${Math.max(points.length - 1, 1) * window.innerHeight * 0.9}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(track, {
        x: () => xFor(0),
      }, {
        x: () => xFor(points.length - 1),
        duration: Math.max(points.length - 1, 1),
      }, 0);

      images.forEach((image, index) => {
        if (index === 0) return;
        timeline.to(image, { autoAlpha: 1, duration: 0.4 }, index - 0.15);
        timeline.to(images[index - 1], { autoAlpha: 0, duration: 0.4 }, index - 0.15);
      });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section className="process-scroll" ref={root} aria-labelledby="process-title">
      <div className="process-pin">
        {steps.map((step) => (
          <img key={step.id} className="process-bg" src={step.image} alt="" />
        ))}
        <div className="process-shade" aria-hidden="true" />
        <div className="process-layout">
          <div className="process-copy">
            <h2 id="process-title">{title}</h2>
            <p>{intro}</p>
          </div>
          <div className="process-viewport">
            <div className="process-track">
              {steps.map((step, index) => (
                <article className="process-point" key={step.id}>
                  <img className="process-card-photo" src={step.image} alt={step.alt} />
                  <span className="process-index">{String(index + 1).padStart(2, "0")}</span>
                  <p className="process-group">{step.group}</p>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
