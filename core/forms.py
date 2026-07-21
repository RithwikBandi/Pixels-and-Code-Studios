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
    ('<1l', 'Under ₹1L'),
    ('1-3l', '₹1L – ₹3L'),
    ('3-10l', '₹3L – ₹10L'),
    ('10l+', '₹10L+'),
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
                'placeholder': 'Tell us about the project — goals, timeline, links…',
                'rows': 6,
            }),
        }

    def clean_message(self):
        message = self.cleaned_data['message'].strip()
        if len(message) < 10:
            raise forms.ValidationError('Tell us a little more — at least 10 characters.')
        return message
