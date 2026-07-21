from django import forms

from .models import ContactMessage

SERVICE_CHOICES = [
    ('', 'What do you need?'),
    ('websites', 'Website'),
    ('apps', 'App Development'),
    ('content', 'Content Creation'),
    ('branding', 'Personal Branding'),
    ('video', 'Video Editing'),
    ('leads', 'Sales & Leads'),
    ('marketing', 'Marketing'),
    ('other', 'Something else'),
]

BUDGET_CHOICES = [
    ('', 'Budget range'),
    ('<2k', 'Under $2,000'),
    ('2-5k', '$2,000 to $5,000'),
    ('5-15k', '$5,000 to $15,000'),
    ('15k+', '$15,000+'),
]


class ContactForm(forms.ModelForm):
    service = forms.ChoiceField(choices=SERVICE_CHOICES, required=False)
    budget = forms.ChoiceField(choices=BUDGET_CHOICES, required=False)

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'service', 'budget', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Your name', 'autocomplete': 'name'}),
            'email': forms.EmailInput(attrs={'placeholder': 'you@company.com', 'autocomplete': 'email'}),
            'message': forms.Textarea(attrs={
                'placeholder': 'Tell us about the project: goals, timeline, links…',
                'rows': 6,
            }),
        }

    def clean_message(self):
        message = self.cleaned_data['message'].strip()
        if len(message) < 10:
            raise forms.ValidationError('Please add a bit more detail, at least 10 characters.')
        return message
