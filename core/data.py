"""Site content for Pixels & Code Studios.

Static content lives here so views stay thin. Edit copy in one place.
"""

SERVICES = [
    {
        'num': '01',
        'slug': 'websites',
        'title': 'Websites',
        'blurb': 'High-performance sites engineered to convert — from landing pages to full platforms.',
        'tag': 'Design · Develop · Deploy',
        'points': ['Conversion-first UX and copy', 'Custom design systems, no templates',
                   'Core Web Vitals in the green', 'SEO and analytics wired in from day one'],
    },
    {
        'num': '02',
        'slug': 'apps',
        'title': 'App Development',
        'blurb': 'Web and mobile apps built for scale, shipped fast without cutting corners.',
        'tag': 'iOS · Android · Web',
        'points': ['Native iOS / Android and cross-platform', 'API design and cloud architecture',
                   'CI/CD pipelines and automated testing', 'App Store launch and iteration'],
    },
    {
        'num': '03',
        'slug': 'content',
        'title': 'Content Creation',
        'blurb': 'Scroll-stopping content pipelines that keep your audience coming back daily.',
        'tag': 'Short-form · Long-form',
        'points': ['Daily short-form pipelines', 'YouTube strategy and production',
                   'Scripting, hooks and retention editing', 'Platform-native repurposing'],
    },
    {
        'num': '04',
        'slug': 'branding',
        'title': 'Personal Branding',
        'blurb': 'We turn founders and creators into recognizable, trusted names in their niche.',
        'tag': 'Strategy · Identity · Growth',
        'points': ['Positioning and narrative', 'Visual identity and art direction',
                   'LinkedIn / X ghostwriting systems', 'Inbound audience growth'],
    },
    {
        'num': '05',
        'slug': 'video',
        'title': 'Video Editing',
        'blurb': 'Cinema-grade edits, color and sound design that make every frame earn attention.',
        'tag': 'Edit · Grade · Motion',
        'points': ['Long-form and short-form editing', 'Color grading and sound design',
                   'Motion graphics and 3D inserts', 'Brand-consistent templates'],
    },
    {
        'num': '06',
        'slug': 'leads',
        'title': 'Sales & Leads',
        'blurb': 'Outbound systems and funnels that fill your calendar with qualified conversations.',
        'tag': 'Funnels · Outreach · CRM',
        'points': ['Cold email and outbound systems', 'Landing funnels that convert',
                   'CRM setup and automation', 'Sales asset production'],
    },
    {
        'num': '07',
        'slug': 'marketing',
        'title': 'Marketing',
        'blurb': 'Full-stack marketing and commercialization that turns products into revenue.',
        'tag': 'Paid · Organic · Launch',
        'points': ['Paid social and search', 'Organic growth loops',
                   'Launch and go-to-market playbooks', 'Attribution and reporting'],
    },
]

STATS = [
    {'value': 120, 'suffix': '+', 'label': 'Projects shipped'},
    {'value': 40, 'suffix': 'M+', 'label': 'Views generated'},
    {'value': 3, 'suffix': 'x', 'label': 'Avg. client growth'},
    {'value': 98, 'suffix': '%', 'label': 'Clients retained'},
]

PROCESS = [
    {'num': '01', 'title': 'Discover', 'blurb': 'We dig into your brand, market and goals until we know them cold.'},
    {'num': '02', 'title': 'Design', 'blurb': 'Identity, interfaces and content direction — crafted, not templated.'},
    {'num': '03', 'title': 'Build', 'blurb': 'Sites, apps and content engines shipped on aggressive timelines.'},
    {'num': '04', 'title': 'Launch', 'blurb': 'Go-to-market with paid, organic and outbound firing together.'},
    {'num': '05', 'title': 'Grow', 'blurb': 'Iterate on data. Double down on what converts. Scale what works.'},
]

TEAM = [
    {'count': 14, 'role': 'Strategists', 'blurb': 'Positioning, brand and go-to-market'},
    {'count': 22, 'role': 'Designers', 'blurb': 'Identity, product and motion design'},
    {'count': 31, 'role': 'Engineers', 'blurb': 'Web, mobile and platform builds'},
    {'count': 18, 'role': 'Editors & Motion', 'blurb': 'Edits, grades and sound design'},
    {'count': 19, 'role': 'Growth & Sales', 'blurb': 'Paid, organic, outbound and CRM'},
]

