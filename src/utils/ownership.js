const knownOwners = {

    daniel: [
        'Scheduler',
        'Ghost-Moya',
        'Ghost-Release',
        'super-slimer',
        'Stats-Service',
        'UpdateCheck',
        'stripe.ghost.org',
        'Ghost',
        'Admin',
        'express-hbs',
        'Ghost-CLI',
        'action-deploy-theme',
        'knex-migrator',
        'SDK',
        'gscan',
        'Portal',
        'Members',
        'Koenig',
        'Utils',
        'bookshelf-relations',
        'api-demos',
        'Ghost-Storage-Base',
        'slimer',
        'action-update-posts',
        'action-ghost-release',
        'digitalocean-1-click',
        'eslint-plugin-ghost',
        'Core',
        'Publishing',
        'framework',
        'slimer-dashboard',
        'label-actions'
    ],

    joe: [
        'dnscontrol',
        'Zuul',
        'terraform',
        'maintenance',
        'AppMonitor',
        'Dispatcher.js',
        'Pro',
        'offline',
        'jenkins-jobs',
        'dispatcher-stats',
        'fail',
        'pro-slack-bot',
        'sleep',
        'error',
        'Daisy.js',
        'Ghost-Pro',
        'HAL',
        'Deploy',
        'static',
        'nameservers'
    ],

    sam: [
        'logo',
        'account',
        'update',
        'stripe-migrate',
        'activate',
        'elastic-alerting',
        'Ghost.org',
        'domain',
        'pro-functions',
        'medium-scraper',
        'billing',
        'cert-manager-go',
        'helpscout-app',
        'Valet',
        'elasticsearch-bunyan',
        'wp-ghost-exporter',
        'nodecmsguide',
        'migrate',
        'algolia',
        'gctools',
        'bunyan-rotating-file-stream',
        'Zapier'
    ]
};

module.exports = {
    containsKnownOwner: (owners) => {
        const ownerNames = Object.keys(knownOwners);
        return owners.some(o => ownerNames.includes(o));
    },
    matchOwner: (owners, name) => {
        return owners.some((o) => {
            return knownOwners[o].includes(name);
        });
    }
};
