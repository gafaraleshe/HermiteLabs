// The Hermite desktop shell. The window loads the Vite frontend (the curve
// editor / speed-ramp UI); all Resolve communication goes over local HTTP to
// the Python bridge, so there are no native commands to register yet.
//
// The CSP in tauri.conf.json is what permits the webview to reach the bridge
// on 127.0.0.1:8712 — plain-http localhost is otherwise blocked.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running the Hermite desktop app");
}
