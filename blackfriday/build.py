import json, os
D = os.path.dirname(os.path.abspath(__file__))
prods = json.load(open(os.path.join(D, "variants.json")))

# title prefix -> (compare_at, sale_price)
# Agreed rules: list prices as given (kobo kept); where the list's "old price" is above
# today's site price, use today's site price as the crossed-out price and apply the list's %.
P = {
    "ZOLA Set": (95000, 47500),
    "Geo Tee 2.0 in Black": (64800, 32400),
    "Afrobird Tee": (66690, 33345),                 # site 66,690, 50%
    "Mother of Mankind Gown": (94000, 47000),
    "Kauye Gudu Top": (49504, 29702.40),
    "NACK PVC Polo in Yellow": (56160, 33696),      # site 56,160, 40%
    "NACK Classic Tee": (76000, 45600),             # site 76,000, 40%
    "LXN Jersey in": (60400, 36240),
    "Zuri Dress": (70000, 42000),
    "Festac Native  Dress": (112000, 84000),
    "Festac Native in": (112000, 84000),
    "NACK Addict Tee": (145000, 108750),
    "Afropolitan Movement Tee": (69990, 52492.50),  # site 69,990, 25%
    "Ife Kingdom Tee 2.0": (69900, 52425),          # site 69,900, 25%
    "Fela Tee": (96000, 72000),
    "Ife Kingdom Sweat Top": (90000, 67500),        # site 90,000, 25%
    "Fela Sweat Top": (112950, 84712.50),
    "NACK Classic Sweat Top": (99000, 74250),       # site 99,000, 25%
    "NACK Art Silk Pant": (90600, 67950),
    "AKARA ORANGE SHIRT": (125000, 93750),
    "Female Stripe 2pcs": (90000, 67500),
    "MMVI SHIRT": (94000, 70500),
    "MOM SHIRT": (119000, 89250),
    "Ṣàkóso 2pcs": (220500, 165375),
}

def match(title):
    hits = [k for k in P if title.startswith(k)]
    assert len(hits) == 1, (title, hits)
    return P[hits[0]]

def fmt(x):
    return f"{x:.2f}"

def doc(mode):
    parts, rows = [], []
    for i, p in enumerate(prods):
        cmp_, sale = match(p["title"])
        orig = p["variants"]["nodes"][0]["price"]
        if mode == "sale":
            vs = ",".join(f'{{id:"{v["id"]}",price:"{fmt(sale)}",compareAtPrice:"{fmt(cmp_)}"}}' for v in p["variants"]["nodes"])
            rows.append((p["title"], orig, fmt(cmp_), fmt(sale)))
        else:  # revert to the price each variant had before the sale, clear compare-at
            vs = ",".join(f'{{id:"{v["id"]}",price:"{v["price"]}",compareAtPrice:null}}' for v in p["variants"]["nodes"])
        parts.append(f'p{i}: productVariantsBulkUpdate(productId:"{p["id"]}", variants:[{vs}]) {{ userErrors {{ field message }} }}')
    return parts, rows

for mode in ("sale", "revert"):
    parts, rows = doc(mode)
    for n in range(0, len(parts), 23):
        open(os.path.join(D, f"{mode}_{n//23}.graphql"), "w").write("mutation {\n" + "\n".join(parts[n:n+23]) + "\n}\n")
    if rows:
        for r in rows: print(" | ".join(r))
print("ok")
