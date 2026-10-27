"""Build the survey.
  python3 src/build_survey.py --endpoint https://script.google.com/macros/s/.../exec
  -> rank-survey/index.html (drag the rank-survey folder onto Netlify)
  --preview PATH also writes a copy for the Claude preview (no endpoint, answers aren't sent).
"""
import argparse, base64, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("--endpoint", default="")
ap.add_argument("--preview")
a = ap.parse_args()
src = open(os.path.join(ROOT, "src/survey.html"), encoding="utf-8").read()
logo = base64.b64encode(open(os.path.join(ROOT, "src/rank-logo.png"), "rb").read()).decode()
src = src.replace("%%LOGO%%", logo)
head, body = src.split("<!--BODY-->")
out = os.path.join(ROOT, "rank-survey")
os.makedirs(out, exist_ok=True)
full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head.strip() + "\n</head>\n<body>\n" + body.replace("%%ENDPOINT%%", a.endpoint).strip() + "\n</body>\n</html>\n")
open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(full)
print("wrote rank-survey/index.html", len(full))
if a.preview:
    open(a.preview, "w", encoding="utf-8").write(head + body.replace("%%ENDPOINT%%", ""))
    print("wrote preview", a.preview)
