export interface ServerConfig {
  serverName: string;
  serverIP: string;
  connectLink: string;
  discord: string;
  wipe: string;
  mode: string;
  teamLimit: string;
  tagline: string;
  footerLine: string;
  battlemetricsServerId: string;
  battlemetricsLabel: string;
  defaultLang: 'sk' | 'cz';
  donateLabel: string;
  donateUrl: string;
  promoEnabled: boolean;
  promoText_sk: string;
  promoText_cz: string;
  topRules_sk: string[];
  topRules_cz: string[];
  donateLabel_sk: string;
  donateLabel_cz: string;
  donateComingSoon: boolean;
  donateComingSoonText_sk: string;
  donateComingSoonText_cz: string;
  donateDiscordCta_sk: string;
  donateDiscordCta_cz: string;
  donateDiscordText_sk: string;
  donateDiscordText_cz: string;
}

export interface GalleryImage {
  file: string;
  title: string;
  desc: string;
}
