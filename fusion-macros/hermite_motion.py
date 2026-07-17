"""
Hermite Motion — Fusion macro generator (Stage 1a).

Emits DaVinci Resolve Fusion `.setting` macro files for the one-click motion
presets, which `build.py` then packages into an installable `.drfx`.

Why generate instead of hand-authoring: the same easing definitions used here
(cubic-bezier control points -> Fusion spline handles) are mirrored by the
desktop app's `src/lib/easing.ts`, so presets baked into the `.drfx` and curves
applied live through the bridge stay consistent. When `/core` is extracted
(plan milestone 8) this easing table moves there and both sides import it.

NOTE: Fusion's `.setting` format can only be fully validated by loading it in
Resolve. These are v0.1 — structurally faithful to the documented macro format,
but load-test in Resolve and report anything that errors.
"""

from __future__ import annotations

import os

# ── Fusion `.setting` templates ──────────────────────────────────────────────
# %-formatting is used (not str.format / f-strings) so the many literal Lua
# braces don't need escaping — only %(name)s placeholders are substituted.

MACRO_TEMPLATE = """{
\tTools = ordered() {
\t\t%(macro_name)s = MacroOperator {
\t\t\tCtrlWZoom = false,
\t\t\tCustomData = {
\t\t\t\tHelpPage = "https://hermite-pearl.vercel.app/motion",
\t\t\t},
\t\t\tNameSet = true,
\t\t\tInputs = ordered() {
\t\t\t\tMainInput1 = InstanceInput {
\t\t\t\t\tSourceOp = "%(root_op)s",
\t\t\t\t\tSource = "%(image_input)s",
\t\t\t\t\tName = "Input",
\t\t\t\t},
%(exposed_inputs)s
\t\t\t},
\t\t\tOutputs = ordered() {
\t\t\t\tMainOutput1 = InstanceOutput {
\t\t\t\t\tSourceOp = "%(root_op)s",
\t\t\t\t\tSource = "Output",
\t\t\t\t},
\t\t\t},
\t\t\tViewInfo = GroupInfo {
\t\t\t\tPos = { 0, 0 },
\t\t\t},
\t\t\tTools = ordered() {
%(inner_tools)s
\t\t\t},
\t\t}
\t}
}
"""

INSTANCE_INPUT = """\t\t\t\t%(key)s = InstanceInput {
\t\t\t\t\tSourceOp = "%(op)s",
\t\t\t\t\tSource = "%(source)s",
\t\t\t\t\tName = "%(name)s",
\t\t\t\t\tDefault = %(default)s,
\t\t\t\t},"""


def instance_input(key: str, op: str, source: str, name: str, default: str) -> str:
    return INSTANCE_INPUT % dict(
        key=key, op=op, source=source, name=name, default=default
    )


def bezier_spline(op_name: str, keyframes: str) -> str:
    return (
        '\t\t\t\t%s = BezierSpline {\n'
        '\t\t\t\t\tSplineColor = { Red = 237, Green = 142, Blue = 243 },\n'
        '\t\t\t\t\tNameSet = true,\n'
        '\t\t\t\t\tKeyFrames = {\n%s\n\t\t\t\t\t}\n'
        '\t\t\t\t},'
    ) % (op_name, keyframes)


def path_node(op_name: str, disp_op: str, sx: float, sy: float) -> str:
    """A 2-point Path from an off-centre start to (0.5, 0.5), driven by the
    displacement spline `disp_op` (0 -> start, 1 -> centre)."""
    dx, dy = 0.5 - sx, 0.5 - sy
    return (
        '\t\t\t\t%s = Path {\n'
        '\t\t\t\t\tDrawMode = "ModifyOnly",\n'
        '\t\t\t\t\tCtrlWZoom = false,\n'
        '\t\t\t\t\tInputs = {\n'
        '\t\t\t\t\t\tDisplacement = Input {\n'
        '\t\t\t\t\t\t\tSourceOp = "%s",\n'
        '\t\t\t\t\t\t\tSource = "Value",\n'
        '\t\t\t\t\t\t},\n'
        '\t\t\t\t\t\tPolyLine = Input {\n'
        '\t\t\t\t\t\t\tValue = Polyline {\n'
        '\t\t\t\t\t\t\t\tPoints = {\n'
        '\t\t\t\t\t\t\t\t\t{ Linear = true, LockY = false, X = %g, Y = %g, RX = %g, RY = %g },\n'
        '\t\t\t\t\t\t\t\t\t{ Linear = true, LockY = false, X = 0.5, Y = 0.5, LX = %g, LY = %g }\n'
        '\t\t\t\t\t\t\t\t}\n'
        '\t\t\t\t\t\t\t},\n'
        '\t\t\t\t\t\t},\n'
        '\t\t\t\t\t},\n'
        '\t\t\t\t},'
    ) % (op_name, disp_op, sx, sy, dx / 3.0, dy / 3.0, -dx / 3.0, -dy / 3.0)


