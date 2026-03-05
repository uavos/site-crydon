import React, { useEffect } from "react";

export default function RevealOnScroll({
    selector = ".reveal",
    scopeSelector = "main.home",
    rootMargin = "0px 0px -12% 0px",
    threshold = 0.15,
    once = true,
    animateOnLoad = true,
}) {
    useEffect(() => {
        const scope = document.querySelector(scopeSelector) || document.body;
        scope.classList.add("reveal-ready");

        const els = Array.from(scope.querySelectorAll(selector));
        if (!els.length) return;

        const reduceMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

        if (reduceMotion) {
            els.forEach((el) => {
                el.classList.remove("reveal--hidden");
                el.classList.add("reveal--in");
            });
            return;
        }

        els.forEach((el) => {
            el.classList.remove("reveal--in");
            el.classList.add("reveal--hidden");
            el.style.transitionDelay = "";
        });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scope.classList.add("reveal-anim");
            });
        });
        const start = () => {
            requestAnimationFrame(() => {
                const io = new IntersectionObserver(
                    (entries) => {
                        for (const entry of entries) {
                            if (!entry.isIntersecting) continue;

                            const el = entry.target;

                            const delay = el.getAttribute("data-reveal-delay");
                            if (delay) el.style.transitionDelay = `${delay}ms`;

                            requestAnimationFrame(() => {
                                el.classList.remove("reveal--hidden");
                                void el.offsetWidth;
                                el.classList.add("reveal--in");
                            });

                            if (once) io.unobserve(el);
                        }
                    },
                    { root: null, rootMargin, threshold }
                );

                els.forEach((el) => io.observe(el));
            });
        };

        if (animateOnLoad) {
            if (document.readyState === "complete") {
                start();
            } else {
                window.addEventListener("load", start, { once: true });
                return () => window.removeEventListener("load", start);
            }
        } else {
            start();
        }
    }, [selector, scopeSelector, rootMargin, threshold, once, animateOnLoad]);

    return null;
}
