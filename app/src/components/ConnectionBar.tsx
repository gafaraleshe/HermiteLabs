import { useEffect, useState } from "react";
import { getHealth, getSelection, type BridgeHealth, type Selection } from "../lib/bridge";

export function ConnectionBar() {
  const [health, setHealth] = useState<BridgeHealth | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let alive = true;
    async function poll() {
      const h = await getHealth();
      if (!alive) return;
      setHealth(h);
      setChecked(true);
      setSelection(h ? await getSelection() : null);
    }
    poll();
    const id = setInterval(poll, 4000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const connected = Boolean(health?.ok);

  return (
    <div className={`conn-bar${connected ? " ok" : ""}`}>
      <span className="dot" aria-hidden="true" />
      {connected ? (
        <span className="conn-text">
          Connected to Resolve
          {health?.project ? ` · ${health.project}` : ""}
          {selection?.toolName ? ` · ${selection.toolName} selected` : ""}
        </span>
      ) : (
        <span className="conn-text">
          {checked
            ? "Bridge not running — start it from Resolve › Workspace › Scripts › hermite_bridge"
            : "Looking for the Hermite bridge…"}
        </span>
      )}
    </div>
  );
}
