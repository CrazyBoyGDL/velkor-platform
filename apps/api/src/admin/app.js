import velkorSymbol from './extensions/velkor-symbol.svg';

export default {
  config: {
    locales: ['es'],
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
