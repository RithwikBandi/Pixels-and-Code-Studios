from django.test import TestCase
from django.urls import reverse

from .models import ContactMessage


class PageTests(TestCase):
    def test_home_renders(self):
        res = self.client.get(reverse('core:home'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'WE BUILD')
        self.assertContains(res, 'Seven crafts.')

    def test_work_renders(self):
        res = self.client.get(reverse('core:work'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Lumen SaaS Platform')
        self.assertContains(res, 'Orbit Labs Platform')

    def test_services_renders(self):
        res = self.client.get(reverse('core:services'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'App Development')
        self.assertContains(res, 'id="websites"')

    def test_about_renders(self):
        res = self.client.get(reverse('core:about'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, 'Three leaders.')
        self.assertContains(res, 'CTO · Chief Technology Officer')

    def test_contact_renders_form(self):
        res = self.client.get(reverse('core:contact'))
        self.assertEqual(res.status_code, 200)
        self.assertContains(res, '<form', 1)
        self.assertContains(res, 'csrfmiddlewaretoken')

    def test_contact_form_carries_web3forms_key(self):
        res = self.client.get(reverse('core:contact'))
        self.assertContains(res, 'data-w3f-key="bf0c7808-decb-46db-820e-5a3372304a00"')

    def test_counters_render_final_values_without_js(self):
        """Stats must show real numbers in raw markup, never 0."""
        res = self.client.get(reverse('core:home'))
        self.assertContains(res, 'data-target="120">120</span>')
        self.assertContains(res, 'data-target="40">40</span>')

    def test_favicon_links_present(self):
        res = self.client.get(reverse('core:home'))
        self.assertContains(res, 'favicon-32.png')
        self.assertContains(res, 'apple-touch-icon.png')


class FounderOrderTests(TestCase):
    """The developer founder must always be listed first."""

    def assert_developer_first(self, url_name):
        html = self.client.get(reverse(url_name)).content.decode()
        dev = html.find('developer@pixelsandcodestudios.com')
        content = html.find('content@pixelsandcodestudios.com')
        editor = html.find('editor@pixelsandcodestudios.com')
        self.assertNotEqual(dev, -1)
        self.assertLess(dev, content)
        self.assertLess(dev, editor)

    def test_about_page(self):
        self.assert_developer_first('core:about')

    def test_contact_page(self):
        self.assert_developer_first('core:contact')

    def test_home_page(self):
        self.assert_developer_first('core:home')


class ContactFormTests(TestCase):
    def valid_payload(self, **overrides):
        payload = {
            'name': 'Test Client',
            'email': 'client@example.com',
            'service': 'websites',
            'budget': '2-5k',
            'message': 'We need a new marketing site with a booking funnel.',
        }
        payload.update(overrides)
        return payload

    def test_valid_submission_saves_and_redirects(self):
        res = self.client.post(reverse('core:contact'), self.valid_payload())
        self.assertRedirects(res, reverse('core:contact'))
        self.assertEqual(ContactMessage.objects.count(), 1)
        msg = ContactMessage.objects.get()
        self.assertEqual(msg.email, 'client@example.com')

    def test_success_message_shown_after_submit(self):
        res = self.client.post(
            reverse('core:contact'), self.valid_payload(), follow=True,
        )
        self.assertContains(res, 'your inquiry is in')

    def test_missing_fields_rejected(self):
        res = self.client.post(reverse('core:contact'), {})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_invalid_email_rejected(self):
        res = self.client.post(
            reverse('core:contact'), self.valid_payload(email='not-an-email'),
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_too_short_message_rejected(self):
        res = self.client.post(
            reverse('core:contact'), self.valid_payload(message='hi'),
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(ContactMessage.objects.count(), 0)
        self.assertContains(res, 'at least 10 characters')

    def test_optional_fields_can_be_blank(self):
        res = self.client.post(
            reverse('core:contact'), self.valid_payload(service='', budget=''),
        )
        self.assertRedirects(res, reverse('core:contact'))
        self.assertEqual(ContactMessage.objects.count(), 1)
