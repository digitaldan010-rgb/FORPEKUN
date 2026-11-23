import os
D = os.path.dirname(os.path.abspath(__file__))
LOGO = "https://cdn.klaviyomail.com/company/RYnHx5/images/7cfdc29e-84d6-4954-9920-0d6949ed1c86.png"
SITE = "https://nackapparel.com"
SALE = SITE + "/collections/nack-friday"
YEL = "#F5DD3D"
A = "text-decoration:none !important;border:0;"
PF = "font-family:'Playfair Display',Georgia,serif;font-weight:400;"

P = {  # handle, title, image, old, new
 "zola": ("zola-set", "ZOLA Set", "050DADD0-9B47-40A3-AB3B-99D2D08166EA.jpg?v=1775140739", "95,000", "47,500"),
 "mom": ("m-o-m-gown-mother-of-mankind", "Mother of Mankind Gown", "E9BCC370-8C10-4FB3-9B11-305EFAA41A30.jpg?v=1744119622", "94,000", "47,000"),
 "geo": ("geo-tee-2-0-in-black", "Geo Tee 2.0", "IMG_0173-Edit_Original.jpg?v=1723042246", "64,800", "32,400"),
 "afro": ("afrobird-tee-in-pink-1", "Afrobird Tee", "afroblk1.jpg?v=1723040878", "66,690", "33,345"),
 "sweat": ("nack-classic-sweat-top-in-black", "NACK Classic Sweat Top", "0381B062-0970-4857-9766-08C490B6A820.jpg?v=1744381708", "99,000", "74,250"),
 "silk": ("nack-art-silk-pant-in-black", "NACK Art Silk Pant", "AEF2BA6F-FD39-4194-9513-8896AADA0736.jpg?v=1735941625", "90,600", "67,950"),
 "festac": ("festac-native-dress-in-wine", "Festac Native Dress", "75A200A4-156F-40A3-9C8E-24470BC9C343.jpg?v=1732726892", "112,000", "84,000"),
 "fela": ("fela-sweat-top-in-black", "Fela Sweat Top", "IMG_4276.jpg?v=1723043200", "112,950", "84,712.50"),
 "akara": ("akara-orange-shirt", "Akara Orange Shirt", "AC6E5CDA-5B71-4D84-B3A0-1A906832AB86.jpg?v=1790675160", "125,000", "93,750"),
 "sakoso": ("ṣakoso-2pcs", "Ṣàkóso 2pcs", "DFE4B733-6BD1-4D17-94E3-B03A034764BC.jpg?v=1778067941", "220,500", "165,375"),
 "addict": ("nack-addict-tee-in-black-oversized", "NACK Addict Tee", "3B8F2447-4C6A-4B38-A683-F31846571973.jpg?v=1723038752", "145,000", "108,750"),
 "zuri": ("zuri-dress-in-beige", "Zuri Dress", "163DA739-2F68-422F-A1B2-361870C68FCB.jpg?v=1776790062", "70,000", "42,000"),
}
IMG = "https://cdn.shopify.com/s/files/1/0672/8017/5334/files/"

def head(title, preview):
    return f'''<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title>
<style>
body {{ margin:0; padding:0; background:#EDEBE6; }}
a, a:link, a:visited {{ text-decoration:none !important; border-bottom:none !important; }}
@media only screen and (max-width:620px) {{ .wrap {{ width:100% !important; }} .pad {{ padding-left:24px !important; padding-right:24px !important; }} .h1 {{ font-size:48px !important; }} .h2 {{ font-size:30px !important; }} .nav a {{ padding:0 6px !important; font-size:12px !important; }} }}
</style></head>
<body style="margin:0;padding:0;background:#EDEBE6;">
<div style="display:none;max-height:0;overflow:hidden;">{preview}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDEBE6;"><tr><td align="center">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#FFFFFF;font-family:'Lato',Arial,Helvetica,sans-serif;color:#141414;">
<tr><td align="center" style="background:#0F0F0F;padding:30px 20px 20px;"><a href="{SITE}" style="{A}"><img src="{LOGO}" width="96" alt="NACK" style="display:block;width:96px;height:auto;border:0;"></a></td></tr>
<tr><td align="center" class="nav" style="background:#0F0F0F;padding:0 10px 24px;font-size:14px;letter-spacing:1.5px;">
<a href="{SITE}/collections/nack-him" style="{A}color:#FFFFFF !important;padding:0 14px;">NACK HIM</a>
<a href="{SITE}/collections/for-her" style="{A}color:#FFFFFF !important;padding:0 14px;">NACK HER</a>
<a href="{SITE}/collections/lxn" style="{A}color:#FFFFFF !important;padding:0 14px;">LXN</a>
<a href="{SALE}" style="{A}color:{YEL} !important;padding:0 14px;">NACK FRIDAY</a>
</td></tr>
'''

