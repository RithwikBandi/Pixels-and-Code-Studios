from django.contrib import messages
from django.shortcuts import redirect, render

from . import data
from .forms import ContactForm


def home(request):
    return render(request, 'home.html', {
        'services': data.SERVICES,
        'stats': data.STATS,
        'process': data.PROCESS,
        'work': data.WORK[:4],
        'team': data.TEAM,
        'testimonials': data.TESTIMONIALS,
        'founders': data.FOUNDERS,
    })


def work(request):
    return render(request, 'work.html', {
        'work': data.WORK,
        'stats': data.STATS,
    })


def services(request):
    return render(request, 'services.html', {
        'services': data.SERVICES,
        'process': data.PROCESS,
        'faqs': data.FAQS,
    })


def about(request):
    return render(request, 'about.html', {
        'founders': data.FOUNDERS,
        'team': data.TEAM,
        'values': data.VALUES,
        'stats': data.STATS,
    })


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(
                request,
                'Got it — your inquiry is in. We reply within one business day.',
            )
            return redirect('core:contact')
    else:
        form = ContactForm()

    return render(request, 'contact.html', {
        'form': form,
        'founders': data.FOUNDERS,
        'faqs': data.FAQS,
    })
