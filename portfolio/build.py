"""Builds data for the writing portfolio from the converted article HTML."""
import json, re, sys, html as H
src = sys.argv[1]
A = [
 # (file, title, category)
 ("CEXs VS DEXs","CEXs vs DEXs: Where Should You Trade?","DeFi & Trading"),
 ("DIFFERENCE BTW TRADFI AND DEFI","TradFi vs DeFi: What Actually Changes","DeFi & Trading"),
 ("THE IMPORTANCE OF COMPOSABILITY IN DEFI REVOLUTION","Why Composability Powers the DeFi Revolution","DeFi & Trading"),
 ("TOP 6 DEFI LENDING PLATFORMS IN 2023","Top 6 DeFi Lending Platforms in 2023","DeFi & Trading"),
 ("WHAT IS ALCHEMIX AND HOW DOES IT WORK","What Is Alchemix and How Does It Work?","DeFi & Trading"),
 ("WHERE TO GET THE BEST YIELDS FOR YOUR STABLE COINS","Where to Get the Best Yields on Your Stablecoins","DeFi & Trading"),
 ("SPOT TRADING VS FUTURES TRADING","Spot Trading vs Futures Trading","DeFi & Trading"),
 ("TOP 5 BEST CRYPTO EXCHANGES","The 5 Best Crypto Exchanges","DeFi & Trading"),
 ("BLOCK EXPLORERS THE ULTIMATE BLOCKCHAIN BROWSER","Block Explorers: The Ultimate Blockchain Browser","Web3 & Blockchain"),
 ("ALL YOU NEED TO KNOW ABOUT DAOs","All You Need to Know About DAOs","Web3 & Blockchain"),
 ("HOW TO CREATE A DAO","How to Create a DAO","Web3 & Blockchain"),
 ("THE WEB3","Web3, Explained","Web3 & Blockchain"),
 ("BLOCKCHAIN PROTOCOLS CORRECTED","A Beginner's Guide to Blockchain Protocols","Web3 & Blockchain"),
 ("Ethereum Merge New","The Ethereum Merge, Explained","Web3 & Blockchain"),
 ("BITCOIN VS LITECOIN WHATS THE DIFFERENCE","Bitcoin vs Litecoin: What's the Difference?","Web3 & Blockchain"),
 ("DIFFERENCE BTW SECURITY AND UTILITY TOKENS","Security Tokens vs Utility Tokens","Web3 & Blockchain"),
 ("WHAT IS AN NFT","What Is an NFT?","NFTs & Metaverse"),
 ("WHY ARE NFTs VALUABLE","Why Are NFTs Valuable?","NFTs & Metaverse"),
 ("HOW TO IDENTIFY NFT COLLECTIONS WITH POTENTIAL","How to Spot NFT Collections With Potential","NFTs & Metaverse"),
 ("NFT LENDING AND BORROWING","NFT Lending and Borrowing","NFTs & Metaverse"),
 ("APECOIN VS BAYC NFT","ApeCoin and the Bored Ape Yacht Club","NFTs & Metaverse"),
 ("PANTHERS NFT GUIDE","The Panthers NFT Guide","NFTs & Metaverse"),
 ("ALL YOU NEED TO KNOW ABOUT THE METAVERSE","All You Need to Know About the Metaverse","NFTs & Metaverse"),
 ("TOP METAVERSE LANDS new","The Top Metaverse Lands","NFTs & Metaverse"),
 ("TOP 8 CRYPTO INVESTING MISTAKES","8 Crypto Investing Mistakes to Avoid","Investing"),
 ("TOP 7 INVESTING PRINCIPLES","7 Investing Principles Worth Living By","Investing"),
 ("WHAT IS AN INVESTMENT THESIS AND HOW TO BUILD ONE","What Is an Investment Thesis, and How Do You Build One?","Investing"),
 ("BEST TIME TO INVEST","When Is the Best Time to Invest?","Investing"),
 ("STOCKS OR BITCOIN- WHICH IS THE BETTER INVESTMENT OPTION","Stocks or Bitcoin: Which Is the Better Investment?","Investing"),
 ("5 SECTORS TO KEEP AN EYE ON IN 2023","5 Crypto Sectors to Watch in 2023","Investing"),
 ("7 TIPS ON HOW TO KEEP YOUR CRYPTO SECURE","7 Ways to Keep Your Crypto Secure","Investing"),
 ("5 WAYS TO GET CRYPTO FOR FREE","5 Ways to Get Crypto for Free","Investing"),
 ("WHAT YOUR BUSINESS NEEDS TO KNOW ABOUT ACCEPTING BITCOIN","What Your Business Should Know About Accepting Bitcoin","Investing"),
 ("TOP 5 MOST EXPENSIVE GIFT CARDS","The 5 Most Valuable Gift Cards","Gift Cards & Work"),
 ("HOW TO FIND CHINESE GIFT CARD VENDORS WITH GOOD RATE","How to Find Gift Card Vendors With Good Rates","Gift Cards & Work"),
 ("HOW CAN YOU FIX GOOGLE GIFT CARD ERROR","How to Fix a Google Play Gift Card Error","Gift Cards & Work"),
 ("REMOTE WORK CORRECTED","The Nitty-Gritty of Remote Work","Gift Cards & Work"),
]
out=[]
for f,t,c in A:
    h=open(f"{src}/{f}.html",encoding="utf-8").read()
    h=re.sub(r'<p>\s*<img[^>]*>\s*</p>','',h); h=re.sub(r'<img[^>]*>','',h)
    h=re.sub(r'<p>(INTRODUCTION|PANTHERS NFT GUIDE)</p>','',h)
    h=re.sub(r'<p>\s*<strong>(.{2,120}?)</strong>\s*:?\s*</p>',r'<h3>\1</h3>',h)
    h=re.sub(r'<h[1-6][^>]*>',"<h3>",h); h=re.sub(r'</h[1-6]>',"</h3>",h)
    h=re.sub(r'<p>\s*</p>','',h)
    h=re.sub(r'<a href=','<a target="_blank" rel="noopener" href=',h)
    h=re.sub(r' (style|id|class)="[^"]*"','',h)
    txt=H.unescape(re.sub(r'<[^>]+>',' ',h)); words=len(txt.split())
    first=H.unescape(re.sub(r'<[^>]+>','',re.search(r'<p>(.*?)</p>',h,re.S).group(1))).strip()
    ex=first if len(first)<190 else first[:185].rsplit(' ',1)[0]+'…'
    slug=re.sub(r'[^a-z0-9]+','-',t.lower()).strip('-')[:60].strip('-')
    out.append(dict(slug=slug,title=t,cat=c,mins=max(2,round(words/230)),words=words,excerpt=ex,body=h.strip()))
print(json.dumps(out,ensure_ascii=False))
