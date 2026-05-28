import re

css_path = r"c:\Users\User\OneDrive\שולחן העבודה\תואר ראשון טכנולוגית למידה\סמסטר ב\פיתוח אתרי אינטרנט\How_to_find_a_job_site\css\styles.css"

with open(css_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Comment root variables
old_root = """:root {
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-soft: #ffffff;
  --color-muted: #ffffff;
  --color-ink: #101112;
  --color-text: #2a2d2f;
  --color-subtle: #6a6f75;
  --color-border: #d8d4ca;
  --color-primary: #78f2a7;
  --color-primary-strong: #43dc80;
  --color-blue: #5d7cff;
  --color-forum-blue: #4067FB;
  --color-footer-bg: #7DFFB5;
  --color-purple: #8d6bf2;
  --color-pink: #F653D5;
  --color-blue-soft: rgba(93, 124, 255, 0.35);
  --color-orange: #ff6b2d;
  --color-yellow: #dfff4f;"""

new_root = """/* ==========================================================================
   הגדרת משתנים גלובליים (CSS Variables / Design Tokens)
   ========================================================================== */
:root {
  /* צבעי רקע סמנטיים (משמשים להפרדה והכנה נוחה למצב כהה / Dark Mode בעתיד) */
  --color-bg: #ffffff;       /* צבע הרקע הראשי של דפי האתר */
  --color-surface: #ffffff;  /* צבע הרקע של רכיבים וכרטיסיות (למשל כרטיסיות מילון משרות) */
  --color-soft: #ffffff;     /* צבע רקע עדין משני */
  --color-muted: #ffffff;    /* צבע רקע מוחלש לתיבות ומידע משני */

  /* צבעי טקסט ודיו */
  --color-ink: #101112;      /* צבע כהה עיקרי לטקסט וכותרות (סגנון ניאו-ברוטליסטי) */
  --color-text: #2a2d2f;     /* צבע טקסט רץ (קריא ורך יותר) */
  --color-subtle: #6a6f75;   /* צבע טקסט משני עדין */
  --color-border: #d8d4ca;   /* צבע גבולות ברירת מחדל */

  /* צבעי מותג וצבעים אינטראקטיביים */
  --color-primary: #78f2a7;         /* צבע ירוק ראשי (משמש לריחוף, כפתורים פעילים והדגשות) */
  --color-primary-strong: #43dc80;  /* צבע ירוק כהה וחזק יותר */
  --color-blue: #5d7cff;            /* צבע כחול ראשי */
  --color-forum-blue: #4067FB;      /* צבע כחול לפורומים */
  --color-footer-bg: #7DFFB5;       /* צבע רקע ירוק לחלק התחתון (Footer) */
  --color-purple: #8d6bf2;          /* צבע סגול */
  --color-pink: #F653D5;            /* צבע ורוד מודגש */
  --color-blue-soft: rgba(93, 124, 255, 0.35); /* צבע כחול שקוף למחצה */
  --color-orange: #ff6b2d;          /* צבע כתום */
  --color-yellow: #dfff4f;          /* צבע צהוב זוהר */"""

content = content.replace(old_root, new_root)

# 2. Comment job panels
old_job_panels = """.job-panels {
  display: grid;
  gap: 1rem;
}
.job-panel {
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  transition: opacity 220ms ease, transform 220ms ease, visibility 220ms ease;
}"""

new_job_panels = """/* --------------------------------------------------------------------------
   מילון משרות ותפקידים - מיכלי המידע (Job Panels)
   ניהול התצוגה, המעברים והאנימציות בעת סינון קטגוריות
   -------------------------------------------------------------------------- */
.job-panels {
  display: grid;
  gap: 1rem;
}
.job-panel {
  padding: 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  /* טרנזקציה להעלמה והופעה חלקה של הקטגוריות */
  transition: opacity 220ms ease, transform 220ms ease, visibility 220ms ease;
}"""

content = content.replace(old_job_panels, new_job_panels)

# 3. Comment job panel specificity order
old_specificity = """.job-panel:not([hidden]) {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}
.job-panel[hidden] {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
.job-panel.fade-in {
  opacity: 1;
  transform: translateY(0);
}
.job-panel.fade-out {
  opacity: 0;
  transform: translateY(-10px);
}"""

new_specificity = """/* הגדרת מצב פעיל (גלוי) - סדר ההגדרות חשוב למניעת דריסת הטרנזקציות */
.job-panel:not([hidden]) {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
}
/* הגדרת מצב כבוי (מוסתר) - קורס לחלוטין ומעלים את המיכל מהמסך */
.job-panel[hidden] {
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
/* סגנונות מעבר (Transitions) - מוגדרים בסוף כדי שייגברו על הגדרות ברירת המחדל */
.job-panel.fade-in {
  opacity: 1;
  transform: translateY(0);
}
.job-panel.fade-out {
  opacity: 0;
  transform: translateY(-10px);
}"""

content = content.replace(old_specificity, new_specificity)

# 4. Comment companies carousel
old_carousel = """.companies-carousel-container {
  overflow: hidden;
  width: 100%;
  padding-block: var(--space-4) var(--space-5);
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  direction: ltr; /* Align the track to the left, ensuring overflow is on the right and works correctly in RTL */
}

.companies-carousel-track {
  display: flex;
  width: max-content;
  gap: var(--space-4);
  animation: marquee-scroll 32s linear infinite;
  direction: ltr; /* Force track layout to LTR so translateX works consistently across all screens */
}"""

new_carousel = """/* --------------------------------------------------------------------------
   קרוסלת חברות מובילות (Infinite Marquee Carousel)
   מנגנון תנועה אינסופי של לוגואים ומידע המותאם לדפי עברית (RTL)
   -------------------------------------------------------------------------- */
.companies-carousel-container {
  overflow: hidden;
  width: 100%;
  padding-block: var(--space-4) var(--space-5);
  position: relative;
  /* אפקט טשטוש (Fade) בצדדים של הקרוסלה ליצירת מראה יוקרתי */
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
  /* הגדרה קריטית ל-LTR כדי שהקרוסלה תתחיל משמאל, ותאפשר גלישת תוכן ימינה מחוץ למסך בדפי עברית (RTL) */
  direction: ltr; 
}

.companies-carousel-track {
  display: flex;
  width: max-content;
  gap: var(--space-4);
  /* אנימציית הזזה רציפה (Marquee) */
  animation: marquee-scroll 32s linear infinite;
  /* פריסת ה-Flex של הכרטיסיות משמאל לימין כדי להבטיח חישוב תזוזה תקין בכל המסכים */
  direction: ltr; 
}"""

content = content.replace(old_carousel, new_carousel)

with open(css_path, "w", encoding="utf-8") as f:
    f.write(content)

print("styles.css commented successfully.")
