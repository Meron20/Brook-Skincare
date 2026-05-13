// ── BROOK SKINCARE — Typography Standards ──
// Use these constants everywhere instead of writing clamp() manually

export const fontSize = {
    // Headings — use with style={{ fontSize: fontSize.h1 }}
    h1: "clamp(2.5rem, 5vw, 4.5rem)",   // Hero titles: 40px → 72px
    h2: "clamp(2rem, 4vw, 3.5rem)",      // Section titles: 32px → 56px
    h3: "clamp(1.4rem, 2.5vw, 2rem)",    // Card titles: 22px → 32px
    h4: "clamp(1.1rem, 2vw, 1.4rem)",    // Small titles: 18px → 22px
  } as const;
  
  // Body text — use as className
  export const bodyText = {
    large: "text-lg leading-relaxed",     // 18px — intro paragraphs
    normal: "text-base leading-relaxed",  // 16px — main body text
    small: "text-sm leading-relaxed",     // 14px — descriptions
    tiny: "text-xs leading-relaxed",      // 12px — captions, notes
  } as const;
  
  // Labels — use as className
  export const label = {
    tag: "text-xs font-semibold tracking-widest uppercase",  // section tags
    badge: "text-xs font-medium tracking-wider",             // badges
  } as const;
  
  // Buttons — use as className
  export const buttonText = {
    default: "text-sm font-semibold",    // 14px — all buttons
    large: "text-base font-semibold",    // 16px — hero CTAs
  } as const;
  
  // Font family
  export const fontFamily = {
    serif: "'Cormorant Garamond', serif",  // headings
    sans: "var(--font-geist)",             // body
  } as const;