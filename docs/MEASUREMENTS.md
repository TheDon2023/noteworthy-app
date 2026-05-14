
================================================================
NOTEWORTHY CAPITAL LLC — COMPLETE MEASUREMENT SPEC
Reference: Gemini_Generated_Image_6gv08y6gv08y6gv0(4).png
Dimensions: {w} x {h} pixels
================================================================

--- PAGE STRUCTURE ---
Total Height: {h}px

Section Breakdown (approximate pixel positions):
  y=0      : Page top
  y=0-60   : HEADER (~60px)
  y=60-350 : HERO (~290px)
  y=330-400: STATS BAR (~70px, overlaps hero by 20px)
  y=380+   : CREAM SECTION ("WHAT WE DO")

--- HEADER (y=0 to ~60) ---
Height:                    60px
Background:                #051020 (very dark navy)
Bottom border:             1px solid rgba(197,160,89,0.15)

Logo lockup:
  Position:                x=48px from left
  Height:                  ~44px
  "NW" monogram:           ~32px tall in bordered square

Nav links (5 items):
  Font:                    Inter 11px uppercase
  Letter-spacing:          0.10em
  Color:                   #a8b2d1 (muted blue-gray)
  Gap between items:       ~30px
  Vertical position:       centered in header

"EMPLOYEE LOGIN" button:
  Position:                right edge, x=~48px from right
  Font:                    Inter 11px uppercase
  Padding:                 10px 20px
  Border:                  1px solid #C5A059
  Border-radius:           2px
  Background:              transparent
  Color:                   #C5A059

--- HERO SECTION (y=60 to ~350) ---
Background:                #051020

Hero scroll image:
  Position:                right side, absolute
  Left edge:               ~45% from page left (x~570)
  Right edge:              page right edge
  Top:                     aligned with hero top (y=60)
  Bottom:                  aligned with hero bottom (y=350)
  Size:                    ~55% of page width
  Display:                 contained, not cropped (object-fit: contain)
  Gradient overlay:        linear-gradient from solid navy left to transparent right

Hero content (left side):
  Max-width:               ~520px
  Left padding:            48px from page edge
  Top padding:             ~30px below header

Headline "Turning Paper":
  Font:                    Playfair Display Bold
  Size:                    ~64px (desktop)
  Line-height:             1.05
  Color:                   #F8F9FA (off-white)
  Letter-spacing:          -0.02em

Headline "Into Liquidity.":
  Font:                    Playfair Display Bold
  Size:                    ~64px (desktop)
  Line-height:             1.05
  Color:                   #C5A059 (gold)
  Letter-spacing:          -0.02em

Gold divider line:
  Width:                   ~50px
  Height:                  2px
  Color:                   #C5A059
  Margin-top:              ~16px below headline
  Margin-bottom:           ~16px

Body paragraph:
  Font:                    Inter Light 14-15px
  Line-height:             1.65
  Color:                   #a8b2d1 (muted)
  Max-width:               ~400px
  Lines:                   4 lines

CTA Buttons (side by side):
  Gap between:             ~12px
  Margin-top:              ~20px below body text

  Primary "SELL YOUR NOTE":
    Font:                  Inter 11px Bold, uppercase, letter-spacing 0.14em
    Background:            #C5A059
    Color:                 #051020
    Padding:               14px 24px
    Border-radius:         3px
    Icon:                  phone, 14px, left of text

  Secondary "JOIN BUYER POOL":
    Font:                  Inter 11px Semibold, uppercase, letter-spacing 0.14em
    Background:            transparent
    Color:                 #C5A059
    Padding:               14px 24px
    Border:                1px solid rgba(197,160,89,0.55)
    Border-radius:         3px
    Icon:                  user, 14px, left of text

