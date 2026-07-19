/*
  GOOGLE ANALYTICS 4
  Identifiant de mesure : G-YXYJPWK3RZ
  Le script Google Analytics est chargé uniquement après consentement explicite.
*/
const GA_MEASUREMENT_ID = 'G-YXYJPWK3RZ';
const CONSENT_KEY = 'lcdc_analytics_consent';

function isAnalyticsConfigured() {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
}

function loadGoogleAnalytics() {
  if (!isAnalyticsConfigured() || window.__lcdcAnalyticsLoaded) return;

  window.__lcdcAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);
}

function deleteAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('=')[0])
    .filter((name) => name === '_ga' || name.startsWith('_ga_'));

  cookieNames.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
  });
}

function applyAnalyticsConsent(choice) {
  localStorage.setItem(CONSENT_KEY, choice);

  if (choice === 'accepted') {
    loadGoogleAnalytics();
    return;
  }

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
  deleteAnalyticsCookies();
}

window.LCDCAnalytics = {
  key: CONSENT_KEY,
  configured: isAnalyticsConfigured,
  applyConsent: applyAnalyticsConsent,
  load: loadGoogleAnalytics
};

if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
  loadGoogleAnalytics();
}
