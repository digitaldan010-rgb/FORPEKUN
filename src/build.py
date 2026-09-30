"""Build the dashboard.
  python3 src/build.py              -> rank-dashboard/index.html (drag this folder onto Netlify)
  python3 src/build.py --preview X  -> also writes a preview copy with a saved sheet snapshot (for the artifact)
Optional: --deposit-gid N --referral-gid N
"""
import argparse, base64, json, os, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("--deposit-gid", default="")
ap.add_argument("--referral-gid", default="")
ap.add_argument("--preview")
ap.add_argument("--snapshot-dir")
a = ap.parse_args()

src = open(os.path.join(ROOT, "src/app.html"), encoding="utf-8").read()
logo = base64.b64encode(open(os.path.join(ROOT, "src/rank-logo.png"), "rb").read()).decode()
src = src.replace("%%LOGO%%", logo).replace("%%DEPOSIT_GID%%", a.deposit_gid).replace("%%REFERRAL_GID%%", a.referral_gid)
head, body = src.split("<!--BODY-->")

out_dir = os.path.join(ROOT, "rank-dashboard")
os.makedirs(out_dir, exist_ok=True)
full = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + head.strip() + "\n</head>\n<body>\n" + body.replace("<!--SNAPSHOT-->", "").strip() + "\n</body>\n</html>\n")
open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8").write(full)
print("wrote rank-dashboard/index.html", len(full))

if a.preview:
    snap = {"takenAt": datetime.datetime.now(datetime.timezone.utc).isoformat()}
    for k, f in (("deposit", "deposit.csv"), ("referral", "referral.csv")):
        snap[k] = open(os.path.join(a.snapshot_dir, f), encoding="utf-8").read()
    tag = "<script>window.RANK_SNAPSHOT = " + json.dumps(snap).replace("</", "<\\/") + ";</script>"
    open(a.preview, "w", encoding="utf-8").write(head + body.replace("<!--SNAPSHOT-->", tag))
    print("wrote preview", a.preview)
