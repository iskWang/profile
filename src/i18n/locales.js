export const LOCALES = {
  zh: { lang: 'zh', htmlLang: 'zh-TW', prefix: 'zh-tw', ogLocale: 'zh_TW', dateLocale: 'zh-TW' },
  en: { lang: 'en', htmlLang: 'en', prefix: 'en', ogLocale: 'en_US', dateLocale: 'en-US' },
};

export function localePath(lang, path = '') {
  const suffix = path ? `/${path.replace(/^\/+/, '')}` : '';
  return `/${LOCALES[lang].prefix}${suffix}`;
}

export function otherLang(lang) {
  return lang === 'zh' ? 'en' : 'zh';
}