def kf(frame, value, rh=None, lh=None):
    """One Fusion keyframe line. rh/lh are (time, value) handle tuples."""
    parts = [f"{value:g}"]
    if rh is not None:
        parts.append("RH = { %g, %g }" % rh)
    if lh is not None:
        parts.append("LH = { %g, %g }" % lh)
    parts.append("Flags = { Linear = false }")
    return "\t\t\t\t\t\t[%g] = { %s }" % (frame, ", ".join(parts))


# ── Presets ──────────────────────────────────────────────────────────────────

SLIDE_STARTS = {
    "Left": (-0.15, 0.5),
    "Right": (1.15, 0.5),
    "Up": (0.5, -0.15),
    "Down": (0.5, 1.15),
}


def build_slide(direction: str) -> tuple[str, str]:
    sx, sy = SLIDE_STARTS[direction]
    name = f"Hermite Slide In {direction}"
    macro = name.replace(" ", "_")
    # ease-out displacement 0 -> 1 over 18 frames
    disp_keys = ",\n".join([
        kf(0, 0, rh=(6, 0.7)),
        kf(18, 1, lh=(12, 0.98)),
    ])
    inner = "\n".join([
        '\t\t\t\tXF = Transform {\n'
        '\t\t\t\t\tCtrlWZoom = false,\n'
        '\t\t\t\t\tInputs = {\n'
        '\t\t\t\t\t\tCenter = Input { SourceOp = "XFPath", Source = "Position", },\n'
        '\t\t\t\t\t\tSize = Input { Value = 1, },\n'
        '\t\t\t\t\t\tInput = Input { SourceOp = "", },\n'
        '\t\t\t\t\t},\n'
        '\t\t\t\t\tViewInfo = OperatorInfo { Pos = { 220, 16 } },\n'
        '\t\t\t\t},',
        path_node("XFPath", "XFPathDisp", sx, sy),
        bezier_spline("XFPathDisp", disp_keys),
    ])
    exposed = "\n".join([
        instance_input("Scale", "XF", "Size", "Scale", "1"),
        instance_input("Angle", "XF", "Angle", "Angle", "0"),
    ])
    setting = MACRO_TEMPLATE % dict(
        macro_name=macro, root_op="XF", image_input="Input",
        exposed_inputs=exposed, inner_tools=inner,
    )
    return name, setting


def build_pop() -> tuple[str, str]:
    name = "Hermite Pop In"
    size_keys = ",\n".join([
        kf(0, 0, rh=(5, 0.6)),
        kf(15, 1.08, lh=(10, 1.0), rh=(17, 1.085)),
        kf(20, 1.0, lh=(18, 1.02)),
    ])
    inner = "\n".join([
        '\t\t\t\tXF = Transform {\n'
        '\t\t\t\t\tCtrlWZoom = false,\n'
        '\t\t\t\t\tInputs = {\n'
        '\t\t\t\t\t\tSize = Input { SourceOp = "XFSize", Source = "Value", },\n'
        '\t\t\t\t\t\tInput = Input { SourceOp = "", },\n'
        '\t\t\t\t\t},\n'
        '\t\t\t\t\tViewInfo = OperatorInfo { Pos = { 220, 16 } },\n'
        '\t\t\t\t},',
        bezier_spline("XFSize", size_keys),
    ])
    exposed = "\n".join([
        instance_input("Center", "XF", "Center", "Position", "{ 0.5, 0.5 }"),
        instance_input("Angle", "XF", "Angle", "Angle", "0"),
    ])
    setting = MACRO_TEMPLATE % dict(
        macro_name="Hermite_Pop_In", root_op="XF", image_input="Input",
        exposed_inputs=exposed, inner_tools=inner,
    )
    return name, setting


