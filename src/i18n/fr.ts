import type { Dict } from './ar';

/**
 * French. Typed as `Dict`, so a string added to Arabic and forgotten here is a
 * build error rather than an Arabic sentence appearing on the French page --
 * the same failure the desktop app hit when its toasts stayed French while the
 * UI spoke Arabic.
 *
 * Not a translation of the Arabic word for word. The legal vocabulary is
 * French, so the French copy uses the profession's own terms (acte, procès-
 * verbal, significations, requis) rather than a literal rendering.
 */
export const fr: Dict = {
  htmlLang: 'fr',
  dir: 'ltr',
  localeTag: 'fr-MA',

  meta: {
    title: 'Lexi — l’archive du commissaire de justice, sur votre machine, hors ligne',
    description:
      'Logiciel de bureau pour commissaires de justice : conserve vos dossiers et vos pièces, lit les documents en arabe et en français, prépare vos actes et vos procès-verbaux, et organise vos tournées de signification. Tout reste sur votre ordinateur.',
  },

  nav: {
    features: 'Ce qu’il fait',
    how: 'Comment ça marche',
    requirements: 'Configuration',
    download: 'Téléchargement',
    cta: 'Demander une licence',
    switchTo: 'العربية',
    switchHref: '/',
    home: 'Accueil',
  },

  hero: {
    eyebrow: 'Pour les commissaires de justice',
    title: 'Tous vos dossiers au même endroit, sur votre machine, sans internet.',
    lead: 'Lexi conserve vos dossiers et vos pièces, lit vos documents en arabe et en français, prépare vos actes et vos procès-verbaux, et organise vos tournées de signification. Tout reste sur votre ordinateur.',
    primary: 'Demander une licence d’essai',
    secondary: 'Voir ce qu’il fait',
    reassure:
      'Une seule connexion internet, à l’activation. Ensuite le logiciel fonctionne machine fermée.',
  },

  strip: [
    { title: 'Sans internet', body: 'L’archive, la recherche et les actes fonctionnent hors ligne.' },
    { title: 'Arabe et français', body: 'L’interface, les documents et les actes, dans les deux langues.' },
    { title: 'Vos données chez vous', body: 'Rien n’est envoyé en ligne. Les dossiers restent sur votre machine.' },
  ],

  features: {
    eyebrow: 'Ce qu’il fait',
    title: 'Quatre choses qui vous prennent du temps chaque jour.',
    items: [
      {
        icon: 'archive',
        title: 'Une archive rangée, une recherche immédiate',
        body: 'Chaque dossier à sa place, avec ses parties, ses dates et sa référence. Vous tapez un nom ou un numéro et le dossier apparaît en moins d’une seconde, même sur des milliers de dossiers.',
      },
      {
        icon: 'scan',
        title: 'Il lit la pièce à votre place',
        body: 'Déposez le المقال ou le jugement : Lexi le lit et en extrait les parties, les dates, le tribunal et la référence. Vous relisez et vous corrigez avant d’enregistrer — la décision finale reste la vôtre.',
      },
      {
        icon: 'document',
        title: 'Actes et procès-verbaux déjà prêts',
        body: 'Les modèles sont rédigés dans vos propres termes et vous pouvez les modifier quand vous voulez. Lexi remplit les données et vous sort un fichier Word prêt à imprimer et à signer.',
      },
      {
        icon: 'route',
        title: 'La tournée du jour sur une seule feuille',
        body: 'La liste du jour groupée par quartier : vous l’imprimez et vous partez. Le soir vous saisissez les résultats, et chaque tentative reste datée comme preuve de diligence.',
      },
    ],
  },

  how: {
    eyebrow: 'Comment ça marche',
    title: 'Trois étapes, puis vous travaillez comme d’habitude.',
    steps: [
      {
        title: 'Installez le logiciel',
        body: 'Un seul fichier d’installation sur votre ordinateur. Pas de serveur, pas de configuration, personne à faire venir.',
      },
      {
        title: 'Ajoutez vos dossiers',
        body: 'Glissez vos documents dans le logiciel. Il les lit et vous propose le classement et les données ; vous confirmez ou vous corrigez.',
      },
      {
        title: 'Travaillez',
        body: 'Cherchez, imprimez, préparez vos actes, planifiez votre tournée. À tout moment, même sans connexion.',
      },
    ],
  },

  video: {
    eyebrow: 'Voyez-le fonctionner',
    title: 'Deux minutes suffisent pour savoir s’il vous convient.',
    body: 'Un dossier réel, du début à la fin : on le dépose dans le logiciel, on le laisse le lire, on corrige ce qu’il faut, et on en sort un procès-verbal prêt à imprimer.',
    play: 'Lancer la vidéo',
  },

  showcase: {
    eyebrow: 'À l’intérieur du logiciel',
    items: [
      {
        title: 'L’archive telle que vous la voyez le matin',
        body: 'Les dossiers classés comme vous les classez, avec l’état de chacun et la date de la prochaine audience. Les échéances proches ressortent d’une autre couleur avant même que vous les cherchiez.',
        caption: 'Écran Archive',
      },
      {
        title: 'Le procès-verbal sort déjà rempli',
        body: 'Vous choisissez le modèle, Lexi le remplit avec les données du dossier : les parties, l’adresse, la date, et l’heure de la signification telle qu’elle a eu lieu. Ce qu’il ne sait pas, il le laisse en pointillés à remplir à la main — il n’invente jamais.',
        caption: 'Génération d’un procès-verbal',
      },
      {
        title: 'La tournée du jour, groupée par quartier',
        body: 'Une feuille avec les noms, les adresses, les références et deux colonnes vides pour écrire. Vous partez avec, vous revenez saisir ce qui s’est passé.',
        caption: 'Feuille de tournée',
      },
    ],
  },

  privacy: {
    eyebrow: 'Confidentialité',
    title: 'Les données de vos dossiers ne quittent pas votre cabinet.',
    body: 'Lexi n’envoie aucun document en ligne et n’en garde aucune copie chez nous. L’archive, les pièces et la lecture des documents fonctionnent entièrement sur votre machine. Nous ne voyons pas vos dossiers, et nous ne pouvons pas les voir.',
    points: [
      'Pas de compte, pas de cloud, aucune copie chez nous.',
      'Internet n’est requis qu’une fois : à l’activation de la licence.',
      'La sauvegarde est entre vos mains, sur le disque que vous choisissez.',
    ],
  },

  requirements: {
    eyebrow: 'Configuration',
    title: 'De quoi votre machine a-t-elle besoin ?',
    lead: 'L’archive, la recherche, les actes et la tournée fonctionnent sur n’importe quel PC Windows récent. Seule la lecture automatique des documents profite d’une carte graphique.',
    rows: [
      { label: 'Système', value: 'Windows 10 ou 11 (64-bit)' },
      { label: 'Mémoire', value: '8 GB minimum' },
      { label: 'Disque', value: '15 GB — dont ~9 GB pour la lecture automatique' },
      { label: 'Carte graphique', value: 'Facultative — sans elle la lecture fonctionne, mais plus lentement' },
    ],
    note: 'Les composants de lecture automatique se téléchargent après l’installation, et vous pouvez les ignorer et n’utiliser que l’archive. Le logiciel reste complet et utile sans eux.',
  },

  download: {
    eyebrow: 'Téléchargement',
    title: 'Télécharger Lexi',
    soonTitle: 'Le téléchargement se fait sur demande',
    soonBody:
      'La première version est remise avec une licence d’essai, car le logiciel ne démarre pas sans clé. Laissez-nous vos coordonnées et nous vous envoyons le lien et la clé ensemble.',
    button: 'Télécharger l’installateur',
    forWindows: 'Pour Windows 64-bit',
    version: 'Version',
    size: 'Taille',
    published: 'Publié le',
    checksumTitle: 'Vérifiez le fichier avant de l’installer',
    checksumBody:
      'Voici l’empreinte du fichier. Pour vous assurer que ce que vous avez téléchargé est bien ce que nous avons publié, ouvrez PowerShell et tapez :',
    checksumCompare:
      'Comparez ensuite le résultat à la ligne ci-dessus. S’ils diffèrent, n’installez pas le fichier et contactez-nous.',
    needKey: 'Une clé de licence est nécessaire pour démarrer le logiciel après l’installation.',
    requestInstead: 'Demander une licence d’essai',
  },

  form: {
    eyebrow: 'Licence d’essai',
    title: 'Demander une licence d’essai',
    lead: 'Quatre informations, pas plus. Nous vous envoyons la clé et le lien de téléchargement dans un seul message.',
    name: 'Nom complet',
    office: 'Étude et ville',
    officeHint: 'Exemple : Étude de signification — Casablanca',
    email: 'Adresse e-mail',
    phone: 'Téléphone',
    phoneHint: 'facultatif',
    message: 'Question ou remarque',
    messageHint: 'facultatif',
    submit: 'Envoyer la demande',
    sending: 'Envoi en cours…',
    error: 'Impossible d’envoyer la demande. Vérifiez vos informations et réessayez.',
    privacy:
      'Ces informations servent uniquement à vous répondre et à vous envoyer la clé. Nous ne demandons ni CIN ni adresse.',
    fallback: 'Ou écrivez-nous directement à',
  },

  thanks: {
    title: 'Nous avons bien reçu votre demande.',
    body: 'Nous vous répondons sous un à deux jours avec la clé de licence, le lien de téléchargement et la marche à suivre, étape par étape.',
    note: 'Si le message n’arrive pas, vérifiez vos courriers indésirables, ou écrivez-nous directement à',
    back: 'Retour à l’accueil',
  },

  footer: {
    tagline: 'L’archive du commissaire de justice — sur votre machine, sans internet.',
    contact: 'Contact',
    rights: 'Tous droits réservés.',
  },
};
