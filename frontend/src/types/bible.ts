export interface BibleVersion {
  id: string;
  name: string;
  shortName: string;
  language: string;
  langCode: string;
  testamentScope: 'ALL' | 'NT' | 'OT';
  description?: string;
}

export interface LanguageGroup {
  code: string;
  name: string;
  versions: BibleVersion[];
}

export const BIBLE_LANGUAGES: LanguageGroup[] = [
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    versions: [
      {
        id: 'TB',
        name: 'Terjemahan Baru (TB)',
        shortName: 'TB',
        language: 'Bahasa Indonesia',
        langCode: 'id',
        testamentScope: 'ALL',
        description: 'Standar Lembaga Alkitab Indonesia (LAI)'
      },
      {
        id: 'TL',
        name: 'Terjemahan Lama (TL)',
        shortName: 'TL',
        language: 'Bahasa Indonesia',
        langCode: 'id',
        testamentScope: 'ALL',
        description: 'Klinkert / Bode 1958'
      },
      {
        id: 'AYT',
        name: 'Alkitab Yang Terbuka (AYT)',
        shortName: 'AYT',
        language: 'Bahasa Indonesia',
        langCode: 'id',
        testamentScope: 'ALL',
        description: 'Bahasa Indonesia Terbuka © 2018-2022 Yayasan Lembaga SABDA'
      }
    ]
  },
  {
    code: 'jv',
    name: 'Basa Jawa',
    versions: [
      {
        id: 'JVN',
        name: 'Basa Jawa Suriname (PB)',
        shortName: 'JVN',
        language: 'Basa Jawa',
        langCode: 'jv',
        testamentScope: 'NT',
        description: 'Kitab Sutji Prejanjian Anyar'
      }
    ]
  },
  {
    code: 'en',
    name: 'English',
    versions: [
      {
        id: 'KJV',
        name: 'King James Version (KJV)',
        shortName: 'KJV',
        language: 'English',
        langCode: 'en',
        testamentScope: 'ALL',
        description: 'Authorized King James Version'
      },
      {
        id: 'KJVS',
        name: 'KJV with Strong Numbers',
        shortName: 'KJV-S',
        language: 'English',
        langCode: 'en',
        testamentScope: 'ALL',
        description: 'KJV dengan Nomor Strong Ibrani/Yunani'
      }
    ]
  },
  {
    code: 'grc',
    name: 'Yunani (Greek)',
    versions: [
      {
        id: 'TR',
        name: 'Textus Receptus (Greek NT)',
        shortName: 'TR',
        language: 'Yunani Kuno (Greek)',
        langCode: 'grc',
        testamentScope: 'NT',
        description: 'Perjanjian Baru Teks Yunani'
      },
      {
        id: 'TRP',
        name: 'Textus Receptus Parsed (Greek NT)',
        shortName: 'TRP',
        language: 'Yunani Kuno (Greek)',
        langCode: 'grc',
        testamentScope: 'NT',
        description: 'Dilengkapi Kode Strong & Morfologi'
      }
    ]
  }
];

export const ALL_BIBLE_VERSIONS: BibleVersion[] = BIBLE_LANGUAGES.flatMap(lang => lang.versions);
export const DEFAULT_BIBLE_VERSION: BibleVersion = ALL_BIBLE_VERSIONS.find(v => v.id === 'AYT') || ALL_BIBLE_VERSIONS[0];