Trust Badges (3 items, horizontal):
  Margin-top:              ~24px below CTAs
  Gap between items:       ~28px

  Each badge:
    Icon circle:           30px diameter
    Circle border:         1px solid rgba(197,160,89,0.25)
    Icon color:            #C5A059
    Icon size:             15px
    Label line 1:          Inter 11px Semibold, #F8F9FA
    Label line 2:          Inter 11px Regular, #a8b2d1
    Gap icon-to-text:      8px

--- STATS BAR (y=~330 to ~400) ---
Position:                  overlaps bottom of hero by ~20px
Container max-width:       ~1100px
Height:                    ~70px
Background:                #0a192f
Border:                    1px solid rgba(197,160,89,0.25)
Border-radius:             8px
Box-shadow:                0 16px 48px rgba(0,0,0,0.4)
Margin:                    0 auto

Layout:                    4-column grid
Column dividers:           1px solid rgba(197,160,89,0.15) (except last)

Each stat item:
  Layout:                  icon left, text right, horizontally centered
  Icon circle:             44px diameter
  Circle border:           1px solid rgba(197,160,89,0.22)
  Icon color:              #C5A059
  Icon size:               18px
  Gap icon-to-text:        12px

  Number:
    Font:                  Playfair Display Bold 32px
    Color:                 #F8F9FA

  Label:
    Font:                  Inter 9px uppercase, letter-spacing 0.12em
    Color:                 #a8b2d1
    Margin-top:            2px

--- "WHAT WE DO" SECTION (y=~400+) ---
Background:                #F7F2E8 (cream)
Top padding:               ~60px
Bottom padding:            ~60px

Subtle pattern overlay:
  Background image:        cream-contour-pattern.png
  Opacity:                 4-6%
  Background-size:         cover

Section header (centered):
  "WHAT WE DO":
    Font:                  Inter 11px uppercase
    Letter-spacing:        0.38em
    Color:                 #C5A059
    Margin-bottom:         16px

  "Full-Service Note Trading":
    Font:                  Playfair Display Bold 40px
    Color:                 #051020
    Margin-bottom:         16px

  Diamond divider:
    Center diamond:        6px square, rotated 45deg, #C5A059
    Line left:             ~48px wide, 1px, rgba(197,160,89,0.35)
    Line right:            ~48px wide, 1px, rgba(197,160,89,0.35)
    Gap diamond-to-line:   10px
    Margin-bottom:         16px

  Description:
    Font:                  Inter Light 15px
    Color:                 #6b7a94
    Max-width:             ~520px
    Margin:                0 auto

Service cards (5-column grid):
  Grid gap:                ~24px
  Margin-top:              ~48px below header

  Each card:
    Layout:                icon left, text right (horizontal)
    Icon circle:           48px diameter
    Circle background:     #051020
    Icon color:            #C5A059
    Icon size:             20px
    Gap icon-to-text:      12px

    Title:
      Font:                Inter 14px Bold
      Color:               #051020
      Margin-bottom:       6px

    Description:
      Font:                Inter 12px Light
      Color:               #6b7a94
      Line-height:         1.6

--- FOOTER ---
Height:                    ~50px
Background:                #051020
Border-top:                1px solid rgba(197,160,89,0.06)

Content:
  NW monogram:             ~20px tall, muted/gray
  Copyright:               Inter 11px Light, #a8b2d1
  Links:                   Inter 11px Light, #a8b2d1
  Layout:                  flex, space-between, centered vertically

================================================================
KEY DIFFERENCES FROM CURRENT DEPLOYMENT:
================================================================

1. Scroll image is SMALLER in reference — about 55% width on right,
   NOT overlapping the left text area. Current version overlaps.

2. Headline font should be LARGER — ~64px Playfair Display, not
   the current smaller size.

3. Body text max-width is NARROWER — ~400px, not current wider.

4. Stats bar overlaps MORE into hero — ~20px overlap, current
   has too much or too little.

5. Hero section height is SHORTER — the reference compresses
   everything vertically more than current.

6. "Into Liquidity." has a period at the end.

7. CTA buttons are SMALLER font — 11px, not current 12px+.
