import velkorSymbol from './extensions/velkor-symbol.svg';

export default {
  config: {
    locales: ['es', 'en'],
    auth: {
      logo: velkorSymbol,
    },
    menu: {
      logo: velkorSymbol,
    },
    head: {
      favicon: velkorSymbol,
    },
    tutorials: false,
    notifications: {
      releases: false,
    },
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Velkor Systems',
        'Auth.form.welcome.title': 'Velkor Operations',
        'Auth.form.welcome.subtitle': 'Content, leads, and commercial evidence',
        'HomePage.helmet.title': 'Velkor Operations',
        'app.components.HomePage.welcome.again': 'Welcome to Velkor operations',
      },
      es: {
        'app.components.LeftMenu.navbrand.title': 'Velkor Systems',
        'Auth.form.welcome.title': 'Panel de operacion Velkor',
        'Auth.form.welcome.subtitle': 'Contenido, leads y evidencia comercial',
        'HomePage.helmet.title': 'Operacion Velkor',
        'app.components.HomePage.welcome.again': 'Bienvenido al panel de operacion',
      },
    },
  },
  bootstrap() {},
};
