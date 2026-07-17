import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API reference",
  description:
    "Hermite enterprise API reference — endpoints, authentication, rate limits, and examples.",
};

function Code({ children }: { children: string }) {
  return (
    <pre className="code-block">
      <code>{children}</code>
    </pre>
  );
}

export default function ApiReference() {
  return (
    <>
      <h1>API reference</h1>
      <p style={{ marginTop: "16px" }}>
        The Hermite API exposes the engine behind the desktop plugin as
        stateless REST endpoints: easing-curve generation, motion-preset
        keyframe data, transcription, and AI caption cleanup. No running
        Resolve instance is involved — you send data, you get structured JSON
        back.
      </p>
      <div className="callout callout-warning" style={{ margin: "24px 0" }}>
        <strong>Draft — not live yet.</strong> This is the v1 design contract
        for Stage 4. Shapes may change before launch; the final reference will
        be generated from the API&apos;s OpenAPI spec.
      </div>

      <h2 id="base-url">Base URL</h2>
      <Code>{`https://api.hermite.dev/v1`}</Code>

      <h2 id="auth">Authentication</h2>
      <p>
        Every request carries an API key in the <code className="inline">Authorization</code>{" "}
        header. Keys are issued per organization from the dashboard and scoped
        to a plan.
      </p>
      <Code>{`Authorization: Bearer hm_live_xxxxxxxxxxxxxxxx`}</Code>
      <p>
        Requests without a valid key return <code className="inline">401</code>;
        keys over their plan limits return <code className="inline">429</code>{" "}
        with a <code className="inline">Retry-After</code> header.
      </p>

      <h2 id="rate-limits">Rate limits</h2>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Requests / min</th>
            <th>Transcription</th>
            <th>Max upload</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Team</td>
            <td>60</td>
            <td>10 hrs audio / mo</td>
            <td>500 MB</td>
          </tr>
          <tr>
            <td>Business</td>
            <td>300</td>
            <td>100 hrs audio / mo</td>
            <td>2 GB</td>
          </tr>
          <tr>
            <td>Enterprise</td>
            <td>Custom</td>
            <td>Custom</td>
            <td>Custom</td>
          </tr>
        </tbody>
      </table>

      <h2 id="curves">
        <span className="method-pill">POST</span>/curves/generate
      </h2>
      <p>
        Generate an interpolated easing curve from a named preset or explicit
        bezier control points. Returns per-frame values ready to map onto
        keyframes in any host app.
      </p>
      <Code>{`POST /v1/curves/generate
{
  "preset": "overshoot",        // or "bezier": [0.34, 1.56, 0.64, 1]
  "duration_frames": 24,
  "from": 0,
  "to": 1
}

200 OK
{
  "frames": [0, 0.021, 0.089, 0.204, ...],
  "preset": "overshoot",
  "duration_frames": 24
}`}</Code>

      <h2 id="presets">
        <span className="method-pill">POST</span>/presets/apply
      </h2>
      <p>
        Given clip metadata (dimensions, duration, anchor), returns the
        keyframe data for a named motion preset — the same math the desktop
        plugin uses.
      </p>
      <Code>{`POST /v1/presets/apply
{
  "preset": "slide-in-left",
  "clip": { "width": 1920, "height": 1080, "duration_frames": 120 },
  "easing": "ease-out"
}

200 OK
{
  "keyframes": [
    { "frame": 0,  "x": -1920, "y": 0 },
    { "frame": 18, "x": 0,     "y": 0 }
  ],
  "curve": "ease-out"
}`}</Code>

      <h2 id="transcribe">
        <span className="method-pill">POST</span>/transcribe
      </h2>
      <p>
        Upload audio (or video; audio is extracted server-side) and receive
        subtitle data with word-level timestamps. Async: submission returns a
        job, poll or use a webhook for the result.
      </p>
      <Code>{`POST /v1/transcribe          (multipart: file + options JSON)
{
  "model": "accurate",         // "fast" | "accurate"
  "diarization": true,
  "language": "auto"
}

202 Accepted
{ "job_id": "job_8f2k1", "status": "processing" }

GET /v1/transcribe/job_8f2k1
200 OK
{
  "status": "done",
  "segments": [
    {
      "start": 4.21, "end": 8.94, "speaker": "S1",
      "text": "Welcome back — today we're grading the opening scene."
    }
  ]
}`}</Code>

      <h2 id="cleanup">
        <span className="method-pill">POST</span>/captions/cleanup
      </h2>
      <p>
        Punctuation, casing, and filler cleanup on raw transcript text — the
        AI pass from Stage 3, hosted.
      </p>
      <Code>{`POST /v1/captions/cleanup
{
  "segments": ["so um basically what we wanna do is"],
  "style": "clean"             // "clean" | "verbatim"
}

200 OK
{
  "segments": ["So, basically, what we want to do is:"]
}`}</Code>

      <h2 id="errors">Errors</h2>
      <p>
        Errors are JSON with a stable <code className="inline">code</code>:
      </p>
      <Code>{`400 Bad Request
{ "code": "invalid_preset", "message": "Unknown preset 'wobble'." }`}</Code>

      <h2 id="data-handling">Data handling</h2>
      <p>
        Uploaded media is retained only for the duration of the job plus a
        short retrieval window, then deleted; it is never used for training.
        The full data-handling and retention policy will be published before
        the API accepts its first production customer — that&apos;s a launch
        blocker, not an afterthought.
      </p>
    </>
  );
}
