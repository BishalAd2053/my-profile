import { useEffect, useRef } from "react";
import "../styles/github-calendar-dark.css";

export function GitHubHeatmap({ username }: { username: string }) {
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the GitHubCalendar script and CSS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/github-calendar@latest/dist/github-calendar.min.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.GitHubCalendar && calendarRef.current) {
        // @ts-ignore
        window.GitHubCalendar(calendarRef.current, username, { responsive: true });
        // Inject dark theme style after widget loads
        setTimeout(() => {
          const style = document.createElement("style");
          style.innerHTML = `
            .calendar {
              background: #18181b !important;
              color: #e5e7eb !important;
            }
            .calendar svg {
              background: #18181b !important;
            }
            .calendar rect {
              stroke: #18181b !important;
            }
            .calendar text {
              fill: #e5e7eb !important;
            }
            .calendar .contrib-footer, .calendar .contrib-header, .calendar .contrib-legend, .calendar .contrib-legend .legend-label {
              color: #a1a1aa !important;
              fill: #a1a1aa !important;
            }
            .calendar .contrib-legend .legend .color-empty {
              fill: #27272a !important;
            }
            .calendar .contrib-legend .legend .color-scale-1 {
              fill: #334155 !important;
            }
            .calendar .contrib-legend .legend .color-scale-2 {
              fill: #2563eb !important;
            }
            .calendar .contrib-legend .legend .color-scale-3 {
              fill: #1d4ed8 !important;
            }
            .calendar .contrib-legend .legend .color-scale-4 {
              fill: #0ea5e9 !important;
            }
          `;
          document.head.appendChild(style);
        }, 500); // Wait for widget to render
      }
    };
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/github-calendar@latest/dist/github-calendar-responsive.css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
      // Remove injected style
      const styles = document.head.querySelectorAll('style');
      styles.forEach((s) => {
        if (s.innerHTML.includes('.calendar')) {
          document.head.removeChild(s);
        }
      });
    };
  }, [username]);

  return (
    <div ref={calendarRef} className="calendar">
      Loading the data just for you.
    </div>
  );
}
