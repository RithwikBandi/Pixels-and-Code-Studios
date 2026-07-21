from django.shortcuts import render

SERVICES = [
    {
        'num': '01',
        'title': 'Websites',
        'blurb': 'High-performance sites engineered to convert — from landing pages to full platforms.',
        'tag': 'Design · Develop · Deploy',
    },
    {
        'num': '02',
        'title': 'App Development',
        'blurb': 'Web and mobile apps built for scale, shipped fast without cutting corners.',
        'tag': 'iOS · Android · Web',
    },
    {
        'num': '03',
        'title': 'Content Creation',
        'blurb': 'Scroll-stopping content pipelines that keep your audience coming back daily.',
        'tag': 'Short-form · Long-form',
    },
    {
        'num': '04',
        'title': 'Personal Branding',
        'blurb': 'We turn founders and creators into recognizable, trusted names in their niche.',
        'tag': 'Strategy · Identity · Growth',
    },
    {
        'num': '05',
        'title': 'Video Editing',
        'blurb': 'Cinema-grade edits, color and sound design that make every frame earn attention.',
        'tag': 'Edit · Grade · Motion',
    },
    {
        'num': '06',
        'title': 'Sales & Leads',
        'blurb': 'Outbound systems and funnels that fill your calendar with qualified conversations.',
        'tag': 'Funnels · Outreach · CRM',
    },
    {
        'num': '07',
        'title': 'Marketing',
        'blurb': 'Full-stack marketing and commercialization that turns products into revenue.',
        'tag': 'Paid · Organic · Launch',
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

WORK = [
    {'title': 'Lumen SaaS Platform', 'tag': 'Web · Product', 'hue': 'a'},
    {'title': 'Forge Fitness App', 'tag': 'App · Brand', 'hue': 'b'},
    {'title': 'Creator Growth Engine', 'tag': 'Content · Video', 'hue': 'c'},
    {'title': 'Atlas D2C Launch', 'tag': 'Marketing · Sales', 'hue': 'd'},
]


def home(request):
    return render(request, 'home.html', {
        'services': SERVICES,
        'stats': STATS,
        'process': PROCESS,
        'work': WORK,
    })