FOOT = f'''<tr><td align="center" style="background:#0F0F0F;padding:34px 20px 30px;color:#FFFFFF;font-size:14px;letter-spacing:1.5px;">
<img src="{LOGO}" width="56" alt="NACK" style="display:block;width:56px;height:auto;border:0;margin:0 auto 18px;">
<a href="{SITE}" style="{A}color:#FFFFFF !important;">NACKAPPAREL.COM</a>
<p style="margin:12px 0 0;font-size:13px;letter-spacing:1px;"><a href="https://www.instagram.com/nack_apparel" style="{A}color:#BDBDBD !important;">INSTAGRAM @NACK_APPAREL</a></p>
<p style="margin:16px 0 0;font-size:11px;letter-spacing:0.5px;color:#8A8A8A;">You’re receiving this because you shopped with or signed up to NACK Apparel. {{% unsubscribe 'Unsubscribe' %}}</p>
</td></tr></table></td></tr></table></body></html>
'''

def hero(label, h1, sub=None, pill=None):
    s = f'<tr><td align="center" class="pad" style="background:#0F0F0F;padding:48px 48px 56px;">'
    s += f'<p style="margin:0 0 18px;font-size:14px;letter-spacing:5px;color:#FFFFFF;">{label}</p>'
    s += f'<div style="width:64px;height:2px;background:{YEL};margin:0 auto 26px;line-height:2px;font-size:0;">&nbsp;</div>'
    s += f'<h1 class="h1" style="margin:0;{PF}font-size:62px;line-height:1.02;color:#FFFFFF;">{h1}</h1>'
    if sub: s += f'<p style="margin:22px 0 0;{PF}font-style:italic;font-size:26px;color:#FFFFFF;">{sub}</p>'
    if pill: s += f'<p style="margin:22px 0 0;"><span style="display:inline-block;background:{YEL};color:#0F0F0F;font-size:14px;font-weight:700;letter-spacing:3px;padding:7px 16px;">{pill}</span></p>'
    return s + '</td></tr>\n'

def text(html, pad="44px 64px 20px", align="center", size=17):
    return f'<tr><td align="{align}" class="pad" style="padding:{pad};font-size:{size}px;line-height:1.65;color:#333333;">{html}</td></tr>\n'

def button(label, url, dark=True, pad="12px 64px 40px"):
    bg, fg = ("#0F0F0F", "#FFFFFF") if dark else ("#FFFFFF", "#0F0F0F")
    return f'<tr><td align="center" style="padding:{pad};"><a href="{url}" style="{A}display:inline-block;background:{bg};color:{fg} !important;font-size:15px;letter-spacing:2px;padding:16px 44px;border-radius:30px;">{label}</a></td></tr>\n'

def card(k, note=None):
    h, t, img, old, new = P[k]
    url = f"{SITE}/products/{h}"
    n = f'<p style="margin:6px 0 0;font-size:13px;color:#B3261E;font-weight:700;">{note}</p>' if note else ''
    return (f'<td width="262" valign="top" style="width:262px;padding:0 8px 26px;">'
            f'<a href="{url}" style="{A}"><img src="{IMG}{img}&width=600" width="260" alt="{t}" style="display:block;width:100%;height:auto;border:0;"></a>'
            f'<p style="margin:12px 0 4px;font-size:14px;letter-spacing:1.5px;text-align:center;"><a href="{url}" style="{A}color:#141414 !important;">{t.upper()}</a></p>'
            f'<p style="margin:0;text-align:center;font-size:15px;"><span style="color:#8A8A8A;text-decoration:line-through;">₦{old}</span>&nbsp;&nbsp;<b style="color:#141414;">₦{new}</b></p>{n}</td>')

def grid(keys, notes=None):
    notes = notes or {}
    rows = ""
    for i in range(0, len(keys), 2):
        rows += "<tr>" + "".join(card(k, notes.get(k)) for k in keys[i:i+2]) + "</tr>"
    return f'<tr><td class="pad" style="padding:8px 24px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">{rows}</table></td></tr>\n'

def bullets(items):
    return "".join(f'<p style="margin:0 0 10px;font-size:17px;line-height:1.5;"><span style="color:#0F0F0F;font-weight:700;">—</span>&nbsp; {i}</p>' for i in items)

E = {}
# 2 Tue sneak peek
E["2_sneak_peek"] = head("Sneak peek: what's going 50% off", "3 days out. Here's the list.") + \
    hero("SNEAK PEEK · 3 DAYS TO GO", "What’s going<br>50% off", pill="FRI 27 – SUN 29 NOVEMBER") + \
    text("<h2 class='h2' style=\"margin:0 0 16px;" + PF + "font-size:34px;color:#141414;\">Hey {{ first_name|default:'there' }},</h2>You asked, so here’s a first look at what’s dropping on Friday:") + \
    grid(["zola", "mom", "geo", "afro"]) + \
    text("These prices go live on <b>Friday at 12am (midnight)</b>. Save them now so you’re not searching on the day.", pad="6px 64px 22px") + \
    button("SEE WHAT’S ON SALE", SALE) + FOOT

