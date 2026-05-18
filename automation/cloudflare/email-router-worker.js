const DOMAIN = 'velkor.com.mx';

const ALIASES = new Set([
  `contacto@${DOMAIN}`,
  `hola@${DOMAIN}`,
  `seguridad@${DOMAIN}`,
  `soporte@${DOMAIN}`,
  `noreply@${DOMAIN}`,
]);

const DESTINATIONS = [
  'sandro.ruelas@hotmail.com',
  'ruelas.edgar@outlook.com',
];

export default {
  async email(message) {
    const target = message.to.toLowerCase();
    const isCatchAll = target.endsWith(`@${DOMAIN}`);

    if (!ALIASES.has(target) && !isCatchAll) {
      message.setReject('Unknown Velkor recipient');
      return;
    }

    const failures = [];

    for (const destination of DESTINATIONS) {
      try {
        await message.forward(destination);
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unknown forwarding error';
        failures.push({ destination, reason });
      }
    }

    if (failures.length === DESTINATIONS.length) {
      message.setReject('Velkor forwarding destinations unavailable');
    }
  },
};
