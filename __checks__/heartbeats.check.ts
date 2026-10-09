import { HeartbeatMonitor } from 'checkly/constructs'

// Sauvegarde quotidienne PostgreSQL (/opt/dzai/scripts/backup.sh, vers 3 h).
// À la fin de backup.sh, uniquement si pg_dump a réussi :
//   curl -fsS --retry 3 <URL de ping affichée dans Checkly>
const backup = new HeartbeatMonitor('dzai-backup-daily', {
  name: 'DZ AI PRO - Sauvegarde quotidienne PostgreSQL',
  period: 1,
  periodUnit: 'days',
  grace: 2,
  graceUnit: 'hours',
  activated: true,
})
backup.checkIntent = {
  goal: 'Savoir immédiatement si la sauvegarde quotidienne de la base DZ AI PRO ne s’est pas faite.',
  constraints: [
    { type: 'REQUIRED_OUTCOME', statement: 'Une alerte part si aucun signal de sauvegarde réussie n’arrive dans les 24 heures, plus 2 heures de marge.' },
    { type: 'MUST_PRESERVE', statement: 'Le signal n’est envoyé que lorsque la sauvegarde PostgreSQL a réussi.' },
  ],
}

// Tâche node-cron "0 0 1 * *" : remise à niveau mensuelle des crédits d'abonnement.
// À la fin de la tâche dans src/index.js, après la boucle :
//   await fetch('<URL de ping affichée dans Checkly>')
const subscriptionReset = new HeartbeatMonitor('dzai-subscription-reset-monthly', {
  name: 'DZ AI PRO - Reset mensuel des abonnements',
  period: 31,
  periodUnit: 'days',
  grace: 1,
  graceUnit: 'days',
  activated: true,
})
subscriptionReset.checkIntent = {
  goal: 'Savoir si la remise à niveau mensuelle des crédits d’abonnement ne s’est pas exécutée.',
  constraints: [
    { type: 'REQUIRED_OUTCOME', statement: 'Une alerte part si aucun signal de fin de tâche mensuelle n’arrive dans les 31 jours, plus 1 jour de marge.' },
    { type: 'MUST_PRESERVE', statement: 'Le signal n’est envoyé qu’une fois la tâche mensuelle terminée sans erreur.' },
  ],
}