# 3 Thu tomorrow
E["3_tomorrow"] = head("Tomorrow, 12am. Set a reminder", "The best sizes go in the first few hours.") + \
    hero("1 DAY TO GO", "Tomorrow,<br>12am", sub="Set a reminder ⏰") + \
    text("<h2 class='h2' style=\"margin:0 0 16px;" + PF + "font-size:34px;color:#141414;\">Hey {{ first_name|default:'there' }},</h2>NACK Friday starts <b>tomorrow at 12am (midnight)</b>.") + \
    text("<p style=\"margin:0 0 14px;font-size:13px;letter-spacing:3px;color:#777777;text-align:center;\">WHAT TO KNOW BEFORE IT STARTS</p>" + bullets(["Up to 50% off selected styles", "Ends Sunday 29 Nov at midnight", "No restocks on sale pieces"]), pad="12px 96px 10px", align="left") + \
    text("Your wishlist is ready. Tomorrow you just check out.", pad="10px 64px 22px") + \
    button("VIEW MY WISHLIST", SITE + "/pages/swym-wishlist") + \
    f'<tr><td class="pad" style="padding:0 32px 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F0F;"><tr><td align="center" style="padding:30px 28px;color:#FFFFFF;">' \
    f'<p style="margin:0 0 10px;font-size:12px;letter-spacing:3px;color:{YEL};">CAN’T WAIT? EARLY ACCESS IS OPEN TODAY</p>' \
    f'<p style="margin:0 0 8px;{PF}font-size:30px;color:#FFFFFF;">Use code INNERCIRCLE</p>' \
    f'<p style="margin:0 0 20px;font-size:16px;line-height:1.55;color:#DDDDDD;">30% off everything on the website, today only. Ends tonight at 11:59pm.</p>' \
    f'<a href="{SITE}" style="{A}display:inline-block;background:#FFFFFF;color:#0F0F0F !important;font-size:14px;letter-spacing:2px;padding:14px 34px;border-radius:30px;">SHOP EARLY ACCESS</a></td></tr></table></td></tr>\n' + FOOT

# 4 Fri live
E["4_live"] = head("It's live. Up to 50% off NACK", "Your wishlist just got cheaper.") + \
    hero("NACK FRIDAY", "It’s live.", sub="Up to 50% off selected pieces") + \
    button("SHOP THE SALE", SALE, pad="40px 64px 10px") + \
    text("<h2 class='h2' style=\"margin:0 0 6px;" + PF + "font-size:34px;color:#141414;\">NACK Friday is ON.</h2>", pad="24px 64px 4px") + \
    grid(["sweat", "silk", "festac", "zola", "fela", "akara"]) + \
    text("Up to 50% off selected pieces, until <b>Sunday midnight</b>. Once a size is gone, it’s gone.", pad="6px 64px 22px") + \
    button("SHOP NOW", SALE) + FOOT

# 5 Sat mid-sale
E["5_mid_sale"] = head("Your size might not make it to Sunday", "Here's what's still in stock.") + \
    hero("DAY 2", "Your size might<br>not make it<br>to Sunday") + \
    text("<h2 class='h2' style=\"margin:0 0 16px;" + PF + "font-size:34px;color:#141414;\">Hey {{ first_name|default:'there' }},</h2>Day 2, and some pieces are already running low. Still available right now:") + \
    grid(["sakoso", "addict", "geo", "afro"], notes={"sakoso": "1 left in each size", "addict": "Last 1 in M and XXL", "geo": "S and M sold out · L, XL, XXL, 3XL left", "afro": "Last 1 in S and XXL"}) + \
    text("If it’s in your cart, now’s the time.", pad="6px 64px 22px") + \
    button("SHOP WHAT’S LEFT", SALE) + FOOT

# 6 Sun last call
E["6_last_call"] = head("Ends at midnight. Last call", "Up to 50% off disappears tonight.") + \
    hero("LAST CALL", "Ends at<br>midnight ⏰", pill="TONIGHT · SUN 29 NOV") + \
    text("<h2 class='h2' style=\"margin:0 0 16px;" + PF + "font-size:34px;color:#141414;\">This is it.</h2>NACK Friday ends <b>tonight at midnight</b>. After that, everything goes back to full price.") + \
    button("SHOP BEFORE MIDNIGHT", SALE, pad="12px 64px 30px") + \
    grid(["mom", "sweat", "zuri", "silk"]) + \
    button("SHOP BEFORE MIDNIGHT", SALE) + FOOT

for k, v in E.items():
    open(os.path.join(D, f"bf_{k}.html"), "w").write(v)
print(list(E))