TESTIMONIALS = [
    {
        'quote': 'They rebuilt our site and our funnel in six weeks. Inbound leads tripled the following quarter.',
        'who': 'Founder, D2C skincare brand',
    },
    {
        'quote': 'The only partner we’ve had that treats design, engineering and growth as one problem. It shows in the numbers.',
        'who': 'CMO, fintech startup',
    },
    {
        'quote': 'My channel’s entire look, cadence and monetization runs through their team. I just film.',
        'who': 'Creator, 2M+ subscribers',
    },
]

WORK = [
    {
        'title': 'Lumen SaaS Platform', 'tag': 'Web · Product', 'hue': 'a',
        'year': '2026', 'blurb': 'Marketing site, product UI and onboarding flow for a B2B analytics platform.',
        'result': '2.4x demo bookings in 90 days',
    },
    {
        'title': 'Forge Fitness App', 'tag': 'App · Brand', 'hue': 'b',
        'year': '2025', 'blurb': 'iOS + Android training app with a full identity system and launch campaign.',
        'result': '40K installs in launch month',
    },
    {
        'title': 'Creator Growth Engine', 'tag': 'Content · Video', 'hue': 'c',
        'year': '2026', 'blurb': 'End-to-end content pipeline — scripting, edits, thumbnails, distribution.',
        'result': '12M views across 6 months',
    },
    {
        'title': 'Atlas D2C Launch', 'tag': 'Marketing · Sales', 'hue': 'd',
        'year': '2025', 'blurb': 'Go-to-market: funnels, paid social and outbound for a premium D2C brand.',
        'result': '₹1.8Cr revenue in first quarter',
    },
    {
        'title': 'Meridian Clinic Network', 'tag': 'Web · Leads', 'hue': 'b',
        'year': '2025', 'blurb': 'Multi-location clinic sites with booking funnels and local SEO.',
        'result': '3x qualified appointment requests',
    },
    {
        'title': 'Northwind Rebrand', 'tag': 'Brand · Web', 'hue': 'a',
        'year': '2024', 'blurb': 'Complete identity refresh and website for a logistics company.',
        'result': 'Won 2 enterprise contracts post-launch',
    },
    {
        'title': 'Solace Podcast Studio', 'tag': 'Video · Content', 'hue': 'd',
        'year': '2026', 'blurb': 'Podcast production system — filming, edits, clips and channel growth.',
        'result': '150K subscribers in a year',
    },
    {
        'title': 'Orbit Labs Platform', 'tag': 'App · Web', 'hue': 'c',
        'year': '2024', 'blurb': 'Developer platform dashboard, docs site and self-serve billing.',
        'result': 'Churn down 22% after redesign',
    },
]

# Founders — developer first, always.
FOUNDERS = [
    {
        'role': 'Co-Founder · Engineering',
        'email': 'developer@pixelsandcodestudios.com',
        'img': 'img/founder-developer',
        'blurb': 'Leads every build — websites, apps and platforms. If it ships, it went through him.',
    },
    {
        'role': 'Co-Founder · Content',
        'email': 'content@pixelsandcodestudios.com',
        'img': 'img/founder-content',
        'blurb': 'Owns strategy and content — the hooks, the calendars and the growth loops.',
    },
    {
        'role': 'Co-Founder · Post-Production',
        'email': 'editor@pixelsandcodestudios.com',
        'img': 'img/founder-editor',
        'blurb': 'Runs the edit suite — grades, sound and motion that make every frame land.',
    },
]

VALUES = [
    {'num': '01', 'title': 'Craft over volume', 'blurb': 'Fewer clients, deeper work. We would rather ship one thing that moves the needle than ten that fill a slide.'},
    {'num': '02', 'title': 'One team, zero handoffs', 'blurb': 'Design, engineering and growth sit in the same room. Nothing gets lost between agencies.'},
    {'num': '03', 'title': 'Numbers or it didn’t happen', 'blurb': 'Every engagement has a metric attached. We report on it whether it flatters us or not.'},
    {'num': '04', 'title': 'Speed is a feature', 'blurb': 'Aggressive timelines, weekly ships. Momentum compounds — for brands and for us.'},
]

FAQS = [
    {'q': 'How fast can we start?', 'a': 'Discovery calls happen within the week. Most projects kick off within 2 weeks of signing.'},
    {'q': 'What does an engagement cost?', 'a': 'Projects start under ₹1L for focused sprints and scale with scope. Tell us your budget — we will tell you what it buys.'},
    {'q': 'Do you work with international clients?', 'a': 'Yes. We are Hyderabad-based and async-friendly, with overlap hours for US and EU time zones.'},
    {'q': 'Who will actually do the work?', 'a': 'The founders stay on every account. Specialists plug in per discipline — no outsourcing chains.'},
]