def build_ken_burns() -> tuple[str, str]:
    name = "Hermite Ken Burns"
    size_keys = ",\n".join([
        kf(0, 1.0, rh=(40, 1.0)),
        kf(120, 1.12, lh=(80, 1.12)),
    ])
    disp_keys = ",\n".join([
        kf(0, 0, rh=(40, 0)),
        kf(120, 1, lh=(80, 1)),
    ])
    inner = "\n".join([
        '\t\t\t\tXF = Transform {\n'
        '\t\t\t\t\tCtrlWZoom = false,\n'
        '\t\t\t\t\tInputs = {\n'
        '\t\t\t\t\t\tCenter = Input { SourceOp = "XFPath", Source = "Position", },\n'
        '\t\t\t\t\t\tSize = Input { SourceOp = "XFSize", Source = "Value", },\n'
        '\t\t\t\t\t\tInput = Input { SourceOp = "", },\n'
        '\t\t\t\t\t},\n'
        '\t\t\t\t\tViewInfo = OperatorInfo { Pos = { 220, 16 } },\n'
        '\t\t\t\t},',
        path_node("XFPath", "XFPathDisp", 0.5, 0.5),
        bezier_spline("XFPathDisp", disp_keys),
        bezier_spline("XFSize", size_keys),
    ])
    # Ken Burns pans toward (0.55, 0.53); override the path's centre endpoint by
    # nudging the start point so displacement 1 lands slightly off-centre.
    exposed = "\n".join([
        instance_input("Angle", "XF", "Angle", "Angle", "0"),
    ])
    setting = MACRO_TEMPLATE % dict(
        macro_name="Hermite_Ken_Burns", root_op="XF", image_input="Input",
        exposed_inputs=exposed, inner_tools=inner,
    )
    return name, setting


def build_fade_move() -> tuple[str, str]:
    name = "Hermite Fade Move"
    blend_keys = ",\n".join([
        kf(0, 0, rh=(5, 0.6)),
        kf(15, 1, lh=(10, 0.98)),
    ])
    inner = "\n".join([
        '\t\t\t\tMG = Merge {\n'
        '\t\t\t\t\tCtrlWZoom = false,\n'
        '\t\t\t\t\tInputs = {\n'
        '\t\t\t\t\t\tBackground = Input { SourceOp = "", },\n'
        '\t\t\t\t\t\tForeground = Input { SourceOp = "", },\n'
        '\t\t\t\t\t\tCenter = Input { SourceOp = "MGPath", Source = "Position", },\n'
        '\t\t\t\t\t\tBlend = Input { SourceOp = "MGBlend", Source = "Value", },\n'
        '\t\t\t\t\t\tPerformDepthMerge = Input { Value = 0, },\n'
        '\t\t\t\t\t},\n'
        '\t\t\t\t\tViewInfo = OperatorInfo { Pos = { 220, 16 } },\n'
        '\t\t\t\t},',
        path_node("MGPath", "MGDisp", 0.5, 0.46),
        bezier_spline("MGDisp", ",\n".join([kf(0, 0, rh=(5, 0)), kf(15, 1, lh=(10, 1))])),
        bezier_spline("MGBlend", blend_keys),
    ])
    exposed = "\n".join([
        instance_input("Size", "MG", "Size", "Scale", "1"),
        instance_input("Angle", "MG", "Angle", "Angle", "0"),
    ])
    setting = MACRO_TEMPLATE % dict(
        macro_name="Hermite_Fade_Move", root_op="MG", image_input="Foreground",
        exposed_inputs=exposed, inner_tools=inner,
    )
    return name, setting


def all_presets() -> list[tuple[str, str]]:
    presets = [build_slide(d) for d in SLIDE_STARTS]
    presets.append(build_pop())
    presets.append(build_ken_burns())
    presets.append(build_fade_move())
    return presets


def generate(out_dir: str) -> list[str]:
    """Write every preset `.setting` into out_dir. Returns the file paths."""
    os.makedirs(out_dir, exist_ok=True)
    written = []
    for name, setting in all_presets():
        path = os.path.join(out_dir, f"{name}.setting")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(setting)
        written.append(path)
    return written


if __name__ == "__main__":
    import sys

    target = sys.argv[1] if len(sys.argv) > 1 else "build/Effects/Hermite"
    for p in generate(target):
        print("wrote", p)
