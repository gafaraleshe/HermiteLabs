"""
Package the Hermite Motion presets into an installable `.drfx`.

A `.drfx` is a plain zip of Fusion `.setting` files (renamed extension) whose
internal folders mirror Resolve's Fusion Templates tree. We target
`Edit/Effects/Hermite/` so the presets appear in the Edit-page Effects Library
under an "Effects > Hermite" category. Double-clicking the `.drfx` with Resolve
running installs them; the manual-copy path is documented in the README.

Usage:  python3 build.py
Output: dist/Hermite-Motion.drfx  (+ intermediate .setting files under build/)
"""

from __future__ import annotations

import json
import os
import shutil
import zipfile

import hermite_motion

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD_DIR = os.path.join(HERE, "build")
SETTING_SUBDIR = os.path.join("Edit", "Effects", "Hermite")
DIST_DIR = os.path.join(HERE, "dist")
DRFX_NAME = "Hermite-Motion.drfx"


def lint_setting(text: str, path: str) -> list[str]:
    """Cheap structural checks — not a Resolve loader, but catches gross
    serialization errors (unbalanced braces/parens, empty files, missing
    macro) before they ever reach Resolve."""
    problems = []
    if not text.strip():
        problems.append("empty file")
    if text.count("{") != text.count("}"):
        problems.append(
            f"unbalanced braces: {text.count('{')} open vs {text.count('}')} close"
        )
    if text.count("(") != text.count(")"):
        problems.append(
            f"unbalanced parens: {text.count('(')} open vs {text.count(')')} close"
        )
    if "MacroOperator" not in text:
        problems.append("no MacroOperator (not a template macro)")
    if not text.lstrip().startswith("{"):
        problems.append("does not open with a top-level table")
    return problems


def main() -> int:
    # 1. Clean + generate the .setting files.
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
    setting_dir = os.path.join(BUILD_DIR, SETTING_SUBDIR)
    written = hermite_motion.generate(setting_dir)

    # 2. Lint every generated file.
    failed = False
    for path in written:
        with open(path, encoding="utf-8") as fh:
            problems = lint_setting(fh.read(), path)
        status = "ok" if not problems else "FAIL: " + "; ".join(problems)
        print(f"  [{status}] {os.path.basename(path)}")
        failed = failed or bool(problems)
    if failed:
        print("\nLint failed — not packaging.")
        return 1

    # 3. Write a manifest alongside the presets.
    manifest = {
        "name": "Hermite Motion",
        "version": "0.1.0",
        "stage": "1a",
        "url": "https://hermite-pearl.vercel.app/motion",
        "presets": [os.path.splitext(os.path.basename(p))[0] for p in written],
    }
    with open(os.path.join(BUILD_DIR, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)

    # 4. Zip build/ into dist/Hermite-Motion.drfx (store the mirrored tree).
    os.makedirs(DIST_DIR, exist_ok=True)
    drfx_path = os.path.join(DIST_DIR, DRFX_NAME)
    if os.path.exists(drfx_path):
        os.remove(drfx_path)
    with zipfile.ZipFile(drfx_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _dirs, files in os.walk(BUILD_DIR):
            for fn in files:
                abs_path = os.path.join(root, fn)
                arcname = os.path.relpath(abs_path, BUILD_DIR)
                zf.write(abs_path, arcname)

    size_kb = os.path.getsize(drfx_path) / 1024
    print(f"\nPackaged {len(written)} presets -> {os.path.relpath(drfx_path, HERE)} "
          f"({size_kb:.1f} KB)")
    print("Internal layout:")
    with zipfile.ZipFile(drfx_path) as zf:
        for n in zf.namelist():
            print("  ", n)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
